import Link from 'next/link'

const tools = [
  {
    title: 'Delimiter Converter',
    description: 'Convert between CSV, TSV, pipe, and custom delimiters',
    href: '/delimiter-converter',
    icon: '📊',
  },
  {
    title: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data',
    href: '/json-formatter',
    icon: '{}',
  },
  {
    title: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs safely',
    href: '/url-encoder',
    icon: '🔗',
  },
  {
    title: 'Base64 Encoder',
    description: 'Encode and decode Base64 strings',
    href: '/base64',
    icon: '📄',
  },
  {
    title: 'Hash Generator',
    description: 'Generate MD5, SHA-256, SHA-512 hashes',
    href: '/hash-generator',
    icon: '#',
  },
  {
    title: 'Password Generator',
    description: 'Generate secure passwords',
    href: '/password-generator',
    icon: '🔒',
  },
  {
    title: 'Text Diff Checker',
    description: 'Compare text differences side-by-side',
    href: '/text-diff',
    icon: '📝',
  },
  {
    title: 'UUID Generator',
    description: 'Generate unique identifiers (v1, v3, v4, v5)',
    href: '/uuid-generator',
    icon: '🆔',
  },
  {
    title: 'QR Code Generator',
    description: 'Create QR codes from text or URLs',
    href: '/qr-generator',
    icon: '▢',
  },
]

export default function Home() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DevToolbox</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Essential developer tools for everyday tasks. Fast, free, and works offline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
            >
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
              <p className="text-gray-600 text-sm">{tool.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            All tools work client-side for privacy and speed. No data is sent to our servers.
          </p>
        </div>
      </div>
    </div>
  )
}