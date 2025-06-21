'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5 } from 'uuid'

interface UuidVersion {
  value: string
  label: string
  description: string
}

const uuidVersions: UuidVersion[] = [
  { value: 'v1', label: 'Version 1', description: 'Time-based with MAC address' },
  { value: 'v3', label: 'Version 3', description: 'Name-based using MD5' },
  { value: 'v4', label: 'Version 4', description: 'Random (recommended)' },
  { value: 'v5', label: 'Version 5', description: 'Name-based using SHA-1' },
]

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState('1')
  const [version, setVersion] = useState('v4')
  const [namespace, setNamespace] = useState('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
  const [name, setName] = useState('example.com')

  const generateUuid = (ver: string): string => {
    switch (ver) {
      case 'v1':
        return uuidv1()
      case 'v3':
        return uuidv3(name, namespace)
      case 'v4':
        return uuidv4()
      case 'v5':
        return uuidv5(name, namespace)
      default:
        return uuidv4()
    }
  }

  const generateUuids = () => {
    const numberOfUuids = Math.min(Math.max(1, parseInt(count) || 1), 100)
    const newUuids = Array.from({ length: numberOfUuids }, () => generateUuid(version))
    setUuids(newUuids)
  }

  const copyToClipboard = (uuid: string) => {
    navigator.clipboard.writeText(uuid)
  }

  const copyAllToClipboard = () => {
    if (uuids.length > 0) {
      navigator.clipboard.writeText(uuids.join('\n'))
    }
  }

  const clearAll = () => {
    setUuids([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">UUID Generator</h1>
          <p className="text-gray-600 mt-1">Generate unique identifiers (v1, v3, v4, v5)</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Generate UUIDs</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UUID Version
                    </label>
                    <select
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {uuidVersions.map((ver) => (
                        <option key={ver.value} value={ver.value}>
                          {ver.label} - {ver.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of UUIDs (1-100)
                    </label>
                    <Input
                      value={count}
                      onChange={setCount}
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1"
                    />
                  </div>
                </div>

                {(version === 'v3' || version === 'v5') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Namespace UUID
                      </label>
                      <Input
                        value={namespace}
                        onChange={setNamespace}
                        placeholder="6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <Input
                        value={name}
                        onChange={setName}
                        placeholder="example.com"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={generateUuids}>Generate</Button>
                  {uuids.length > 0 && (
                    <Button onClick={clearAll} variant="danger">Clear</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {uuids.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold">Generated UUIDs ({uuids.length})</h2>
                <Button onClick={copyAllToClipboard} size="sm" variant="secondary">
                  Copy All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {uuids.map((uuid, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                      <code className="flex-1 font-mono text-sm">{uuid}</code>
                      <Button
                        onClick={() => copyToClipboard(uuid)}
                        size="sm"
                        variant="secondary"
                      >
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">About UUIDs</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>UUID (Universally Unique Identifier)</strong> is a 128-bit identifier that is guaranteed to be unique across all systems.</p>
              <p><strong>Format:</strong> 8-4-4-4-12 hexadecimal digits</p>
              <p><strong>Example:</strong> 123e4567-e89b-12d3-a456-426614174000</p>
              <p><strong>Common use cases:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Database primary keys</li>
                <li>• API request identifiers</li>
                <li>• File names for uploads</li>
                <li>• Session identifiers</li>
                <li>• Distributed system coordination</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3">UUID Versions</h3>
            <div className="text-sm text-gray-600 space-y-3">
              <div>
                <p><strong>Version 1:</strong> Time-based with MAC address</p>
                <p className="text-xs text-gray-500">Includes timestamp and network node identifier</p>
              </div>
              <div>
                <p><strong>Version 3:</strong> Name-based using MD5</p>
                <p className="text-xs text-gray-500">Generated from namespace and name using MD5 hash</p>
              </div>
              <div>
                <p><strong>Version 4:</strong> Random (recommended)</p>
                <p className="text-xs text-gray-500">Randomly generated, most commonly used</p>
              </div>
              <div>
                <p><strong>Version 5:</strong> Name-based using SHA-1</p>
                <p className="text-xs text-gray-500">Generated from namespace and name using SHA-1 hash</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}