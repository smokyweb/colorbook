'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Mail, Lock, User, BookOpen, ArrowRight } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    if (password.length < 8) { setError('Password must be at least 8 characters'); setLoading(false); return }
    const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
    await signIn('credentials', { email, password, redirect: false })
    router.push('/dashboard')
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
            <h1 className="text-2xl font-black" style={{ color: '#F0E8D8' }}>Create your account</h1>
            <p className="text-sm mt-1" style={{ color: '#7A9BC4' }}>Start turning photos into coloring pages</p>
          </div>
          <div className="rounded-2xl p-8" style={{ background: 'rgba(26,34,68,0.5)', border: '1px solid rgba(212,168,67,0.15)' }}>
            <form onSubmit={submit} className="space-y-4">
              {[
                { label: 'Your Name', value: name, set: setName, type: 'text', icon: User, placeholder: 'Jane Smith' },
                { label: 'Email', value: email, set: setEmail, type: 'email', icon: Mail, placeholder: 'you@example.com' },
                { label: 'Password', value: password, set: setPassword, type: 'password', icon: Lock, placeholder: 'Min. 8 characters' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm mb-1.5" style={{ color: '#7A9BC4' }}>{f.label}</label>
                  <div className="relative">
                    <f.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4A6480' }} />
                    <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} required placeholder={f.placeholder}
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={{ background: 'rgba(13,18,32,0.8)', border: '1px solid rgba(212,168,67,0.15)', color: '#F0E8D8' }} />
                  </div>
                </div>
              ))}
              {error && <p className="text-sm px-3 py-2 rounded-xl" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#f87171' }}>{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#B8860B,#D4A843)', color: '#0D1220' }}>
                {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight size={14} /></>}
              </button>
            </form>
            <p className="text-center text-sm mt-5" style={{ color: '#4A6480' }}>
              Already have an account? <Link href="/login" className="font-semibold" style={{ color: '#D4A843' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
