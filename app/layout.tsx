import type { Metadata } from 'next'
import './globals.css'
import { ModalProvider } from '@/components/providers/modal-provider'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Baby Time Machine',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-neutral-100 font-['Keai'] overflow-hidden">
        {children}
        <Footer />
      </body>
      <ModalProvider />
    </html>
  )
}
