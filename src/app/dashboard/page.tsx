'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Plus, BookOpen, ImageIcon, Clock, X, ArrowRight } from 'lucide-react'

interface Project {
  id: string; title: string; status: string; createdAt: string
  _count: { pages: number }
}

const statusColor: Record<string, string> = {
  DRAFT: '#7A9BC4', PROCESSING: '#E87830', READY: '#6AAD38', ORDERED: '#D4A843'
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?redirect=/dashboard')
    if (status === 'authenticated') loadProjects()
  }, [status])

  const loadProjects = async () => {
    const res = await fetch('/api/projects')
    if (res.ok) setProjects((await res.json()).projects)
    setLoading(false)
  }

  const createProject = async () => {
    if (!newTitle.trim()) return
    setCreating(true)
    const res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle }) })
    if (res.ok) {
      const { project } = await res.json()
      router.push(`/project/${project.id}`)
    }
    setCreating(false)
  }

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1220' }}>
      <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D4A843', borderTopColor: 'transparent' }} />
    </div>
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: '#0D1220' }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#F0E8D8' }}>My Coloring Books</h1>
            <p className="text-sm mt-1" style={{ color: '#7A9BC4' }}>
              {session?.user?.name ? `Welcome back, ${session.user.name.split(' ')[0]}` : 'Your projects'}
            </p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#B8860B,#D4A843)', color: '#0D1220' }}>
            <Plus size={16} /> New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24 rounded-2xl" style={{ background: 'rgba(26,34,68,0.3)', border: '1px dashed rgba(212,168,67,0.2)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}>
              <BookOpen size={28} style={{ color: '#D4A843' }} />
            </div>
            <h2 className="font-bold text-lg mb-2" style={{ color: '#F0E8D8' }}>No projects yet</h2>
            <p className="text-sm mb-6" style={{ color: '#4A6480' }}>Create your first coloring book project to get started.</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#B8860B,#D4A843)', color: '#0D1220' }}>
              <Plus size={16} /> Create First Project
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map(p => (
              <Link key={p.id} href={`/project/${p.id}`}
                className="rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-opacity-30 block"
                style={{ background: 'rgba(26,34,68,0.5)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.1)' }}>
                    <BookOpen size={18} style={{ color: '#D4A843' }} />
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${statusColor[p.status]}20`, color: statusColor[p.status] }}>
                    {p.status}
                  </span>
                </div>
                <h3 className="font-bold mb-1 truncate" style={{ color: '#F0E8D8' }}>{p.title}</h3>
                <div className="flex items-center gap-3 text-xs" style={{ color: '#4A6480' }}>
                  <span className="flex items-center gap-1"><ImageIcon size={11} /> {p._count.pages} page{p._count.pages !== 1 ? 's' : ''}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs font-semibold" style={{ color: '#D4A843' }}>
                  Open project <ArrowRight size={12} />
                </div>
              </Link>
            ))}
            <button onClick={() => setShowModal(true)}
              className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition hover:border-opacity-40"
              style={{ background: 'rgba(26,34,68,0.2)', border: '1px dashed rgba(212,168,67,0.2)', minHeight: '160px' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.1)' }}>
                <Plus size={18} style={{ color: '#D4A843' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: '#D4A843' }}>New Project</span>
            </button>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#1A2244', border: '1px solid rgba(212,168,67,0.25)' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: '#F0E8D8' }}>New Project</h3>
              <button onClick={() => setShowModal(false)} style={{ color: '#4A6480' }}><X size={18} /></button>
            </div>
            <label className="block text-sm mb-2" style={{ color: '#7A9BC4' }}>Project Name</label>
            <input
              value={newTitle} onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Summer Vacation 2026"
              onKeyDown={e => e.key === 'Enter' && createProject()}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none mb-4"
              style={{ background: 'rgba(13,18,32,0.8)', border: '1px solid rgba(212,168,67,0.2)', color: '#F0E8D8' }}
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm transition"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#7A9BC4' }}>
                Cancel
              </button>
              <button onClick={createProject} disabled={creating || !newTitle.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#B8860B,#D4A843)', color: '#0D1220' }}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
