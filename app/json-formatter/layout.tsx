import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Formatter - Format, Validate & Beautify JSON Online | DevToolbox',
  description: 'Free online JSON formatter and validator. Format, beautify, minify and validate JSON data instantly. Works offline with privacy protection.',
  keywords: 'JSON formatter, JSON validator, JSON beautifier, format JSON online, validate JSON, minify JSON',
  openGraph: {
    title: 'JSON Formatter - Free Online JSON Tools',
    description: 'Format, validate and beautify JSON data with our free online tool. Fast, secure, and works offline.',
    type: 'website',
  },
}

export default function JsonFormatterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}