import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, writeFile as writeFileFn } from 'fs/promises'
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

  const project = await prisma.project.findFirst({ where: { id: projectId, userId: session.user.id } })
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  const uploadDir = join(process.cwd(), 'public', 'uploads', projectId)
  if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true })

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const ts = Date.now()
  const originalName = `original-${ts}.${ext}`
  const originalPath = join(uploadDir, originalName)
  const bytes = await file.arrayBuffer()
  await writeFile(originalPath, Buffer.from(bytes))

  const pageCount = await prisma.page.count({ where: { projectId } })
  const page = await prisma.page.create({
    data: {
      projectId,
      order: pageCount,
      originalUrl: `/uploads/${projectId}/${originalName}`,
      status: 'PROCESSING',
    }
  })

  // Fire and forget
  triggerConversion(page.id, originalPath, uploadDir, ts, projectId).catch(console.error)

  return NextResponse.json({ page })
}

async function triggerConversion(
  pageId: string,
  originalPath: string,
  uploadDir: string,
  ts: number,
  projectId: string
) {
  const replicateToken = process.env.REPLICATE_API_TOKEN
  const isMock = !replicateToken || replicateToken === 'placeholder_replace_me'

  if (isMock) {
    // Fallback: sharp edge detection
    await convertWithSharp(pageId, originalPath, uploadDir, ts, projectId)
    return
  }

  try {
    await convertWithReplicate(pageId, originalPath, uploadDir, ts, projectId, replicateToken)
  } catch (err) {
    console.error('Replicate failed, falling back to sharp:', err)
    await convertWithSharp(pageId, originalPath, uploadDir, ts, projectId)
  }
}

async function convertWithReplicate(
  pageId: string,
  originalPath: string,
  uploadDir: string,
  ts: number,
  projectId: string,
  token: string
) {
  // Convert image to base64 data URL for Replicate
  const { readFile } = await import('fs/promises')
  const imageBytes = await readFile(originalPath)
  const ext = originalPath.split('.').pop()?.toLowerCase() || 'jpeg'
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'
  const base64Image = `data:${mimeType};base64,${imageBytes.toString('base64')}`

  // Use catacolabs/cartoonify — cartoon-style line art perfect for coloring books
  const createRes = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'f109015d60170dfb20460f17da8cb863155823c85ece1115e1e9e4ec7ef51d3b',
      input: { image: base64Image },
    }),
  })

  if (!createRes.ok) {
    const err = await createRes.text()
    throw new Error(`Replicate create failed: ${createRes.status} ${err}`)
  }

  const prediction = await createRes.json()
  let predId = prediction.id

  // Poll until done (max 3 mins)
  let outputUrl: string | null = null
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${predId}`, {
      headers: { 'Authorization': `Token ${token}` },
    })
    const poll = await pollRes.json()
    console.log(`Replicate poll ${i + 1}: ${poll.status}`)

    if (poll.status === 'succeeded') {
      outputUrl = Array.isArray(poll.output) ? poll.output[0] : poll.output
      break
    }
    if (poll.status === 'failed' || poll.status === 'canceled') {
      throw new Error(`Replicate prediction ${poll.status}: ${poll.error}`)
    }
  }

  if (!outputUrl) throw new Error('Replicate timed out')

  // Download the output image
  const imgRes = await fetch(outputUrl)
  if (!imgRes.ok) throw new Error(`Failed to download output: ${imgRes.status}`)
  const imgBuffer = Buffer.from(await imgRes.arrayBuffer())

  const lineArtName = `lineart-${ts}.png`
  const lineArtPath = join(uploadDir, lineArtName)
  await writeFileFn(lineArtPath, imgBuffer)

  await prisma.page.update({
    where: { id: pageId },
    data: {
      lineArtUrl: `/uploads/${projectId}/${lineArtName}`,
      status: 'DONE',
    }
  })

  console.log(`✅ Replicate conversion done for page ${pageId}`)
}

async function convertWithSharp(
  pageId: string,
  originalPath: string,
  uploadDir: string,
  ts: number,
  projectId: string
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sharp = require('sharp')
    const { execSync } = await import('child_process')
    const { existsSync: fsExists } = await import('fs')

    const lineArtName = `lineart-${ts}.png`
    const lineArtPath = join(uploadDir, lineArtName)
    const bmpPath = join(uploadDir, `tmp-${ts}.bmp`)
    const svgPath = join(uploadDir, `tmp-${ts}.svg`)

    // Step 1: Preprocess with sharp — reduce colors, enhance edges, B&W
    await sharp(originalPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .greyscale()
      .normalise()
      .median(3)                    // reduce noise
      .sharpen({ sigma: 1.5 })       // crisp edges
      .threshold(128)               // clean B&W
      .toFormat('bmp')
      .toFile(bmpPath)

    // Step 2: Potrace - bitmap → smooth SVG vector curves
    const potraceAvail = (() => { try { execSync('which potrace'); return true; } catch { return false; } })()

    if (potraceAvail) {
      execSync(`potrace "${bmpPath}" -s -o "${svgPath}" --blacklevel 0.5 --alphamax 1.0 --opttolerance 0.2`, { stdio: 'pipe' })

      // Step 3: Convert SVG to PNG via rsvg-convert or ImageMagick, fallback to sharp BMP
      try {
        execSync(`rsvg-convert -o "${lineArtPath}" "${svgPath}"`, { stdio: 'pipe' })
      } catch {
        try {
          execSync(`convert "${svgPath}" "${lineArtPath}"`, { stdio: 'pipe' })
        } catch {
          // Final fallback: sharp on the BMP (inverted = white bg black lines)
          await sharp(bmpPath).negate().png().toFile(lineArtPath)
        }
      }

      // Cleanup temp files
      try { require('fs').unlinkSync(bmpPath); require('fs').unlinkSync(svgPath); } catch {}
    } else {
      // No potrace — use sharp with better settings for coloring-book look
      await sharp(originalPath)
        .resize({ width: 1200, withoutEnlargement: true })
        .greyscale()
        .normalise()
        .median(3)
        .sharpen({ sigma: 2 })
        .convolve({ width: 3, height: 3, kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1] })
        .negate()
        .normalise()
        .threshold(200)
        .png()
        .toFile(lineArtPath)
    }

    if (!fsExists(lineArtPath)) throw new Error('Line art file not created')

    await prisma.page.update({
      where: { id: pageId },
      data: {
        lineArtUrl: `/uploads/${projectId}/${lineArtName}`,
        status: 'DONE',
      }
    })
  } catch (err) {
    console.error('Sharp/Potrace conversion failed:', err)
    await prisma.page.update({
      where: { id: pageId },
      data: { status: 'FAILED' }
    })
  }
}
