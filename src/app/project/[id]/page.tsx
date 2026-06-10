'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Upload, X, RefreshCw, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, ToggleLeft, ToggleRight, Trash2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface Page {
  id: string; order: number; originalUrl: string; lineArtUrl: string | null
  status: 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED'; caption: string | null
}
interface Project { id: string; title: string; status: string; pages: Page[] }

export default function ProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [showLineArt, setShowLineArt] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [dragOver, setDragOver] = useState(false)
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') loadProject()
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [status])

  const loadProject = async () => {
    const res = await fetch(`/api/projects/${projectId}/status`)
    if (!res.ok) { router.push('/dashboard'); return }
    const { project } = await res.json()
    setProject(project)
    if (project.pages.some((p: Page) => ['PENDING', 'PROCESSING'].includes(p.status))) {
      startPolling()
    }
  }

  const startPolling = () => {
    if (pollRef.current) return
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/projects/${projectId}/status`)
      if (!res.ok) return
      const { project } = await res.json()
      setProject(project)
      setSelectedPage(prev => prev ? project.pages.find((p: Page) => p.id === prev.id) || prev : null)
      if (!project.pages.some((p: Page) => ['PENDING', 'PROCESSING'].includes(p.status))) {
        clearInterval(pollRef.current!); pollRef.current = null
      }
    }, 3000)
  }

  const uploadFiles = useCallback(async (files: FileList) => {
    setUploading(true)
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) continue
      const key = `${file.name}-${Date.now()}`
      setUploadProgress(prev => ({ ...prev, [key]: 0 }))
      const form = new FormData()
      form.append('file', file)
      form.append('projectId', projectId)
      await fetch('/api/upload', { method: 'POST', body: form })
      setUploadProgress(prev => { const n = { ...prev }; delete n[key]; return n })
    }
    setUploading(false)
    loadProject()
    startPolling()
  }, [projectId])

  const deletePage = async (page: Page) => {
    if (!confirm('Delete this page?')) return
    await fetch(`/api/pages/${page.id}`, { method: 'DELETE' })
    if (selectedPage?.id === page.id) setSelectedPage(null)
    loadProject()
  }

  const statusIcon = (s: string) => {
    if (s === 'DONE') return <CheckCircle2 size={14} style={{ color: '#6AAD38' }} />
    if (s === 'FAILED') return <AlertCircle size={14} style={{ color: '#EF4444' }} />
    if (s === 'PROCESSING') return <Loader2 size={14} className="animate-spin" style={{ color: '#E87830' }} />
    return <Loader2 size={14} className="animate-spin" style={{ color: '#7A9BC4' }} />
  }

  if (status === 'loading' || !project) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1220' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D4A843', borderTopColor: 'transparent' }} />
    </div>
  }

  const activeUploads = Object.keys(uploadProgress)

  return (
    <div className="min-h-screen pt-16 flex flex-col" style={{ background: '#0D1220' }}>
      <Navbar />

      {/* Top bar */}
      <div className="border-b px-4 py-3 flex items-center gap-4" style={{ background: 'rgba(26,34,68,0.5)', borderColor: 'rgba(212,168,67,0.12)' }}>
        <Link href="/dashboard" className="flex items-center gap-1 text-sm transition hover:opacity-80" style={{ color: '#7A9BC4' }}>
          <ChevronLeft size={14} /> Dashboard
        </Link>
        <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <h1 className="font-bold truncate" style={{ color: '#F0E8D8' }}>{project.title}</h1>
        <span className="text-xs ml-auto" style={{ color: '#4A6480' }}>{project.pages.length} page{project.pages.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Upload + Page Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files) }}
            onClick={() => fileInputRef.current?.click()}
            className="relative rounded-2xl p-8 text-center cursor-pointer transition mb-6"
            style={{
              background: dragOver ? 'rgba(212,168,67,0.1)' : 'rgba(26,34,68,0.3)',
              border: `2px dashed ${dragOver ? 'rgba(212,168,67,0.5)' : 'rgba(212,168,67,0.2)'}`,
            }}>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => e.target.files && uploadFiles(e.target.files)} />
            <Upload size={28} className="mx-auto mb-3" style={{ color: '#D4A843' }} />
            <p className="font-semibold mb-1" style={{ color: '#F0E8D8' }}>Drop photos here</p>
            <p className="text-sm" style={{ color: '#4A6480' }}>or click to browse · max 10MB per image · up to 20 photos</p>
          </div>

          {/* Active uploads */}
          {activeUploads.length > 0 && (
            <div className="mb-4 space-y-2">
              {activeUploads.map(k => (
                <div key={k} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(26,34,68,0.5)', border: '1px solid rgba(212,168,67,0.12)' }}>
                  <Loader2 size={14} className="animate-spin" style={{ color: '#D4A843' }} />
                  <span className="text-sm" style={{ color: '#7A9BC4' }}>Uploading...</span>
                </div>
              ))}
            </div>
          )}

          {/* Pages grid */}
          {project.pages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {project.pages.map(page => (
                <div key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className="rounded-xl overflow-hidden cursor-pointer transition hover:-translate-y-0.5 relative group"
                  style={{
                    background: 'rgba(26,34,68,0.5)',
                    border: `1px solid ${selectedPage?.id === page.id ? 'rgba(212,168,67,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {/* Thumbnail */}
                  <div className="h-28 flex items-center justify-center overflow-hidden" style={{ background: 'rgba(13,18,32,0.5)' }}>
                    {page.status === 'DONE' && page.lineArtUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={page.lineArtUrl} alt="line art" className="w-full h-full object-contain" style={{ filter: 'invert(1)' }} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={page.originalUrl} alt="original" className="w-full h-full object-cover opacity-40" />
                    )}
                  </div>
                  {/* Status bar */}
                  <div className="px-2 py-1.5 flex items-center justify-between">
                    <span className="text-xs truncate" style={{ color: '#4A6480' }}>Page {page.order + 1}</span>
                    {statusIcon(page.status)}
                  </div>
                  {/* Delete button */}
                  <button onClick={e => { e.stopPropagation(); deletePage(page) }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-lg items-center justify-center hidden group-hover:flex transition"
                    style={{ background: 'rgba(220,38,38,0.8)' }}>
                    <Trash2 size={11} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {project.pages.length === 0 && !uploading && (
            <div className="text-center py-12">
              <ImageIcon size={32} className="mx-auto mb-3" style={{ color: '#3D5270' }} />
              <p style={{ color: '#4A6480' }}>Upload photos above to get started</p>
            </div>
          )}
        </div>

        {/* Right: Preview Panel */}
        {selectedPage && (
          <div className="w-80 border-l flex flex-col" style={{ background: 'rgba(26,34,68,0.3)', borderColor: 'rgba(212,168,67,0.1)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className="font-semibold text-sm" style={{ color: '#F0E8D8' }}>Preview</span>
              <button onClick={() => setSelectedPage(null)} style={{ color: '#4A6480' }}><X size={16} /></button>
            </div>

            {/* Image preview */}
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="rounded-xl overflow-hidden flex items-center justify-center h-48" style={{ background: '#0D1220' }}>
                {showLineArt && selectedPage.lineArtUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedPage.lineArtUrl} alt="line art" className="max-w-full max-h-full object-contain" style={{ filter: 'invert(1)' }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedPage.originalUrl} alt="original" className="max-w-full max-h-full object-contain" />
                )}
              </div>

              {/* Toggle */}
              {selectedPage.lineArtUrl && (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs" style={{ color: showLineArt ? '#4A6480' : '#D4A843' }}>Original</span>
                  <button onClick={() => setShowLineArt(!showLineArt)} style={{ color: '#D4A843' }}>
                    {showLineArt ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <span className="text-xs" style={{ color: showLineArt ? '#D4A843' : '#4A6480' }}>Line Art</span>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(13,18,32,0.5)' }}>
                {statusIcon(selectedPage.status)}
                <span className="text-xs" style={{ color: '#7A9BC4' }}>
                  {selectedPage.status === 'PENDING' && 'Waiting to convert...'}
                  {selectedPage.status === 'PROCESSING' && 'Converting to line art...'}
                  {selectedPage.status === 'DONE' && 'Conversion complete ✓'}
                  {selectedPage.status === 'FAILED' && 'Conversion failed'}
                </span>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#7A9BC4' }}>Caption (optional)</label>
                <input
                  defaultValue={selectedPage.caption || ''}
                  placeholder="Add a caption..."
                  onBlur={async e => {
                    await fetch(`/api/pages/${selectedPage.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ caption: e.target.value }) })
                  }}
                  className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none"
                  style={{ background: 'rgba(13,18,32,0.8)', border: '1px solid rgba(212,168,67,0.15)', color: '#F0E8D8' }}
                />
              </div>

              {/* Delete */}
              <button onClick={() => deletePage(selectedPage)}
                className="flex items-center justify-center gap-2 py-2 rounded-xl text-sm transition"
                style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>
                <Trash2 size={13} /> Delete Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
