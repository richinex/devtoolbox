import type { Metadata } from 'next'
import StructuredData, { createToolStructuredData } from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'JSON Formatter Online - Format, Validate & Beautify JSON | MyDailyDevTools',
  description: 'Free online JSON formatter, validator and beautifier. Format messy JSON, validate syntax, minify for production. No data sent to servers - 100% client-side.',
  keywords: 'json formatter, json validator, json beautifier, format json online, validate json, minify json, json parser, json editor, json viewer',
  alternates: {
    canonical: 'https://mydailydevtools.com/json-formatter',
  },
  openGraph: {
    title: 'JSON Formatter - Free Online JSON Tools',
    description: 'Format, validate and beautify JSON data instantly. Privacy-focused tool that works offline.',
    type: 'website',
    url: 'https://mydailydevtools.com/json-formatter',
  },
}

const jsonFormatterStructuredData = createToolStructuredData({
  name: 'JSON Formatter & Validator',
  description: 'Free online tool to format, validate, and beautify JSON data. Features include syntax highlighting, error detection, and minification.',
  url: 'https://mydailydevtools.com/json-formatter',
  category: 'DeveloperApplication',
})

export default function JsonFormatterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StructuredData data={jsonFormatterStructuredData} />
      {children}
    </>
  )
}