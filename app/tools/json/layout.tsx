import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON Tools - Free Online JSON Formatter, Converter & Validator | MyDailyDevTools',
  description: 'Complete collection of JSON tools: formatter, validator, fixer, converters (JSON to YAML, CSV to JSON). All tools are free, work offline, and respect your privacy.',
  keywords: 'json tools, json formatter, json validator, json converter, json to yaml, csv to json, json fixer, online json tools',
  alternates: {
    canonical: 'https://mydailydevtools.com/tools/json',
  },
  openGraph: {
    title: 'JSON Tools Collection - Free Online Developer Tools',
    description: 'Professional JSON tools for developers. Format, validate, convert, and fix JSON data with our comprehensive suite.',
    type: 'website',
    url: 'https://mydailydevtools.com/tools/json',
  },
}

export default function JsonToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}