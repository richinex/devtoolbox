import Link from 'next/link'

export interface NavigationItem {
  title: string
  href: string
  icon?: string
  description?: string
}

interface NavigationProps {
  items: NavigationItem[]
  className?: string
  variant?: 'horizontal' | 'vertical' | 'grid'
}

export const toolsNavigation: NavigationItem[] = [
  { 
    title: 'JSON Formatter', 
    href: '/json-formatter', 
    icon: '{}',
    description: 'Format and validate JSON data'
  },
  { 
    title: 'URL Encoder', 
    href: '/url-encoder', 
    icon: '🔗',
    description: 'Encode and decode URLs'
  },
  { 
    title: 'Base64 Encoder', 
    href: '/base64', 
    icon: '📄',
    description: 'Encode and decode Base64'
  },
  { 
    title: 'Hash Generator', 
    href: '/hash-generator', 
    icon: '#',
    description: 'Generate MD5, SHA hashes'
  },
  { 
    title: 'Password Generator', 
    href: '/password-generator', 
    icon: '🔒',
    description: 'Create secure passwords'
  },
  { 
    title: 'Text Diff Checker', 
    href: '/text-diff', 
    icon: '📝',
    description: 'Compare text differences'
  },
  { 
    title: 'UUID Generator', 
    href: '/uuid-generator', 
    icon: '🆔',
    description: 'Generate unique identifiers'
  },
  { 
    title: 'QR Code Generator', 
    href: '/qr-generator', 
    icon: '▢',
    description: 'Create QR codes'
  },
  { 
    title: 'Delimiter Converter', 
    href: '/delimiter-converter', 
    icon: '📊',
    description: 'Convert CSV, TSV formats'
  },
]

export default function Navigation({ 
  items, 
  className = '', 
  variant = 'horizontal' 
}: NavigationProps) {
  const baseClasses = 'transition-colors duration-200'
  const variantClasses = {
    horizontal: 'flex flex-wrap gap-4',
    vertical: 'flex flex-col space-y-2',
    grid: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
  }

  return (
    <nav className={`${variantClasses[variant]} ${className}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            ${baseClasses}
            ${variant === 'grid' 
              ? 'p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 block'
              : 'px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100'
            }
          `}
        >
          {item.icon && variant === 'grid' && (
            <div className="text-2xl mb-2">{item.icon}</div>
          )}
          {item.icon && variant !== 'grid' && (
            <span className="mr-2">{item.icon}</span>
          )}
          <div>
            <div className={variant === 'grid' ? 'font-semibold text-gray-900' : ''}>
              {item.title}
            </div>
            {item.description && variant === 'grid' && (
              <div className="text-sm text-gray-600 mt-1">
                {item.description}
              </div>
            )}
          </div>
        </Link>
      ))}
    </nav>
  )
}

// Breadcrumb Navigation Component
export function Breadcrumb({ 
  items 
}: { 
  items: { title: string; href?: string }[] 
}) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {item.href ? (
            <Link href={item.href} className="hover:text-blue-600">
              {item.title}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.title}</span>
          )}
        </div>
      ))}
    </nav>
  )
}