import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File
  const projectId = form.get('projectId') as string

  if (!file || !projectId) return NextResponse.json({ error: 'Missing file or projectId' }, { status: 400 })
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })

  // Verify project ownership
  const project = await prisma.project.findFirst({ where: { id: projectId, userId: session.user.id } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  // Save original file
  const uploadDir = join(process.cwd(), 'public', 'uploads', projectId)
  if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true })

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const ts = Date.now()
  const originalName = `original-${ts}.${ext}`
  const originalPath = join(uploadDir, originalName)
  const bytes = await file.arrayBuffer()
  await writeFile(originalPath, Buffer.from(bytes))

  // Count existing pages for order
  const pageCount = await prisma.page.count({ where: { projectId } })

  // Create page record
  const page = await prisma.page.create({
    data: {
      projectId,
      order: pageCount,
      originalUrl: `/uploads/${projectId}/${originalName}`,
      status: 'PROCESSING',
    }
  })

  // Trigger conversion in background (non-blocking)
  triggerConversion(page.id, originalPath, uploadDir, ts, ext).catch(console.error)

  return NextResponse.json({ page })
}

async function triggerConversion(pageId: string, originalPath: string, uploadDir: string, ts: number, ext: string) {
  try {
    // Use sharp for server-side line art generation
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sharp = require('sharp')
    const lineArtName = `lineart-${ts}.png`
    const lineArtPath = join(uploadDir, lineArtName)

    const img = sharp(originalPath)
    const meta = await img.metadata()

    // Pipeline: greyscale → normalize → edge detect (Sobel-like via convolve) → invert → clean
    await sharp(originalPath)
      .greyscale()
      .normalise()
      // Sharpen to enhance edges before extraction
      .sharpen({ sigma: 2, m1: 0, m2: 3 })
      // Linear adjustment: boost contrast
      .linear(1.3, -30)
      // Convolve with edge-detection kernel (Laplacian)
      .convolve({
        width: 3,
        height: 3,
        kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
      })
      // Invert so edges are dark on white background (coloring book style)
      .negate()
      // Normalize contrast
      .normalise()
      // Threshold to make it crisp black & white
      .threshold(180)
      .png()
      .toFile(lineArtPath)

    // Get the project dir from uploadDir
    const parts = uploadDir.split(/[\\/]/)
    const projectId = parts[parts.length - 1]

    await prisma.page.update({
      where: { id: pageId },
      data: {
        lineArtUrl: `/uploads/${projectId}/${lineArtName}`,
        status: 'DONE',
      }
    })
  } catch (err) {
    console.error('Conversion failed:', err)
    // Fallback: use original as line art (mock)
    await prisma.page.update({
      where: { id: pageId },
      data: { status: 'FAILED' }
    })
  }
}
