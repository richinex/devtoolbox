'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import yaml from 'js-yaml'

export default function YamlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [flowLevel, setFlowLevel] = useState(-1) // -1 = block style, 1+ = flow style at that level

  const formatYaml = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some YAML to format')
      setOutput('')
      return
    }

    try {
      // Parse the YAML
      const parsed = yaml.load(input)
      
      // Format with options
      const formatted = yaml.dump(parsed, {
        indent: indentSize,
        lineWidth: 80,
        noRefs: true,
        sortKeys: false,
        flowLevel: flowLevel,
        quotingType: '"',
        forceQuotes: false,
        noCompatMode: true
      })
      
      setOutput(formatted)
      setError('')
    } catch (err) {
      const yamlError = err as Error
      setError(`Invalid YAML: ${yamlError.message}`)
      setOutput('')
      
      // Try to provide helpful error details
      if (yamlError.message.includes('line')) {
        const match = yamlError.message.match(/line (\d+)/)
        if (match) {
          const lineNum = parseInt(match[1])
          const lines = input.split('\n')
          if (lines[lineNum - 1]) {
            setError(`${yamlError.message}\nProblematic line: "${lines[lineNum - 1].trim()}"`)
          }
        }
      }
    }
  }, [input, indentSize, flowLevel])

  const validateOnly = () => {
    if (!input.trim()) {
      setError('Please enter some YAML to validate')
      return
    }

    try {
      yaml.load(input)
      setError('')
      setOutput('✅ Valid YAML!')
    } catch (err) {
      const yamlError = err as Error
      setError(`Invalid YAML: ${yamlError.message}`)
      setOutput('')
    }
  }

  const loadSampleYaml = () => {
    setInput(`# Sample YAML configuration
name: MyDailyDevTools
version: 1.0.0
description: Essential developer tools

features:
  - JSON Formatter
  - YAML Validator
  - Base64 Encoder
  - name: Advanced Features
    items:
      - Code formatting
      - Syntax validation
      - Real-time preview

config:
  theme: light
  autoSave: true
  settings:
    indentSize: 2
    lineNumbers: true
    wordWrap: false

environments:
  development:
    debug: true
    apiUrl: http://localhost:3000
  production:
    debug: false
    apiUrl: https://mydailydevtools.com

tags: [tools, developer, utilities]
active: true`)
  }

  const loadBrokenYaml = () => {
    setInput(`# Broken YAML with common errors
name: MyApp
  version: 1.0.0  # Wrong indentation
features:
  - Feature 1
  - Feature 2
    - Nested wrong  # Can't mix list styles
config:
  theme: dark
  settings
    fontSize: 14  # Missing colon
  colors: [red, blue  # Unclosed bracket
invalid: @#$%  # Invalid characters`)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const copyToClipboard = () => {
    if (output && !output.startsWith('✅')) {
      navigator.clipboard.writeText(output).catch(err => {
        console.error('Failed to copy:', err)
      })
    }
  }

  const downloadOutput = () => {
    if (!output || output.startsWith('✅')) return
    
    const blob = new Blob([output], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formatted.yaml'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Auto-format when input or settings change
  useEffect(() => {
    if (input.trim()) {
      const timer = setTimeout(() => {
        formatYaml()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [input, formatYaml])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">YAML Formatter & Validator</h1>
          <p className="text-gray-600 mt-1">Format and validate YAML with helpful error messages</p>
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
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm">Style:</label>
                <select
                  value={flowLevel}
                  onChange={(e) => setFlowLevel(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="-1">Block style</option>
                  <option value="2">Flow style (compact)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={validateOnly} variant="primary">Validate Only</Button>
              <Button onClick={loadSampleYaml} variant="secondary">Load Valid Sample</Button>
              <Button onClick={loadBrokenYaml} variant="secondary">Load Broken Sample</Button>
              <Button onClick={clearAll} variant="danger">Clear</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">YAML Input</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Paste your YAML here..."
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Formatted Output</h2>
              <div className="flex gap-2">
                {output && !output.startsWith('✅') && (
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
                  <p className="text-red-700 text-sm whitespace-pre-wrap">{error}</p>
                </div>
              )}
              
              {output.startsWith('✅') && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <p className="text-green-700 text-lg font-semibold">{output}</p>
                </div>
              )}
              
              <Textarea
                value={output.startsWith('✅') ? '' : output}
                onChange={() => {}}
                placeholder="Formatted YAML will appear here..."
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
                <li>• <strong>Validation:</strong> Check YAML syntax with detailed error messages</li>
                <li>• <strong>Formatting:</strong> Beautify YAML with consistent indentation</li>
                <li>• <strong>Error highlighting:</strong> Shows exact line numbers for errors</li>
                <li>• <strong>Multiple styles:</strong> Choose between block and flow styles</li>
                <li>• <strong>Real-time validation:</strong> Updates as you type</li>
                <li>• <strong>Custom indentation:</strong> 2 or 4 space indentation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Common YAML Rules</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Indentation:</strong> Use spaces, not tabs</li>
                <li>• <strong>Colons:</strong> Space required after colon in mappings</li>
                <li>• <strong>Lists:</strong> Start with dash and space {`"- item"`}</li>
                <li>• <strong>Strings:</strong> Quote if contains special characters</li>
                <li>• <strong>Comments:</strong> Start with # symbol</li>
                <li>• <strong>Documents:</strong> Separate with --- delimiter</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}