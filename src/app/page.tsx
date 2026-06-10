import Link from 'next/link'
import Navbar from '@/components/Navbar'
import {
  Upload, Wand2, BookOpen, Download, Printer,
  Star, CheckCircle, Sparkles, Image as ImageIcon,
  Shield, Zap, Play
} from 'lucide-react'

const STATS = [
  { value: '50K+', label: 'Books Made' },
  { value: '2M+', label: 'Pages Converted' },
  { value: '4.9★', label: 'Avg. Rating' },
  { value: '30s', label: 'Convert Time' },
]

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    features: ['3 pages', 'Watermarked preview', 'No card needed'],
    cta: 'Start Free',
    highlight: false,
    badge: null,
  },
  {
    name: 'Digital',
    price: '$9.99',
    period: 'per book',
    features: ['20 pages', 'HD PDF download', 'No watermark'],
    cta: 'Get PDF',
    highlight: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: '$14.99',
    period: '/ month',
    features: ['Unlimited books', 'Unlimited pages', 'Priority AI', 'HD downloads'],
    cta: 'Start Pro Trial',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Printed',
    price: '$29.99',
    period: 'per book',
    features: ['20 pages', 'Softcover book', 'Ships worldwide', 'Free PDF copy'],
    cta: 'Order Book',
    highlight: false,
    badge: null,
  },
]

