import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'

const jsonTools = [
  {
    title: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data with syntax highlighting',
    href: '/json-formatter',
    icon: '{}',
    features: ['Syntax validation', 'Pretty print', 'Minify', 'Error detection']
  },
  {
    title: 'JSON Fixer',
    description: 'Automatically fix common JSON syntax errors like trailing commas',
    href: '/json-fixer',
    icon: '🔧',
    features: ['Auto-fix errors', 'Handle trailing commas', 'Quote correction', 'Smart repair']
  },
  {
    title: 'JSON to YAML Converter',
    description: 'Convert between JSON and YAML formats seamlessly',
    href: '/json-yaml-converter',
    icon: '🔄',
    features: ['Bidirectional conversion', 'Preserve formatting', 'Handle complex objects', 'Download results']
  },
  {
    title: 'CSV to JSON Converter',
    description: 'Transform CSV data into JSON arrays or objects',
    href: '/csv-json-converter',
    icon: '📊',
    features: ['Custom delimiters', 'Header detection', 'Nested objects', 'Batch processing']
  },
]

export default function JsonToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            JSON Tools Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional JSON tools for developers. Format, validate, convert, and fix JSON data 
            with our comprehensive suite of free online tools. No registration required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {jsonTools.map((tool) => (
            <Card key={tool.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <span className="text-2xl">{tool.icon}</span>
                      {tool.title}
                    </h2>
                    <p className="text-gray-600 mt-2">{tool.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-sm text-gray-700 mb-2">Key Features:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={tool.href}
                    className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Open Tool →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4">Why Use Our JSON Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-2">🔒 Privacy First</h3>
              <p className="text-gray-600">All processing happens in your browser. No data is sent to our servers.</p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">⚡ Lightning Fast</h3>
              <p className="text-gray-600">Instant results with no waiting. Process large JSON files efficiently.</p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">🎯 Developer Focused</h3>
              <p className="text-gray-600">Built by developers, for developers. Clean interface, powerful features.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to All Tools
          </Link>
        </div>
      </div>
    </div>
  )
}