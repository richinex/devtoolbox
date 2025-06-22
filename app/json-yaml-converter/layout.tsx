import type { Metadata } from 'next'
import StructuredData, { createToolStructuredData } from '@/components/seo/StructuredData'

export const metadata: Metadata = {
  title: 'JSON to YAML Converter - Convert JSON to YAML Online | MyDailyDevTools',
  description: 'Free online JSON to YAML converter. Convert JSON data to YAML format and vice versa. Handles nested objects, arrays, and special characters. No data sent to servers.',
  keywords: 'json to yaml, yaml to json, json yaml converter, convert json to yaml, yaml converter, json converter, yaml formatter, configuration converter',
  alternates: {
    canonical: 'https://mydailydevtools.com/json-yaml-converter',
  },
  openGraph: {
    title: 'JSON to YAML Converter - Free Online Tool',
    description: 'Convert between JSON and YAML formats instantly. Privacy-focused tool that works offline.',
    type: 'website',
    url: 'https://mydailydevtools.com/json-yaml-converter',
  },
}

const jsonYamlStructuredData = createToolStructuredData({
  name: 'JSON to YAML Converter',
  description: 'Free online tool to convert between JSON and YAML formats. Features bidirectional conversion, proper formatting, and file download.',
  url: 'https://mydailydevtools.com/json-yaml-converter',
  category: 'DeveloperApplication',
})

export default function JsonYamlLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StructuredData data={jsonYamlStructuredData} />
      {children}
    </>
  )
}