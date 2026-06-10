import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Upload, Wand2, BookOpen, Download, Printer, ArrowRight,
  Star, CheckCircle, Sparkles, Image as ImageIcon, Users,
  Shield, Zap, ChevronRight, Play
} from 'lucide-react'

const STATS = [
  { value: '50K+', label: 'Coloring Books Created' },
  { value: '2M+', label: 'Pages Converted' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '30s', label: 'Avg. Convert Time' },
]

const FEATURES = [
  { icon: Upload, title: 'Upload Any Photo', desc: 'Portraits, pets, landscapes — any photo works. Drag & drop up to 20 images at once.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: Wand2, title: 'AI Line Art', desc: 'Our AI strips colors and generates clean, hand-drawn-style outlines perfect for coloring.', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  { icon: BookOpen, title: 'Book Builder', desc: 'Arrange, reorder, and caption your pages. Preview exactly what your book will look like.', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { icon: Download, title: 'Instant PDF', desc: 'Download a high-resolution, print-ready PDF of your coloring book in seconds.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { icon: Printer, title: 'Printed & Shipped', desc: 'Order a professionally printed softcover book shipped to your door anywhere in the world.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { icon: Shield, title: 'Private & Secure', desc: 'Your photos are yours. We never share or use your images for training. Deleted on request.', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    desc: 'Try it out',
    features: ['3 pages per book', 'Standard line art quality', 'Watermarked preview', 'No credit card needed'],
    cta: 'Start Free',
    href: '/signup',
    highlight: false,
    badge: null,
  },
  {
    name: 'Digital',
    price: '$9.99',
    period: 'per book',
    desc: 'Download & print at home',
    features: ['Up to 20 pages', 'HD line art quality', 'PDF download (no watermark)', 'Reorder pages anytime', 'Share with family'],
    cta: 'Get Digital Book',
    href: '/signup',
    highlight: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: '$14.99',
    period: '/ month',
    desc: 'Unlimited digital books',
    features: ['Unlimited pages per book', 'Unlimited digital books', 'HD line art quality', 'Priority AI processing', 'PDF download (no watermark)', 'Reorder pages anytime'],
    cta: 'Start Pro Trial',
    href: '/signup',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Printed Book',
    price: '$29.99',
    period: 'per book',
    desc: 'Real book, shipped to you',
    features: ['Up to 20 pages', 'HD line art quality', 'Premium softcover printing', 'Ships worldwide in 5–7 days', 'Gift-ready packaging', 'Free PDF copy included'],
    cta: 'Order Printed Book',
    href: '/signup',
    highlight: false,
    badge: null,
  },
]

const TESTIMONIALS = [
  { text: "I made a coloring book of our family vacation for my kids — they absolutely loved it. The line art looks incredible.", author: 'Jessica M.', role: 'Mom of 3', avatar: 'JM', metric: '20-page book' },
  { text: "Used it for my grandmother's 80th birthday. Uploaded 15 photos of her life and had a printed book in her hands within a week.", author: 'Derek L.', role: 'Graphic Designer', avatar: 'DL', metric: 'Printed & shipped' },
  { text: "My students love the coloring pages I make from classroom photos. The AI conversion is shockingly good.", author: 'Priya K.', role: 'Elementary Teacher', avatar: 'PK', metric: 'Used weekly' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0f0f1a' }}>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* BG glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-[100px]" />
          <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-pink-600/15 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 rounded-full bg-blue-600/10 blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border border-pink-500/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-300">AI-Powered · Ready in 30 seconds</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
              <span className="text-white">Turn photos into</span>
              <br />
              <span className="gradient-text">coloring books</span>
              <br />
              <span className="text-white">with AI.</span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed">
              Upload any photo. Our AI converts it into beautiful hand-drawn line art in seconds.
              Download a PDF or order a professionally printed book — shipped to your door.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="btn-brand px-8 py-4 text-base">
                Start for Free →
              </Link>
              <Link href="#how-it-works"
                className="glass border border-white/20 text-white px-8 py-4 text-base rounded-xl hover:bg-white/5 transition-colors font-semibold flex items-center justify-center gap-2">
                <Play size={16} className="text-pink-400" /> See How It Works
              </Link>
            </div>

            <p className="mt-3 text-slate-600 text-sm">No credit card required · 3 free pages to start</p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-black gradient-text">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Before/After Demo */}
          <div className="relative">
            <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-glow">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg btn-brand flex items-center justify-center p-0" style={{ padding: 0 }}>
                  <Sparkles size={16} />
                </div>
                <span className="text-white font-semibold text-sm">ColorBook AI</span>
                <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> Processing...
                </span>
              </div>

              {/* Before / After */}
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="p-6 text-center">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">Original Photo</p>
                  <div className="w-full h-40 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(30,95,174,0.2), rgba(14,122,140,0.2))', border: '1px solid rgba(30,95,174,0.3)' }}>
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#1E5FAE,#0E7A8C)' }}>
                        <ImageIcon size={22} className="text-white" />
                      </div>
                      <p className="text-xs text-slate-400">Your photo</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <p className="text-xs text-pink-400 font-semibold uppercase tracking-wide mb-3">Line Art ✨</p>
                  <div className="w-full h-40 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.25)' }}>
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center"
                        style={{ background: 'var(--brand-gradient)' }}>
                        <Wand2 size={22} className="text-white" />
                      </div>
                      <p className="text-xs text-pink-400">Ready to color!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="px-6 pb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Converting 12 of 15 photos...</span>
                  <span>80%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full w-4/5" style={{ background: 'var(--brand-gradient)' }} />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-3 border border-pink-500/30 shadow-glow">
              <p className="text-xs text-slate-400">Last created</p>
              <p className="text-white text-sm font-bold">Family Vacation 2026 📚</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl border border-white/10 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left text */}
              <div className="p-10 lg:p-14">
                <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-3 py-1.5 mb-6">
                  <Zap size={14} className="text-pink-400" />
                  <span className="text-pink-400 text-xs font-semibold">AI-First Technology</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-4">
                  Your photos become<br />
                  <span className="gradient-text">instant coloring art.</span>
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  State-of-the-art AI strips away color and adds detailed, hand-drawn-style outlines — transforming every photo into a beautiful coloring page in under 30 seconds.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    'Works with portraits, pets, landscapes, anything',
                    'Preserves details — faces, fur, textures all come through',
                    'Clean crisp lines perfect for printing at any size',
                    'Batch convert up to 20 photos at once',
                  ].map(t => (
                    <div key={t} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-pink-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{t}</span>
                    </div>
                  ))}
                </div>
                <Link href="/signup" className="btn-brand px-6 py-3 text-sm">Try It Free — No Card Needed</Link>
              </div>

              {/* Right — Step animation */}
              <div className="relative p-10 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,rgba(102,126,234,0.1),rgba(236,72,153,0.1))' }}>
                <div className="w-full max-w-xs space-y-4">
                  {[
                    { step: '01', icon: Upload, label: 'Upload photos', sub: 'Drag & drop up to 20 images', color: 'text-blue-400', ring: 'border-blue-500/30' },
                    { step: '02', icon: Wand2, label: 'AI converts', sub: 'Line art in ~30 seconds', color: 'text-pink-400', ring: 'border-pink-500/30' },
                    { step: '03', icon: BookOpen, label: 'Arrange your book', sub: 'Reorder, caption, preview', color: 'text-purple-400', ring: 'border-purple-500/30' },
                    { step: '04', icon: Download, label: 'Download or print', sub: 'PDF or physical book', color: 'text-emerald-400', ring: 'border-emerald-500/30' },
                  ].map((s, i) => (
                    <div key={s.step} className="flex items-center gap-4">
                      {i < 3 && <div className="absolute left-[calc(50%-8rem+2rem)] w-px" style={{ height: '3rem', top: `calc(10rem + ${i * 6}rem)`, background: 'rgba(255,255,255,0.08)' }} />}
                      <div className={`glass rounded-2xl p-4 border ${s.ring} flex items-center gap-4 w-full`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}
                          style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <s.icon size={18} className={s.color} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{s.label}</p>
                          <p className="text-slate-500 text-xs">{s.sub}</p>
                        </div>
                        <span className="ml-auto text-xs font-bold" style={{ color: 'rgba(255,255,255,0.15)' }}>{s.step}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5 border border-white/10">
            <Users size={14} className="text-blue-400" />
            <span className="text-slate-300 text-sm">Everything You Need</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            From upload to book<br />
            <span className="gradient-text">in one place</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            No other tools needed. ColorBook handles the full journey — AI conversion, book builder, PDF export, and print fulfillment.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className={`glass rounded-2xl p-6 border ${f.bg} hover:border-opacity-60 transition-all`}>
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <f.icon size={20} className={f.color} />
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5 border border-white/10">
            <Sparkles size={14} className="text-pink-400" />
            <span className="text-slate-300 text-sm">Simple Pricing</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Start free.{' '}
            <span className="gradient-text">Upgrade when you love it.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            One-time purchases or a Pro subscription — no surprise fees, no hidden costs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <div key={plan.name}
              className={`glass rounded-2xl p-6 border relative flex flex-col ${plan.highlight ? 'border-pink-500/50 shadow-glow' : 'border-white/10'}`}>
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'var(--brand-gradient)', color: 'white' }}>
                  {plan.badge}
                </div>
              )}
              {plan.highlight && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.05), rgba(236,72,153,0.05))' }} />
              )}

              <div className="mb-6">
                <p className="text-slate-400 font-semibold text-sm mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <p className="text-3xl font-black text-white">{plan.price}</p>
                  {plan.period && <p className="text-slate-500 text-sm mb-1">{plan.period}</p>}
                </div>
                <p className="text-slate-500 text-xs">{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle size={14} className="text-pink-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}
                className={plan.highlight ? 'btn-brand text-center py-3 text-sm' : 'glass border border-white/20 text-white py-3 text-sm rounded-xl hover:bg-white/5 transition-colors font-semibold text-center block'}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-sm mt-8">
          All purchases include lifetime access to your digital files. Printed books ship in 5–7 business days.
        </p>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">People love ColorBook</h2>
          <p className="text-slate-400">Real memories, turned into real art</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.author} className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-200 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: 'var(--brand-gradient)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.author}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
                <p className="text-emerald-400 text-xs font-bold">{t.metric}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.08), rgba(236,72,153,0.08))' }} />
          <div className="relative">
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to turn your photos<br />
              <span className="gradient-text">into something beautiful?</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Start with 3 free pages — no credit card needed. Upgrade anytime for unlimited digital books or order a physical copy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-brand px-8 py-4 text-base">
                Create Your Coloring Book →
              </Link>
              <Link href="#pricing" className="glass border border-white/20 text-white px-8 py-4 text-base rounded-xl hover:bg-white/5 transition-colors font-semibold">
                View Pricing
              </Link>
            </div>
            <p className="text-slate-600 text-sm mt-4">Join 50,000+ people who've made coloring books from their memories 💜</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-gradient)' }}>
                  <BookOpen size={14} className="text-white" />
                </div>
                <span className="font-bold text-lg gradient-text">ColorBook</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                The AI-powered platform for turning your favorite photos into personalized coloring books you can print or keep forever.
              </p>
            </div>
            {[
              { title: 'Product', links: ['How It Works', 'Pricing', 'Examples', 'FAQ'] },
              { title: 'Use Cases', links: ['Family Photos', 'Pets', 'Travel', 'Kids\' Art'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Privacy Policy', 'Terms'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-sm">© 2026 ColorBook. All rights reserved.</p>
            <p className="text-slate-600 text-sm">Turn memories into art 🎨</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
