'use client'

import Link from 'next/link'
import { useState } from 'react'

const tools = [
  { title: 'JSON Formatter', href: '/json-formatter', icon: '{}' },
  { title: 'JSON ↔ YAML', href: '/json-yaml-converter', icon: '🔄' },
  { title: 'URL Encoder', href: '/url-encoder', icon: '🔗' },
  { title: 'Base64 Encoder', href: '/base64', icon: '📄' },
  { title: 'Hash Generator', href: '/hash-generator', icon: '#' },
  { title: 'Password Generator', href: '/password-generator', icon: '🔒' },
  { title: 'Text Diff Checker', href: '/text-diff', icon: '📝' },
  { title: 'UUID Generator', href: '/uuid-generator', icon: '🆔' },
  { title: 'QR Code Generator', href: '/qr-generator', icon: '▢' },
  { title: 'Delimiter Converter', href: '/delimiter-converter', icon: '📊' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">MyDailyDevTools</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Tools
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1 grid grid-cols-1">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <span className="mr-3 text-lg">{tool.icon}</span>
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="px-3 py-2 text-base font-medium text-gray-900 border-b border-gray-200 mb-2">
                Tools
              </div>
              
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center px-6 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3 text-lg">{tool.icon}</span>
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}