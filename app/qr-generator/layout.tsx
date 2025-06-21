import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QR Code Generator - Create QR Codes Online Free | DevToolbox',
  description: 'Free QR code generator. Create QR codes from text, URLs, WiFi passwords, and more. Customize size, colors, and error correction. Download as PNG or SVG.',
  keywords: 'QR code generator, create QR code, QR code maker, generate QR code online, custom QR code, free QR generator',
  openGraph: {
    title: 'QR Code Generator - Free Online QR Code Creator',
    description: 'Generate custom QR codes from text, URLs, and data. Free online tool with customization options and multiple download formats.',
    type: 'website',
  },
}

export default function QrGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}