const TESTIMONIALS = [
  { text: "Made a coloring book from our vacation photos — my kids were obsessed.", author: 'Jessica M.', role: 'Mom of 3', avatar: 'JM', metric: '20-page book' },
  { text: "Uploaded 15 photos for grandma's 80th birthday. Printed book arrived in 6 days.", author: 'Derek L.', role: 'Designer', avatar: 'DL', metric: 'Printed & shipped' },
  { text: "I make coloring pages from classroom photos every week. The AI quality is unreal.", author: 'Priya K.', role: 'Teacher', avatar: 'PK', metric: 'Weekly user' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0f0f1a' }}>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-[100px]" />
          <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-pink-600/15 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 rounded-full bg-blue-600/10 blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 border border-pink-500/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-300">AI-Powered · Ready in 30 seconds</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
              <span className="text-white">Your photos.</span>
              <br />
              <span className="gradient-text">Coloring books.</span>
              <br />
              <span className="text-white">Instantly.</span>
            </h1>

            <p className="mt-6 text-lg text-slate-400 max-w-md leading-relaxed">
              Upload any photo. AI converts it to line art. Download your PDF or get a printed book shipped to your door.
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
            <p className="mt-3 text-slate-600 text-sm">Free to start · No credit card</p>

            <div className="mt-12 grid grid-cols-4 gap-6">
              {STATS.map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-black gradient-text">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div className="relative">
            <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-glow">
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-gradient)' }}>
                  <Sparkles size={16} className="text-white" />
                </div>
                <span className="text-white font-semibold text-sm">ColorBook AI</span>
                <span className="ml-auto text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  Converting...
                </span>
              </div>

              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="p-6 text-center">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">Original</p>
                  <div className="w-full h-36 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,rgba(30,95,174,0.15),rgba(14,122,140,0.15))', border: '1px solid rgba(30,95,174,0.25)' }}>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#1E5FAE,#0E7A8C)' }}>
                        <ImageIcon size={20} className="text-white" />
                      </div>
                      <p className="text-xs text-slate-400">Your photo</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <p className="text-xs text-pink-400 font-semibold uppercase tracking-wide mb-3">Line Art ✨</p>
                  <div className="w-full h-36 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.25)' }}>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                        style={{ background: 'var(--brand-gradient)' }}>
                        <Wand2 size={20} className="text-white" />
                      </div>
                      <p className="text-xs text-pink-400">Ready to color!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-5">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Converting 12 of 15 photos</span><span>80%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full w-4/5" style={{ background: 'var(--brand-gradient)' }} />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-3 border border-pink-500/30 shadow-glow">
              <p className="text-xs text-slate-400">Just created</p>
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
              <div className="p-10 lg:p-14">
                <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-3 py-1.5 mb-6">
                  <Zap size={14} className="text-pink-400" />
                  <span className="text-pink-400 text-xs font-semibold">How It Works</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-4">
                  Photo to coloring page<br />
                  <span className="gradient-text">in 4 steps.</span>
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Upload your photos, let the AI work, arrange your book, then download or order print.
                </p>
                <Link href="/signup" className="btn-brand px-6 py-3 text-sm">Try Free — No Card Needed</Link>
              </div>

              <div className="p-10 flex items-center" style={{ background: 'linear-gradient(135deg,rgba(102,126,234,0.08),rgba(236,72,153,0.08))' }}>
                <div className="w-full space-y-3">
                  {[
                    { icon: Upload, label: 'Upload photos', sub: 'Drag & drop up to 20 images', color: 'text-blue-400', border: 'border-blue-500/20' },
                    { icon: Wand2, label: 'AI converts', sub: 'Line art in ~30 seconds', color: 'text-pink-400', border: 'border-pink-500/20' },
                    { icon: BookOpen, label: 'Build your book', sub: 'Reorder, caption, preview', color: 'text-purple-400', border: 'border-purple-500/20' },
                    { icon: Download, label: 'Download or print', sub: 'PDF or physical book shipped', color: 'text-emerald-400', border: 'border-emerald-500/20' },
                  ].map((s, i) => (
                    <div key={s.label} className={`glass rounded-2xl p-4 border ${s.border} flex items-center gap-4`}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5">
                        <s.icon size={17} className={s.color} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{s.label}</p>
                        <p className="text-slate-500 text-xs">{s.sub}</p>
                      </div>
                      <span className="ml-auto text-2xl font-black" style={{ color: 'rgba(255,255,255,0.06)' }}>0{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-3">
            Simple pricing.<br />
            <span className="gradient-text">No surprises.</span>
          </h2>
          <p className="text-slate-400 max-w-sm mx-auto text-sm">Start free. Pay only when you want to download or order.</p>
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
                  style={{ background: 'linear-gradient(135deg,rgba(102,126,234,0.05),rgba(236,72,153,0.05))' }} />
              )}
              <div className="mb-5">
                <p className="text-slate-400 font-semibold text-sm mb-1">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <p className="text-3xl font-black text-white">{plan.price}</p>
                  {plan.period && <p className="text-slate-500 text-sm mb-1">{plan.period}</p>}
                </div>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={13} className="text-pink-400 flex-shrink-0" />
                    <span className="text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup"
                className={plan.highlight
                  ? 'btn-brand text-center py-2.5 text-sm'
                  : 'glass border border-white/20 text-white py-2.5 text-sm rounded-xl hover:bg-white/5 transition font-semibold text-center block'}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">People love ColorBook</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(t => (
            <div key={t.author} className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-200 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
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
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg,rgba(102,126,234,0.08),rgba(236,72,153,0.08))' }} />
          <div className="relative">
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to create yours?<br />
              <span className="gradient-text">It takes 2 minutes.</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm">Start free — no card needed. Upgrade when you're ready.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-brand px-8 py-4 text-base">Create Your Coloring Book →</Link>
              <Link href="#pricing" className="glass border border-white/20 text-white px-8 py-4 text-base rounded-xl hover:bg-white/5 transition font-semibold">
                View Pricing
              </Link>
            </div>
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
              <p className="text-slate-500 text-sm max-w-xs">Turn your favorite photos into personalized coloring books — digital or printed.</p>
            </div>
            {[
              { title: 'Product', links: ['How It Works', 'Pricing', 'Examples', 'FAQ'] },
              { title: 'Use Cases', links: ['Family Photos', 'Pets', 'Travel', "Kids' Art"] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
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
