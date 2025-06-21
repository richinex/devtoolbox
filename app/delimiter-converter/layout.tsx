import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delimiter Converter - CSV TSV Pipe Custom Delimiters | DevToolbox',
  description: 'Free online delimiter converter. Convert between CSV, TSV, pipe-separated, semicolon, and custom delimited formats. Handle quoted fields and headers correctly.',
  keywords: 'delimiter converter, CSV converter, TSV converter, pipe separated values, semicolon delimiter, custom delimiter, data conversion',
  openGraph: {
    title: 'Delimiter Converter - Convert CSV, TSV, and Custom Formats',
    description: 'Convert between different delimited data formats with proper quote handling and custom delimiters. Free online tool.',
    type: 'website',
  },
}

export default function DelimiterConverterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}