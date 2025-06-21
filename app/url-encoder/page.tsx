'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

export default function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const encodeUrl = () => {
    try {
      setOutput(encodeURIComponent(input))
    } catch {
      setOutput('Error encoding URL')
    }
  }

  const decodeUrl = () => {
    try {
      setOutput(decodeURIComponent(input))
    } catch {
      setOutput('Error decoding URL')
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
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
          <h1 className="text-3xl font-bold text-gray-900 mt-2">URL Encoder/Decoder</h1>
          <p className="text-gray-600 mt-1">Encode and decode URLs safely</p>
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
                placeholder="Enter text or URL to encode/decode..."
                rows={8}
                className="font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={encodeUrl}>Encode</Button>
                <Button onClick={decodeUrl} variant="secondary">Decode</Button>
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
          <h3 className="text-lg font-semibold mb-3">About URL Encoding</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>URL Encoding</strong> converts characters into a format that can be transmitted over the Internet.</p>
            <p><strong>Common use cases:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Encoding query parameters in URLs</li>
              <li>• Handling special characters in form data</li>
              <li>• Making URLs safe for transmission</li>
            </ul>
            <p><strong>Example:</strong> &ldquo;Hello World!&rdquo; becomes &ldquo;Hello%20World%21&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  )
}