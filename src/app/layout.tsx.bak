import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ColorBook — Turn Photos Into Coloring Pages',
  description: 'Upload your photos and AI converts them into beautiful hand-drawn coloring book line art.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ background: '#0D1220', color: '#F0E8D8' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
