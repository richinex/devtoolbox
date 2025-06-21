import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UUID Generator - Generate Unique Identifiers v1 v3 v4 v5 | DevToolbox',
  description: 'Free UUID generator supporting all versions (v1, v3, v4, v5). Generate unique identifiers for databases, APIs, and applications. Bulk generation available.',
  keywords: 'UUID generator, GUID generator, unique identifier, UUID v4, UUID v1, generate UUID online, random UUID',
  openGraph: {
    title: 'UUID Generator - Create Unique Identifiers',
    description: 'Generate UUIDs (v1, v3, v4, v5) for your applications. Free online tool supporting all UUID versions with bulk generation.',
    type: 'website',
  },
}

export default function UuidGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}