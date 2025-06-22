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
    title: 'JSON Fixer',
    description: 'Fix and format broken JSON automatically',
    href: '/json-fixer',
    icon: '🔧',
  },
  {
    title: 'JSON ↔ YAML Converter',
    description: 'Convert between JSON and YAML formats',
    href: '/json-yaml-converter',
    icon: '🔄',
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
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">MyDailyDevTools</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Essential developer tools for everyday tasks. Fast, free, and works offline.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 sm:p-6 border border-gray-200 active:scale-95 transform transition-transform"
            >
              <div className="text-2xl sm:text-3xl mb-3">{tool.icon}</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{tool.title}</h3>
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