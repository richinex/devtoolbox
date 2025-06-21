import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hash Generator - MD5 SHA1 SHA256 SHA512 Online | DevToolbox',
  description: 'Free online hash generator. Generate MD5, SHA-1, SHA-256, SHA-512 hashes instantly. Secure cryptographic hashing for passwords, files, and data verification.',
  keywords: 'hash generator, MD5 generator, SHA256 generator, SHA512 generator, cryptographic hash, checksum calculator, password hash',
  openGraph: {
    title: 'Hash Generator - Free Cryptographic Hash Tool',
    description: 'Generate secure hashes using MD5, SHA-1, SHA-256, and SHA-512 algorithms. Perfect for data verification and security.',
    type: 'website',
  },
}

export default function HashGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}