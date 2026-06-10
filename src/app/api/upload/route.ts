import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

async function triggerConversion(pageId: string, originalPath: string) {
  // Fire and forget — don't await
  convertPage(pageId, originalPath).catch(console.error)
}

async function convertPage(pageId: string, originalPath: string) {
  await prisma.page.update({ where: { id: pageId }, data: { status: 'PROCESSING' } })

  const token = process.env.REPLICATE_API_TOKEN
  if (!token || token === 'placeholder_replace_me') {
    // Mock: just use the original as line art
    await new Promise(r => setTimeout(r, 2000))
    await prisma.page.update({ where: { id: pageId }, data: { lineArtUrl: originalPath, status: 'DONE' } })
    return
  }

  try {
    const { readFile } = await import('fs/promises')
    const imageBuffer = await readFile(join(process.cwd(), 'public', originalPath))
    const base64 = imageBuffer.toString('base64')
    const ext = originalPath.split('.').pop() || 'jpg'
    const dataUri = `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${base64}`

    const res = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: '435061a1b5a4c1e26740464bf786efdfa9cb3a3ac488595a2de23e143fdb0117',
        input: {
          image: dataUri,
          prompt: 'coloring book page, black and white line art, clean outlines, no fills, hand drawn style, white background',
          negative_prompt: 'color, shading, grey, gray, filled, photorealistic',
          num_inference_steps: 20,
        },
      }),
    })

    const prediction = await res.json()
    let predictionUrl = `https://api.replicate.com/v1/predictions/${prediction.id}`

    // Poll until done
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 3000))
      const poll = await fetch(predictionUrl, { headers: { 'Authorization': `Token ${token}` } })
      const data = await poll.json()
      if (data.status === 'succeeded' && data.output) {
        // Download the output image
        const imgRes = await fetch(Array.isArray(data.output) ? data.output[0] : data.output)
        const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
        const lineArtPath = originalPath.replace(/original-/, 'lineart-')
        await writeFile(join(process.cwd(), 'public', lineArtPath), imgBuffer)
        await prisma.page.update({ where: { id: pageId }, data: { lineArtUrl: lineArtPath, status: 'DONE' } })
        return
      }
      if (data.status === 'failed') break
    }

    await prisma.page.update({ where: { id: pageId }, data: { status: 'FAILED' } })
  } catch (e) {
    console.error('Conversion error:', e)
    await prisma.page.update({ where: { id: pageId }, data: { status: 'FAILED' } })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('projectId') as string

    if (!file || !projectId) return NextResponse.json({ error: 'Missing file or projectId' }, { status: 400 })
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })

    // Verify project belongs to user
    const project = await prisma.project.findFirst({ where: { id: projectId, userId: session.user.id } })
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `original-${Date.now()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads', projectId)
    await mkdir(uploadDir, { recursive: true })
    const filePath = join(uploadDir, filename)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    const originalUrl = `/uploads/${projectId}/${filename}`

    // Count existing pages for order
    const pageCount = await prisma.page.count({ where: { projectId } })
    const page = await prisma.page.create({
      data: { projectId, originalUrl, order: pageCount, status: 'PENDING' },
    })

    // Fire conversion in background
    triggerConversion(page.id, originalUrl)

    return NextResponse.json({ success: true, pageId: page.id, originalUrl }, { status: 201 })
  } catch (e: any) {
    console.error('Upload error:', e)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
