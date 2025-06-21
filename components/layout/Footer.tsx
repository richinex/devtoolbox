import Link from 'next/link'

const toolCategories = {
  'Text & Data': [
    { title: 'JSON Formatter', href: '/json-formatter' },
    { title: 'Base64 Encoder', href: '/base64' },
    { title: 'Text Diff Checker', href: '/text-diff' },
    { title: 'Delimiter Converter', href: '/delimiter-converter' },
  ],
  'Security & Hashing': [
    { title: 'Hash Generator', href: '/hash-generator' },
    { title: 'Password Generator', href: '/password-generator' },
  ],
  'Web & URLs': [
    { title: 'URL Encoder', href: '/url-encoder' },
    { title: 'QR Code Generator', href: '/qr-generator' },
  ],
  'Identifiers': [
    { title: 'UUID Generator', href: '/uuid-generator' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-blue-400">DevToolbox</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Essential developer tools for everyday tasks. Fast, free, and privacy-focused.
            </p>
            <p className="text-gray-500 text-xs">
              All processing happens in your browser. No data is sent to our servers.
            </p>
          </div>

          {/* Tool Categories */}
          {Object.entries(toolCategories).map(([category, tools]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {tools.map((tool) => (
                  <li key={tool.href}>
                    <Link 
                      href={tool.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/" className="text-gray-400 hover:text-white text-sm">
                Home
              </Link>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400 text-sm">
                Privacy-First Tools
              </span>
            </div>
            
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} DevToolbox. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}