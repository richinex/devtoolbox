'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message)
      setOutput('')
    }
  }

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError('')
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message)
      setOutput('')
    }
  }

  const validateJson = () => {
    try {
      JSON.parse(input)
      setError('')
      setOutput('✅ Valid JSON')
    } catch (err) {
      setError('❌ Invalid JSON: ' + (err as Error).message)
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
          <h1 className="text-3xl font-bold text-gray-900 mt-2">JSON Formatter</h1>
          <p className="text-gray-600 mt-1">Format, validate, and beautify JSON data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Input JSON</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Paste your JSON here..."
                rows={12}
                className="font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={formatJson}>Format</Button>
                <Button onClick={minifyJson} variant="secondary">Minify</Button>
                <Button onClick={validateJson} variant="secondary">Validate</Button>
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
                placeholder="Formatted JSON will appear here..."
                rows={12}
                className="font-mono text-sm"
                disabled
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">How to use JSON Formatter</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Format:</strong> Beautify JSON with proper indentation</li>
            <li>• <strong>Minify:</strong> Remove whitespace to reduce file size</li>
            <li>• <strong>Validate:</strong> Check if JSON syntax is correct</li>
            <li>• All processing happens in your browser - no data is sent to servers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}