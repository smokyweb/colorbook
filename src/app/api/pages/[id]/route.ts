import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const page = await prisma.page.findFirst({
    where: { id: params.id, project: { userId: session.user.id } },
  })
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ page })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const page = await prisma.page.update({ where: { id: params.id }, data })
  return NextResponse.json({ page })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const page = await prisma.page.findUnique({
    where: { id: params.id },
    include: { project: { select: { userId: true } } },
  })
  if (!page || page.project.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  // Delete files
  for (const url of [page.originalUrl, page.lineArtUrl]) {
    if (url) try { await unlink(join(process.cwd(), 'public', url)) } catch {}
  }
  await prisma.page.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
