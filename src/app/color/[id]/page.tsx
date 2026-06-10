'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  ChevronLeft, Download, Undo2, Redo2, Trash2,
  Minus, Plus, Pipette, PaintBucket, Pencil, Eraser
} from 'lucide-react'

const PALETTE = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  '#f59e0b', '#84cc16', '#06b6d4', '#6366f1', '#d946ef',
  '#78716c', '#94a3b8', '#fde68a', '#bbf7d0', '#bfdbfe',
]

type Tool = 'brush' | 'eraser' | 'fill'

interface HistoryEntry { data: ImageData }

export default function ColorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id: pageId } = useParams() as { id: string }

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLCanvasElement>(null) // for line art on top
  const containerRef = useRef<HTMLDivElement>(null)

  const [pageData, setPageData] = useState<{ lineArtUrl: string; originalUrl: string; status: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [tool, setTool] = useState<Tool>('brush')
  const [color, setColor] = useState('#ef4444')
  const [brushSize, setBrushSize] = useState(16)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [canvasReady, setCanvasReady] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') loadPage()
  }, [status])

  const loadPage = async () => {
    const res = await fetch(`/api/pages/${pageId}`)
    if (!res.ok) { router.push('/dashboard'); return }
    const { page } = await res.json()
    setPageData(page)
    setLoading(false)
  }

  // Initialize canvas once page data is ready
  useEffect(() => {
    if (!pageData || !canvasRef.current || !overlayRef.current) return
    const artUrl = pageData.lineArtUrl || pageData.originalUrl
    initCanvas(artUrl)
  }, [pageData])

  const initCanvas = (artUrl: string) => {
    const canvas = canvasRef.current!
    const overlay = overlayRef.current!
    const ctx = canvas.getContext('2d')!

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height
      overlay.width = img.width
      overlay.height = img.height

      // Fill coloring canvas with white
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw line art on overlay canvas (always on top)
      const octx = overlay.getContext('2d')!
      octx.clearRect(0, 0, overlay.width, overlay.height)
      octx.drawImage(img, 0, 0)

      // Save initial state
      const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height)
      setHistory([{ data: initialState }])
      setHistoryIdx(0)
      setCanvasReady(true)
    }
    img.src = artUrl
  }

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIdx + 1)
      const next = [...trimmed, { data }].slice(-50) // max 50 states
      setHistoryIdx(next.length - 1)
      return next
    })
  }, [historyIdx])

  const floodFill = (x: number, y: number, fillColor: string) => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const px = Math.floor(x)
    const py = Math.floor(y)

    const idx = (px + py * canvas.width) * 4
    const targetR = data[idx], targetG = data[idx + 1], targetB = data[idx + 2], targetA = data[idx + 3]

    // Parse fill color
    const fc = document.createElement('canvas').getContext('2d')!
    fc.fillStyle = fillColor
    fc.fillRect(0, 0, 1, 1)
    const fillPixel = fc.getImageData(0, 0, 1, 1).data
    const fr = fillPixel[0], fg = fillPixel[1], fb = fillPixel[2]

    if (targetR === fr && targetG === fg && targetB === fb) return

    const match = (i: number) =>
      Math.abs(data[i] - targetR) < 30 &&
      Math.abs(data[i + 1] - targetG) < 30 &&
      Math.abs(data[i + 2] - targetB) < 30 &&
      Math.abs(data[i + 3] - targetA) < 30

    const stack = [px + py * canvas.width]
    const visited = new Uint8Array(canvas.width * canvas.height)

    while (stack.length) {
      const pos = stack.pop()!
      if (visited[pos]) continue
      visited[pos] = 1
      const i = pos * 4
      if (!match(i)) continue
      data[i] = fr; data[i + 1] = fg; data[i + 2] = fb; data[i + 3] = 255

      const x2 = pos % canvas.width
      const y2 = Math.floor(pos / canvas.width)
      if (x2 > 0) stack.push(pos - 1)
      if (x2 < canvas.width - 1) stack.push(pos + 1)
      if (y2 > 0) stack.push(pos - canvas.width)
      if (y2 < canvas.height - 1) stack.push(pos + canvas.width)
    }

    ctx.putImageData(imageData, 0, 0)
    saveHistory()
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const canvas = canvasRef.current!
    const pos = getPos(e, canvas)

    if (tool === 'fill') {
      floodFill(pos.x, pos.y, color)
      return
    }

    setIsDrawing(true)
    lastPos.current = pos

    // Draw a dot on click
    const ctx = canvas.getContext('2d')!
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, (tool === 'eraser' ? brushSize * 1.5 : brushSize) / 2, 0, Math.PI * 2)
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.fill()
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing || tool === 'fill') return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const pos = getPos(e, canvas)
    const prev = lastPos.current || pos

    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()

    lastPos.current = pos
  }

  const endDraw = () => {
    if (isDrawing) { saveHistory(); setIsDrawing(false) }
    lastPos.current = null
  }

  const undo = () => {
    if (historyIdx <= 0) return
    const newIdx = historyIdx - 1
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.putImageData(history[newIdx].data, 0, 0)
    setHistoryIdx(newIdx)
  }

  const redo = () => {
    if (historyIdx >= history.length - 1) return
    const newIdx = historyIdx + 1
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.putImageData(history[newIdx].data, 0, 0)
    setHistoryIdx(newIdx)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveHistory()
  }

  const downloadColored = () => {
    const canvas = canvasRef.current!
    const overlay = overlayRef.current!
    // Merge: color layer + line art overlay
    const merged = document.createElement('canvas')
    merged.width = canvas.width
    merged.height = canvas.height
    const mctx = merged.getContext('2d')!
    mctx.drawImage(canvas, 0, 0)
    mctx.drawImage(overlay, 0, 0)
    const link = document.createElement('a')
    link.download = `colorbook-page-${pageId}.png`
    link.href = merged.toDataURL('image/png')
    link.click()
  }

  const cursorStyle = tool === 'fill' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'crosshair'

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#ec4899', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!pageData?.lineArtUrl && pageData?.status !== 'DONE') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f1a' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#ec4899', borderTopColor: 'transparent' }} />
          <p className="text-slate-400">Still converting your photo...</p>
          <p className="text-slate-600 text-sm mt-2">This takes ~30 seconds</p>
          <button onClick={loadPage} className="mt-4 text-pink-400 text-sm underline">Check again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f0f1a' }}>
      {/* Top toolbar */}
      <div className="border-b border-white/10 px-4 py-2 flex items-center gap-3 flex-wrap"
        style={{ background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(20px)' }}>
        <Link href="/dashboard" className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition">
          <ChevronLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-white/10" />

        {/* Tools */}
        <div className="flex items-center gap-1">
          {([
            { t: 'brush' as Tool, icon: Pencil, label: 'Brush' },
            { t: 'fill' as Tool, icon: PaintBucket, label: 'Fill' },
            { t: 'eraser' as Tool, icon: Eraser, label: 'Eraser' },
          ]).map(({ t, icon: Icon, label }) => (
            <button key={t} onClick={() => setTool(t)} title={label}
              className="p-2 rounded-lg transition text-sm flex items-center gap-1.5"
              style={{
                background: tool === t ? 'rgba(236,72,153,0.2)' : 'transparent',
                border: `1px solid ${tool === t ? 'rgba(236,72,153,0.4)' : 'transparent'}`,
                color: tool === t ? '#ec4899' : '#94a3b8',
              }}>
              <Icon size={16} />
              <span className="hidden sm:inline text-xs">{label}</span>
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Brush size */}
        <div className="flex items-center gap-2">
          <button onClick={() => setBrushSize(s => Math.max(1, s - 4))} className="text-slate-400 hover:text-white transition">
            <Minus size={14} />
          </button>
          <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="rounded-full bg-white" style={{ width: Math.min(brushSize, 24), height: Math.min(brushSize, 24) }} />
          </div>
          <button onClick={() => setBrushSize(s => Math.min(60, s + 4))} className="text-slate-400 hover:text-white transition">
            <Plus size={14} />
          </button>
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Color picker */}
        <div className="flex items-center gap-1 flex-wrap max-w-xs">
          {PALETTE.map(c => (
            <button key={c} onClick={() => { setColor(c); setTool('brush') }}
              className="w-5 h-5 rounded-full transition hover:scale-110 flex-shrink-0"
              style={{ background: c, border: color === c ? '2px solid white' : '1px solid rgba(255,255,255,0.2)', outline: color === c ? '2px solid #ec4899' : 'none', outlineOffset: '1px' }} />
          ))}
          <input type="color" value={color} onChange={e => { setColor(e.target.value); setTool('brush') }}
            className="w-5 h-5 rounded cursor-pointer"
            title="Custom color" style={{ border: 'none', padding: 0, background: 'none' }} />
        </div>

        <div className="w-px h-5 bg-white/10 hidden sm:block" />

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={undo} disabled={historyIdx <= 0} title="Undo"
            className="p-2 rounded-lg text-slate-400 hover:text-white transition disabled:opacity-30">
            <Undo2 size={16} />
          </button>
          <button onClick={redo} disabled={historyIdx >= history.length - 1} title="Redo"
            className="p-2 rounded-lg text-slate-400 hover:text-white transition disabled:opacity-30">
            <Redo2 size={16} />
          </button>
          <button onClick={clearCanvas} title="Clear all" className="p-2 rounded-lg text-slate-400 hover:text-red-400 transition">
            <Trash2 size={16} />
          </button>
          <button onClick={downloadColored}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition"
            style={{ background: 'linear-gradient(135deg,#667eea,#ec4899)', color: 'white' }}>
            <Download size={14} /> Save
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 overflow-auto flex items-start justify-center p-6"
        style={{ background: 'repeating-conic-gradient(#1a1a2e 0% 25%, #0f0f1a 0% 50%) 0 0 / 20px 20px' }}>
        <div className="relative shadow-2xl" style={{ maxWidth: '100%' }}>
          {/* Coloring layer */}
          <canvas
            ref={canvasRef}
            style={{ display: 'block', cursor: cursorStyle, maxWidth: '100%', touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          {/* Line art overlay — always on top, pointer-events none */}
          <canvas
            ref={overlayRef}
            style={{
              position: 'absolute', top: 0, left: 0,
              maxWidth: '100%', pointerEvents: 'none',
              mixBlendMode: 'multiply',
            }}
          />
          {!canvasReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#ec4899', borderTopColor: 'transparent' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
