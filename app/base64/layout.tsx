import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 Encoder Decoder - Encode & Decode Base64 Online | DevToolbox',
  description: 'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 strings instantly. Supports file encoding with drag-and-drop. Privacy-focused tool.',
  keywords: 'base64 encoder, base64 decoder, encode base64 online, decode base64, base64 converter, text to base64',
  openGraph: {
    title: 'Base64 Encoder/Decoder - Free Online Tool',
    description: 'Encode and decode Base64 strings with our free online tool. Perfect for data encoding and web development.',
    type: 'website',
  },
}

export default function Base64Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}