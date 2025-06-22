'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

export default function JsonYamlConverter() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml')
    const [error, setError] = useState('')
    const [indentSize, setIndentSize] = useState(2)

    // Convert JSON to YAML
    const jsonToYaml = (obj: unknown, indent: number = 0): string => {
        const spaces = ' '.repeat(indent)
        
        if (obj === null || obj === undefined) return 'null'
        if (typeof obj === 'boolean') return obj.toString()
        if (typeof obj === 'number') return obj.toString()
        if (typeof obj === 'string') {
            // Handle multiline strings
            if (obj.includes('\n')) {
                return '|\n' + obj.split('\n').map(line => spaces + '  ' + line).join('\n')
            }
            // Quote strings that need it
            if (obj.match(/^[\d.]+$/) || obj.includes(':') || obj.includes('#') || obj.includes('@') || 
                obj.includes('|') || obj.includes('>') || obj.includes('[') || obj.includes(']') ||
                obj.includes('{') || obj.includes('}') || obj.includes(',') || obj.includes('*') ||
                obj.includes('&') || obj.includes('!') || obj.includes('%') || obj.includes('\\') ||
                obj.includes('"') || obj.includes("'") || obj.trim() !== obj) {
                return JSON.stringify(obj)
            }
            return obj
        }
        
        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]'
            return obj.map(item => {
                const value = jsonToYaml(item, indent + indentSize)
                if (typeof item === 'object' && item !== null) {
                    return '\n' + spaces + '- ' + value.split('\n').map((line, i) => 
                        i === 0 ? line : spaces + '  ' + line
                    ).join('\n').trim()
                }
                return '\n' + spaces + '- ' + value
            }).join('')
        }
        
        if (typeof obj === 'object' && obj !== null) {
            // Type assertion needed here because TypeScript doesn't narrow the type enough
            const entries = Object.entries(obj as Record<string, unknown>)
            if (entries.length === 0) return '{}'
            
            return entries.map(([key, value]) => {
                const yamlValue = jsonToYaml(value, indent + indentSize)
                const needsQuotes = key.includes(' ') || key.includes(':') || key.match(/^[\d.]+$/)
                const yamlKey = needsQuotes ? JSON.stringify(key) : key
                
                if (typeof value === 'object' && value !== null && !Array.isArray(value) && Object.keys(value).length > 0) {
                    return '\n' + spaces + yamlKey + ':' + yamlValue
                } else if (Array.isArray(value) && value.length > 0) {
                    return '\n' + spaces + yamlKey + ':' + yamlValue
                } else {
                    return '\n' + spaces + yamlKey + ': ' + yamlValue
                }
            }).join('').trim()
        }
        
        return String(obj)
    }

    // Simple YAML to JSON parser (basic implementation)
    const yamlToJson = (yaml: string): unknown => {
        const lines = yaml.split('\n')
        const result: Record<string, unknown> = {}
        const stack: unknown[] = [result]
        const indentStack: number[] = [0]
        let currentArray: unknown[] | undefined = undefined
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]
            const trimmed = line.trim()
            
            if (!trimmed || trimmed.startsWith('#')) continue
            
            const indent = line.length - line.trimStart().length
            
            // Handle array items
            if (trimmed.startsWith('- ')) {
                const value = trimmed.substring(2).trim()
                
                while (indentStack.length > 1 && indent <= indentStack[indentStack.length - 1]) {
                    stack.pop()
                    indentStack.pop()
                    currentArray = undefined
                }
                
                const parent = stack[stack.length - 1]
                if (!Array.isArray(parent)) {
                    currentArray = []
                    if (stack.length > 1) {
                        const parentObj = stack[stack.length - 2]
                        const lastKey = Object.keys(parentObj).pop()
                        if (lastKey) {
                            // Type assertion needed: parentObj is known to be a Record here
                            (parentObj as Record<string, unknown>)[lastKey] = currentArray
                            stack[stack.length - 1] = currentArray
                        }
                    }
                }
                
                if (value.includes(': ')) {
                    const obj = {}
                    // Type assertion needed: we know parent is an array here
                    ;(stack[stack.length - 1] as unknown[]).push(obj)
                    stack.push(obj)
                    indentStack.push(indent)
                    i--
                    continue
                } else {
                    // Type assertion needed: we know parent is an array here
                    (stack[stack.length - 1] as unknown[]).push(parseValue(value))
                }
                continue
            }
            
            // Handle key-value pairs
            const colonIndex = trimmed.indexOf(': ')
            if (colonIndex > 0) {
                const key = trimmed.substring(0, colonIndex).trim()
                const value = trimmed.substring(colonIndex + 2).trim()
                
                while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
                    stack.pop()
                    indentStack.pop()
                }
                
                const unquotedKey = key.startsWith('"') && key.endsWith('"') ? JSON.parse(key) : key
                
                if (!value) {
                    const obj = {}
                    // Type assertion needed: stack top is known to be a Record here
                    (stack[stack.length - 1] as Record<string, unknown>)[unquotedKey] = obj
                    stack.push(obj)
                    indentStack.push(indent)
                } else {
                    // Type assertion needed: stack top is known to be a Record here
                    (stack[stack.length - 1] as Record<string, unknown>)[unquotedKey] = parseValue(value)
                }
            }
        }
        
        return result
    }

    const parseValue = (value: string): unknown => {
        if (value === 'null') return undefined  // Convert null to undefined per guidelines
        if (value === 'true') return true
        if (value === 'false') return false
        if (value === '[]') return []
        if (value === '{}') return {}
        if (value.match(/^-?\d+$/)) return parseInt(value)
        if (value.match(/^-?\d*\.\d+$/)) return parseFloat(value)
        if (value.startsWith('"') && value.endsWith('"')) return JSON.parse(value)
        return value
    }

    const convert = useCallback(() => {
        try {
            setError('')
            
            if (!input.trim()) {
                setError('Please enter some data to convert')
                setOutput('')
                return
            }

            if (mode === 'json-to-yaml') {
                const parsed = JSON.parse(input)
                const yaml = jsonToYaml(parsed, 0)
                setOutput(yaml)
            } else {
                const parsed = yamlToJson(input)
                setOutput(JSON.stringify(parsed, null, 2))
            }
        } catch (err) {
            setError(mode === 'json-to-yaml' 
                ? 'Invalid JSON: ' + (err as Error).message
                : 'Invalid YAML: ' + (err as Error).message
            )
            setOutput('')
        }
    }, [input, mode, indentSize])

    const swapMode = () => {
        setMode(mode === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml')
        setInput(output)
        setOutput('')
        setError('')
    }

    const loadSampleData = () => {
        if (mode === 'json-to-yaml') {
            setInput(JSON.stringify({
                name: "MyDailyDevTools",
                version: "1.0.0",
                features: ["JSON Formatter", "YAML Converter", "Base64 Encoder"],
                config: {
                    theme: "light",
                    autoSave: true,
                    settings: {
                        indentSize: 2,
                        lineNumbers: true
                    }
                },
                active: true
            }, null, 2))
        } else {
            setInput(`name: MyDailyDevTools
version: 1.0.0
features:
  - JSON Formatter
  - YAML Converter
  - Base64 Encoder
config:
  theme: light
  autoSave: true
  settings:
    indentSize: 2
    lineNumbers: true
active: true`)
        }
    }

    const clearAll = () => {
        setInput('')
        setOutput('')
        setError('')
    }

    const copyToClipboard = () => {
        if (output) {
            navigator.clipboard.writeText(output).catch(err => {
                console.error('Failed to copy to clipboard:', err)
            })
        }
    }

    const downloadOutput = () => {
        if (!output) return
        
        const extension = mode === 'json-to-yaml' ? 'yaml' : 'json'
        const mimeType = mode === 'json-to-yaml' ? 'text/yaml' : 'application/json'
        
        const blob = new Blob([output], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `converted.${extension}`
        link.click()
        URL.revokeObjectURL(url)
    }

    // Auto-convert when input changes
    useEffect(() => {
        if (input.trim()) {
            convert()
        }
    }, [convert, input])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">JSON ↔ YAML Converter</h1>
          <p className="text-gray-600 mt-1">Convert between JSON and YAML formats with proper formatting</p>
        </div>

        {/* Mode and Settings */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Conversion Mode</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => setMode('json-to-yaml')}
                  variant={mode === 'json-to-yaml' ? 'primary' : 'secondary'}
                >
                  JSON → YAML
                </Button>
                <Button
                  onClick={() => setMode('yaml-to-json')}
                  variant={mode === 'yaml-to-json' ? 'primary' : 'secondary'}
                >
                  YAML → JSON
                </Button>
              </div>
              
              {mode === 'json-to-yaml' && (
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
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={swapMode} variant="secondary">↔ Swap & Convert</Button>
              <Button onClick={loadSampleData} variant="secondary">Load Sample</Button>
              <Button onClick={clearAll} variant="danger">Clear</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {mode === 'json-to-yaml' ? 'JSON Input' : 'YAML Input'}
              </h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder={mode === 'json-to-yaml' 
                  ? 'Paste your JSON here...' 
                  : 'Paste your YAML here...'}
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">
                {mode === 'json-to-yaml' ? 'YAML Output' : 'JSON Output'}
              </h2>
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
              
              <Textarea
                value={output}
                onChange={() => {}}
                placeholder={mode === 'json-to-yaml' 
                  ? 'YAML output will appear here...' 
                  : 'JSON output will appear here...'}
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
                <li>• <strong>Bidirectional conversion:</strong> JSON to YAML and YAML to JSON</li>
                <li>• <strong>Auto-conversion:</strong> Updates as you type</li>
                <li>• <strong>Proper formatting:</strong> Handles complex nested structures</li>
                <li>• <strong>String handling:</strong> Quotes strings when necessary</li>
                <li>• <strong>Array support:</strong> Properly formats arrays and lists</li>
                <li>• <strong>Download output:</strong> Save as .json or .yaml file</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Common Use Cases</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Configuration files:</strong> Convert between config formats</li>
                <li>• <strong>API responses:</strong> Convert JSON APIs to YAML</li>
                <li>• <strong>Docker/Kubernetes:</strong> Work with YAML configs</li>
                <li>• <strong>CI/CD pipelines:</strong> Convert pipeline configurations</li>
                <li>• <strong>Documentation:</strong> YAML is often more readable</li>
                <li>• <strong>Data migration:</strong> Move between different systems</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}