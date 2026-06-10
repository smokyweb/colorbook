'use client'
import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Mail, Lock, BookOpen, ArrowRight, Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) { setError('Invalid email or password'); setLoading(false); return }
    router.push(searchParams.get('redirect') || '/dashboard')
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: '#0D1220' }}>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg,#B8860B,#D4A843)' }}>
              <BookOpen size={22} style={{ color: '#0D1220' }} />
            </div>
            <h1 className="text-2xl font-black" style={{ color: '#F0E8D8' }}>Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: '#7A9BC4' }}>Sign in to your ColorBook account</p>
          </div>
          <div className="rounded-2xl p-8" style={{ background: 'rgba(26,34,68,0.5)', border: '1px solid rgba(212,168,67,0.15)' }}>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#7A9BC4' }}>Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4A6480' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none transition"
                    style={{ background: 'rgba(13,18,32,0.8)', border: '1px solid rgba(212,168,67,0.15)', color: '#F0E8D8' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1.5" style={{ color: '#7A9BC4' }}>Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4A6480' }} />
                  <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-3 rounded-xl text-sm focus:outline-none"
                    style={{ background: 'rgba(13,18,32,0.8)', border: '1px solid rgba(212,168,67,0.15)', color: '#F0E8D8' }} />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#4A6480' }}>
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm px-3 py-2 rounded-xl" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#B8860B,#D4A843)', color: '#0D1220' }}>
                {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight size={14} /></>}
              </button>
            </form>
            <p className="text-center text-sm mt-5" style={{ color: '#4A6480' }}>
              No account? <Link href="/signup" className="font-semibold" style={{ color: '#D4A843' }}>Sign up free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
