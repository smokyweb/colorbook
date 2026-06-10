'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { BookOpen, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10" style={{ background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-gradient)' }}>
            <BookOpen size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">ColorBook</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">How It Works</Link>
          <Link href="/#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</Link>
          {session && <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">My Books</Link>}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button onClick={() => setOpen(!open)}
                className="flex items-center gap-2 glass rounded-xl px-3 py-2 border border-white/10 hover:bg-white/5 transition">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'var(--brand-gradient)' }}>
                  {session.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-slate-300 hidden sm:block">{session.user?.name?.split(' ')[0]}</span>
                <ChevronDown size={12} className="text-slate-500" />
              </button>
              {open && (
                <div className="absolute right-0 top-full mt-2 w-44 glass rounded-xl border border-white/10 py-1 shadow-xl">
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition">My Books</Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition">
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors hidden sm:block">Sign in</Link>
              <Link href="/signup" className="btn-brand px-4 py-2 text-sm">Start Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
