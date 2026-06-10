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

  const lineArtPath = join(process.cwd(), 'public', page.lineArtUrl)
  if (!existsSync(lineArtPath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const sharp = require('sharp')

  // A4 at 300 DPI = 2480 x 3508 px — upsample for crisp large-format printing
  const meta = await sharp(lineArtPath).metadata()
  const origW = meta.width || 1000
  const origH = meta.height || 1000

  const PRINT_W = 2480
  const PRINT_H = 3508
  const MARGIN = 100
  const targetW = PRINT_W - MARGIN * 2
  const targetH = PRINT_H - MARGIN * 2

  const scale = Math.min(targetW / origW, targetH / origH)
  const fitW = Math.round(origW * scale)
  const fitH = Math.round(origH * scale)

  // Upsample with Lanczos + white background, export as JPEG for PDF embedding
  const imgJpeg = await sharp(lineArtPath)
    .resize(fitW, fitH, { kernel: 'lanczos3', withoutEnlargement: false })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 95 })
    .toBuffer()

  // Build a minimal valid PDF manually — no external deps needed
  // A4 page in PDF points: 595 x 842
  // Image placed centered, scaled to fit with margins
  const PT_W = 595
  const PT_H = 842
  const PT_MARGIN = 20

  const imgAspect = fitW / fitH
  let drawW = PT_W - PT_MARGIN * 2
  let drawH = drawW / imgAspect
  if (drawH > PT_H - PT_MARGIN * 2) {
    drawH = PT_H - PT_MARGIN * 2
    drawW = drawH * imgAspect
  }
  const x = (PT_W - drawW) / 2
  const y = (PT_H - drawH) / 2

  const imgLen = imgJpeg.length

  // PDF object offsets
  const offsets: number[] = []
  const parts: Buffer[] = []
  let pos = 0

  function addPart(s: string | Buffer) {
    const buf = typeof s === 'string' ? Buffer.from(s) : s
    parts.push(buf)
    pos += buf.length
  }

  // PDF header
  addPart('%PDF-1.4\n%\xFF\xFF\xFF\xFF\n')

  // Obj 1: catalog
  offsets[1] = pos
  addPart('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')

  // Obj 2: pages
  offsets[2] = pos
  addPart('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')

  // Obj 3: page
  offsets[3] = pos
  addPart(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PT_W} ${PT_H}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>\nendobj\n`)

  // Obj 4: page content stream
  const contentStream = `q\n${drawW.toFixed(2)} 0 0 ${drawH.toFixed(2)} ${x.toFixed(2)} ${(PT_H - y - drawH).toFixed(2)} cm\n/Im1 Do\nQ\n`
  offsets[4] = pos
  addPart(`4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`)

  // Obj 5: image XObject (JPEG)
  offsets[5] = pos
  addPart(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${fitW} /Height ${fitH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgLen} >>\nstream\n`)
  addPart(imgJpeg)
  addPart('\nendstream\nendobj\n')

  // xref
  const xrefPos = pos
  addPart('xref\n')
  addPart(`0 6\n`)
  addPart('0000000000 65535 f \n')
  for (let i = 1; i <= 5; i++) {
    addPart(offsets[i].toString().padStart(10, '0') + ' 00000 n \n')
  }

  // trailer
  addPart(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`)

  const pdfBuffer = Buffer.concat(parts)
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
