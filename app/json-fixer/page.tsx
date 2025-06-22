'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { jsonrepair } from 'jsonrepair'

export default function JsonFixer() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [fixedIssues, setFixedIssues] = useState<string[]>([])
  const [indentSize, setIndentSize] = useState(2)

  const formatAndFix = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some JSON to format')
      setOutput('')
      setFixedIssues([])
      return
    }

    try {
      // First try to parse as-is
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indentSize))
      setError('')
      setFixedIssues(['No issues found - JSON is valid'])
    } catch {
      // If parsing fails, try to repair
      try {
        const repaired = jsonrepair(input)
        const parsed = JSON.parse(repaired)
        setOutput(JSON.stringify(parsed, null, indentSize))
        
        // Try to identify what was fixed
        const issues: string[] = []
        
        // Check for common issues
        if (input.includes("'") && !input.includes('"')) {
          issues.push('Fixed single quotes to double quotes')
        }
        if (input.match(/,\s*[}\]]/)) {
          issues.push('Removed trailing commas')
        }
        if (input.match(/[{,]\s*\w+\s*:/)) {
          issues.push('Added quotes to unquoted keys')
        }
        if (input !== repaired && issues.length === 0) {
          issues.push('Fixed JSON syntax errors')
        }
        
        setFixedIssues(issues)
        setError('')
      } catch (repairError) {
        setError(`Unable to fix JSON: ${(repairError as Error).message}`)
        setOutput('')
        setFixedIssues([])
      }
    }
  }, [input, indentSize])

  const loadBrokenSample = () => {
    setInput(`{
  name: "John Doe",
  'age': 30,
  "city": "New York",
  hobbies: ["reading", "coding",],
  address: {
    street: '123 Main St',
    zipCode: 10001,
  },
  active: true,
}`)
  }

  const loadValidSample = () => {
    setInput(JSON.stringify({
      name: "John Doe",
      age: 30,
      city: "New York",
      hobbies: ["reading", "coding"],
      address: {
        street: "123 Main St",
        zipCode: 10001
      },
      active: true
    }, null, 2))
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setFixedIssues([])
  }

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output).catch(err => {
        console.error('Failed to copy:', err)
      })
    }
  }

  const downloadOutput = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formatted.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Auto-format when input changes
  useEffect(() => {
    if (input.trim()) {
      const timer = setTimeout(() => {
        formatAndFix()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [input, formatAndFix])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">JSON Formatter & Fixer</h1>
          <p className="text-gray-600 mt-1">Format JSON and automatically fix common syntax errors</p>
        </div>

        {/* Settings */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Settings</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm">Indent size:</label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                  <option value="0">Compact</option>
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={loadBrokenSample} variant="secondary">Load Broken JSON</Button>
                <Button onClick={loadValidSample} variant="secondary">Load Valid JSON</Button>
                <Button onClick={clearAll} variant="danger">Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">JSON Input</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Paste your JSON here (even if it's broken)..."
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Formatted Output</h2>
              <div className="flex gap-2">
                {output && (
                  <>
                    <Button onClick={downloadOutput} size="sm" variant="secondary">
                      Download
                    </Button>
                    <Button onClick={copyToClipboard} size="sm" variant="secondary">
                      Copy
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              {fixedIssues.length > 0 && !error && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <p className="text-green-700 text-sm font-semibold">Fixed issues:</p>
                  <ul className="text-green-600 text-sm mt-1">
                    {fixedIssues.map((issue, i) => (
                      <li key={i}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Textarea
                value={output}
                onChange={() => {}}
                placeholder="Formatted JSON will appear here..."
                rows={20}
                className="font-mono text-sm"
                disabled
              />
            </CardContent>
          </Card>
        </div>

        {/* Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Features</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Auto-fix errors:</strong> Automatically repairs common JSON syntax errors</li>
                <li>• <strong>Single to double quotes:</strong> Converts single quotes to valid double quotes</li>
                <li>• <strong>Trailing comma removal:</strong> Removes invalid trailing commas</li>
                <li>• <strong>Unquoted keys:</strong> Adds quotes to unquoted object keys</li>
                <li>• <strong>Format options:</strong> Choose between 2 spaces, 4 spaces, or compact</li>
                <li>• <strong>Real-time formatting:</strong> Updates as you type</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Common JSON Errors Fixed</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Single quotes:</strong> {`'name' → "name"`}</li>
                <li>• <strong>Unquoted keys:</strong> {`{key: value} → {"key": "value"}`}</li>
                <li>• <strong>Trailing commas:</strong> {`[1, 2,] → [1, 2]`}</li>
                <li>• <strong>Missing commas:</strong> {`{"a": 1 "b": 2} → {"a": 1, "b": 2}`}</li>
                <li>• <strong>Comments:</strong> Removes // and /* */ comments</li>
                <li>• <strong>Undefined values:</strong> Handles undefined properly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}