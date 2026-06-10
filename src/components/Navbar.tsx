'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { BookOpen, LogOut, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{ background: 'rgba(13,18,32,0.95)', backdropFilter: 'blur(20px)', borderColor: 'rgba(212,168,67,0.2)' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #B8860B, #D4A843)' }}>
            <BookOpen size={16} style={{ color: '#0D1220' }} />
          </div>
          <span className="font-black text-lg" style={{ color: '#D4A843' }}>ColorBook</span>
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl transition hover:opacity-80"
                style={{ color: '#F0E8D8', background: 'rgba(26,34,68,0.7)', border: '1px solid rgba(212,168,67,0.2)' }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 rounded-xl transition hover:opacity-80"
                style={{ color: '#7A9BC4', background: 'rgba(26,34,68,0.5)' }}>
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-4 py-2 rounded-xl transition" style={{ color: '#7A9BC4' }}>Sign In</Link>
              <Link href="/signup" className="text-sm px-4 py-2 rounded-xl font-semibold transition hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #B8860B, #D4A843)', color: '#0D1220' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
