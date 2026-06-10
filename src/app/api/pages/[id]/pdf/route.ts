import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const page = await prisma.page.findUnique({
    where: { id: params.id },
    include: { project: { select: { userId: true, title: true } } },
  })

  if (!page || page.project.userId !== (session.user as { id: string }).id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!page.lineArtUrl || page.status !== 'DONE') {
    return NextResponse.json({ error: 'Line art not ready' }, { status: 400 })
  }

  // Get the line art image path
  const lineArtPath = join(process.cwd(), 'public', page.lineArtUrl)
  if (!existsSync(lineArtPath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sharp = require('sharp')

  // A4 at 300 DPI = 2480 x 3508 pixels — upsample line art to this for crisp large-format printing
  const PRINT_W = 2480
  const PRINT_H = 3508
  const MARGIN_PX = 120 // ~10mm margin at 300dpi

  // Get original image metadata to preserve aspect ratio
  const meta = await sharp(lineArtPath).metadata()
  const origW = meta.width || PRINT_W
  const origH = meta.height || PRINT_H

  // Scale up to fill the A4 print area while preserving aspect ratio
  const targetW = PRINT_W - MARGIN_PX * 2
  const targetH = PRINT_H - MARGIN_PX * 2 - 120 // room for caption
  const scale = Math.min(targetW / origW, targetH / origH)
  const fitW = Math.round(origW * scale)
  const fitH = Math.round(origH * scale)

  // Upsample using Lanczos for best print quality, white background
  const printBuffer = await sharp(lineArtPath)
    .resize(fitW, fitH, { kernel: 'lanczos3', withoutEnlargement: false })
    .flatten({ background: { r: 255, g: 255, b: 255 } })  // white bg (removes transparency)
    .png({ compressionLevel: 6 })
    .toBuffer()

  // Use pdfkit to embed in print-ready PDF
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfkitModule = require('pdfkit')
  const PDFDocument = pdfkitModule.default ?? pdfkitModule

  // A4 in points (1 point = 1/72 inch; 300 DPI means 1 pixel = 72/300 points)
  const A4_W_PT = 595.28
  const A4_H_PT = 841.89
  const MARGIN_PT = 28.35 // ~10mm in points
  const usableW_PT = A4_W_PT - MARGIN_PT * 2
  const usableH_PT = A4_H_PT - MARGIN_PT * 2 - 28

  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
      Title: `${page.caption || `Page ${page.order + 1}`} - ColorBook`,
      Author: 'ColorBook',
      Subject: 'Print & Color Page',
    },
  })

  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  await new Promise<void>((resolve) => {
    doc.on('end', resolve)

    // White background
    doc.rect(0, 0, A4_W_PT, A4_H_PT).fill('white')

    // Center image on page
    const imgAspect = fitW / fitH
    let drawW = usableW_PT
    let drawH = drawW / imgAspect
    if (drawH > usableH_PT) { drawH = usableH_PT; drawW = drawH * imgAspect }
    const x = (A4_W_PT - drawW) / 2
    const y = MARGIN_PT

    doc.image(printBuffer, x, y, { width: drawW, height: drawH })

    // Caption
    const caption = page.caption || `Page ${page.order + 1}`
    doc.fontSize(8).fillColor('#999999')
       .text(caption, MARGIN_PT, A4_H_PT - MARGIN_PT - 12, { width: usableW_PT, align: 'center' })

    doc.end()
  })

  const pdfBuffer = Buffer.concat(chunks)
  const filename = `colorbook-page-${page.order + 1}.pdf`

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length.toString(),
    },
  })
}
