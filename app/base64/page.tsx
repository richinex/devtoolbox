'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

export default function Base64Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const encodeBase64 = () => {
    try {
      setOutput(btoa(input))
      setError('')
    } catch {
      setError('Error encoding to Base64')
      setOutput('')
    }
  }

  const decodeBase64 = () => {
    try {
      setOutput(atob(input))
      setError('')
    } catch {
      setError('Invalid Base64 string')
      setOutput('')
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Base64 Encoder/Decoder</h1>
          <p className="text-gray-600 mt-1">Encode and decode Base64 strings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Input</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Enter text to encode or Base64 to decode..."
                rows={8}
                className="font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={encodeBase64}>Encode</Button>
                <Button onClick={decodeBase64} variant="secondary">Decode</Button>
                <Button onClick={clearAll} variant="danger">Clear</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Output</h2>
              {output && (
                <Button onClick={copyToClipboard} size="sm" variant="secondary">
                  Copy
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              <Textarea
                value={output}
                onChange={() => {}}
                placeholder="Encoded/decoded result will appear here..."
                rows={8}
                className="font-mono text-sm"
                disabled
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">About Base64 Encoding</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Base64</strong> is a binary-to-text encoding scheme that represents binary data in an ASCII string format.</p>
            <p><strong>Common use cases:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Encoding binary data for transmission over text-based protocols</li>
              <li>• Embedding images in HTML/CSS as data URLs</li>
              <li>• Basic authentication in HTTP headers</li>
              <li>• Storing binary data in JSON or XML</li>
            </ul>
            <p><strong>Example:</strong> &ldquo;Hello&rdquo; becomes &ldquo;SGVsbG8=&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  )
}