import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'

interface RelatedTool {
  title: string
  description: string
  href: string
  icon: string
}

interface RelatedToolsProps {
  tools: RelatedTool[]
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-semibold">Related Tools</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">{tool.icon}</span>
              <div>
                <h4 className="font-medium text-sm">{tool.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Common related tools sets
export const jsonTools: RelatedTool[] = [
  {
    title: 'JSON Fixer',
    description: 'Fix broken JSON automatically',
    href: '/json-fixer',
    icon: '🔧',
  },
  {
    title: 'JSON to YAML',
    description: 'Convert JSON to YAML format',
    href: '/json-yaml-converter',
    icon: '🔄',
  },
  {
    title: 'CSV to JSON',
    description: 'Convert CSV data to JSON',
    href: '/csv-json-converter',
    icon: '📊',
  },
]

export const dataFormatTools: RelatedTool[] = [
  {
    title: 'XML Formatter',
    description: 'Format and validate XML',
    href: '/xml-formatter',
    icon: '📄',
  },
  {
    title: 'YAML Formatter',
    description: 'Format and validate YAML',
    href: '/yaml-formatter',
    icon: '📋',
  },
  {
    title: 'SQL Formatter',
    description: 'Format SQL queries',
    href: '/sql-formatter',
    icon: '🗃️',
  },
]

export const encodingTools: RelatedTool[] = [
  {
    title: 'Base64 Encoder',
    description: 'Encode and decode Base64',
    href: '/base64',
    icon: '📄',
  },
  {
    title: 'URL Encoder',
    description: 'Encode and decode URLs',
    href: '/url-encoder',
    icon: '🔗',
  },
  {
    title: 'JWT Decoder',
    description: 'Decode JSON Web Tokens',
    href: '/jwt-decoder',
    icon: '🔐',
  },
]