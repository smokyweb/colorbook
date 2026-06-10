import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Upload, Wand2, BookOpen, Download, Printer, ArrowRight, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0D1220' }}>
      <Navbar />

      {/* Hero */}
      <div className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: '#D4A843' }} />
          <div className="absolute top-40 left-0 w-64 h-64 rounded-full blur-3xl opacity-8" style={{ background: '#1E5FAE' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)', color: '#D4A843' }}>
            <Star size={12} /> AI-Powered Photo Conversion
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight" style={{ color: '#F0E8D8' }}>
            Turn Your Photos Into a<br />
            <span style={{ background: 'linear-gradient(135deg, #D4A843, #E87830)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Coloring Book
            </span>
          </h1>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: '#7A9BC4' }}>
            Upload any photo. Our AI converts it into beautiful hand-drawn line art. Print your own custom coloring book or download as PDF.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #B8860B, #D4A843)', color: '#0D1220' }}>
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-2xl text-base font-semibold transition"
              style={{ color: '#F0E8D8', background: 'rgba(26,34,68,0.7)', border: '1px solid rgba(212,168,67,0.2)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Before/After Demo */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="rounded-3xl overflow-hidden border" style={{ background: 'rgba(26,34,68,0.4)', borderColor: 'rgba(212,168,67,0.15)' }}>
          <div className="p-8 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="text-sm font-semibold" style={{ color: '#D4A843' }}>See the magic</p>
            <h2 className="text-2xl font-bold mt-1" style={{ color: '#F0E8D8' }}>Photo → Coloring Page</h2>
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/5">
            <div className="p-8 text-center">
              <div className="w-full h-48 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(30,95,174,0.15)', border: '1px solid rgba(30,95,174,0.2)' }}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E5FAE, #0E7A8C)' }}>
                    <Upload size={24} style={{ color: '#F0E8D8' }} />
                  </div>
                  <p className="text-xs" style={{ color: '#7A9BC4' }}>Your photo</p>
                </div>
              </div>
              <p className="text-sm font-medium" style={{ color: '#7A9BC4' }}>Original Photo</p>
            </div>
            <div className="p-8 text-center">
              <div className="w-full h-48 rounded-2xl flex items-center justify-center mb-3" style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)' }}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #B8860B, #D4A843)' }}>
                    <Wand2 size={24} style={{ color: '#0D1220' }} />
                  </div>
                  <p className="text-xs" style={{ color: '#D4A843' }}>AI line art</p>
                </div>
              </div>
              <p className="text-sm font-medium" style={{ color: '#D4A843' }}>Coloring Page ✨</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-center mb-12" style={{ color: '#F0E8D8' }}>How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: Upload, title: 'Upload Photos', desc: 'Select up to 20 photos from your device. Any photo works — portraits, landscapes, pets, anything.', color: '#1E5FAE' },
            { step: '02', icon: Wand2, title: 'AI Converts', desc: 'Our AI transforms each photo into clean black & white coloring page line art in seconds.', color: '#D4A843' },
            { step: '03', icon: BookOpen, title: 'Download or Print', desc: 'Download as a PDF or order a professionally printed coloring book shipped to your door.', color: '#0E7A8C' },
          ].map(s => (
            <div key={s.step} className="rounded-2xl p-6" style={{ background: 'rgba(26,34,68,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xs font-bold mb-4" style={{ color: `${s.color}80` }}>{s.step}</div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                <s.icon size={22} style={{ color: s.color }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#F0E8D8' }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#7A9BC4' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-black text-center mb-4" style={{ color: '#F0E8D8' }}>Simple Pricing</h2>
        <p className="text-center mb-12" style={{ color: '#7A9BC4' }}>Start free, upgrade when you need more</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Free', price: '$0', features: ['3 pages', 'Watermarked preview', 'Basic line art'], cta: 'Start Free', highlight: false },
            { name: 'Digital', price: '$9.99', features: ['20 pages', 'HD line art', 'PDF download', 'No watermark'], cta: 'Get PDF', highlight: true },
            { name: 'Printed Book', price: '$29.99', features: ['20 pages', 'HD line art', 'Soft cover book', 'Ships worldwide'], cta: 'Order Book', highlight: false },
          ].map(p => (
            <div key={p.name} className="rounded-2xl p-6 relative" style={{
              background: p.highlight ? 'rgba(184,134,11,0.15)' : 'rgba(26,34,68,0.4)',
              border: `1px solid ${p.highlight ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'linear-gradient(135deg,#B8860B,#D4A843)', color: '#0D1220' }}>Most Popular</div>}
              <p className="font-bold mb-1" style={{ color: p.highlight ? '#D4A843' : '#7A9BC4' }}>{p.name}</p>
              <p className="text-3xl font-black mb-6" style={{ color: '#F0E8D8' }}>{p.price}</p>
              <ul className="space-y-2 mb-6">
                {p.features.map(f => (
                  <li key={f} className="text-sm flex items-center gap-2" style={{ color: '#7A9BC4' }}>
                    <span style={{ color: '#D4A843' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block text-center py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
                style={p.highlight
                  ? { background: 'linear-gradient(135deg,#B8860B,#D4A843)', color: '#0D1220' }
                  : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F0E8D8' }}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t text-center py-8" style={{ borderColor: 'rgba(212,168,67,0.1)', color: '#3D5270' }}>
        <p className="text-sm">© 2026 ColorBook · Turn memories into art</p>
      </div>
    </div>
  )
}
