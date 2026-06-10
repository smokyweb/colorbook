import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

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

  const imageBuffer = readFileSync(lineArtPath)
  const ext = lineArtPath.split('.').pop()?.toLowerCase() || 'png'

  // Use pdfkit to embed the image in a print-ready PDF (A4 size)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfkitModule = require('pdfkit')
  const PDFDocument = pdfkitModule.default ?? pdfkitModule

  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `${page.caption || `Page ${page.order + 1}`} - ColorBook`,
      Author: 'ColorBook',
      Subject: 'Coloring Book Page',
    },
  })

  // Collect PDF chunks
  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  await new Promise<void>((resolve) => {
    doc.on('end', resolve)

    const A4_WIDTH = 595.28   // points
    const A4_HEIGHT = 841.89  // points
    const margin = 40
    const usableW = A4_WIDTH - margin * 2
    const usableH = A4_HEIGHT - margin * 2 - 40 // leave room for caption

    // White background (for print)
    doc.rect(0, 0, A4_WIDTH, A4_HEIGHT).fill('white')

    // Embed image — fit inside usable area preserving aspect ratio
    const imgType = ext === 'jpg' || ext === 'jpeg' ? 'jpeg' : 'png'
    doc.image(imageBuffer, margin, margin, {
      width: usableW,
      height: usableH,
      align: 'center',
      valign: 'center',
      fit: [usableW, usableH],
    })

    // Caption at bottom
    const caption = page.caption || `Page ${page.order + 1}`
    doc.fontSize(10)
       .fillColor('#888888')
       .text(caption, margin, A4_HEIGHT - margin - 20, {
         width: usableW,
         align: 'center',
       })

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
