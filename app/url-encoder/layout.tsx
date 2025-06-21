import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'URL Encoder Decoder - Encode & Decode URLs Online | DevToolbox',
  description: 'Free URL encoder and decoder tool. Safely encode URLs for transmission and decode URL-encoded strings. Fast, secure, client-side processing.',
  keywords: 'URL encoder, URL decoder, encode URL online, decode URL, URL encoding tool',
  openGraph: {
    title: 'URL Encoder/Decoder - Free Online Tool',
    description: 'Encode and decode URLs safely with our free online tool. Perfect for web developers and data processing.',
    type: 'website',
  },
}

export default function UrlEncoderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}