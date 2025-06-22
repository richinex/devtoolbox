'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

export default function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    error?: string
    line?: number
    column?: number
  } | null>(null)

  const formatXml = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some XML to format')
      setOutput('')
      setValidationResult(null)
      return
    }

    try {
      // First validate
      const validation = XMLValidator.validate(input, {
        allowBooleanAttributes: true
      })

      if (validation === true) {
        setValidationResult({ valid: true })
        
        // Parse XML
        const parser = new XMLParser({
          ignoreAttributes: false,
          ignoreDeclaration: false,
          commentPropName: "#comment",
          preserveOrder: true,
          processEntities: true,
          trimValues: false,
          parseAttributeValue: false,
          parseTagValue: false,
          allowBooleanAttributes: true
        })

        const parsed = parser.parse(input)

        // Build formatted XML
        const builder = new XMLBuilder({
          ignoreAttributes: false,
          format: true,
          indentBy: ' '.repeat(indentSize),
          suppressEmptyNode: false,
          commentPropName: "#comment",
          preserveOrder: true,
          processEntities: true,
          suppressBooleanAttributes: false
        })

        const formatted = builder.build(parsed)
        setOutput(formatted)
        setError('')
      } else {
        // Validation failed
        setValidationResult({
          valid: false,
          error: validation.err?.msg || 'Invalid XML',
          line: validation.err?.line,
          column: validation.err?.col
        })
        setError(`Invalid XML at line ${validation.err?.line || 'unknown'}, column ${validation.err?.col || 'unknown'}: ${validation.err?.msg || 'Unknown error'}`)
        setOutput('')
      }
    } catch (err) {
      setError(`Error formatting XML: ${(err as Error).message}`)
      setOutput('')
      setValidationResult({
        valid: false,
        error: (err as Error).message
      })
    }
  }, [input, indentSize])

  const minifyXml = () => {
    if (!input.trim()) {
      setError('Please enter some XML to minify')
      return
    }

    try {
      const validation = XMLValidator.validate(input, {
        allowBooleanAttributes: true
      })

      if (validation === true) {
        const parser = new XMLParser({
          ignoreAttributes: false,
          ignoreDeclaration: false,
          preserveOrder: true,
          allowBooleanAttributes: true
        })

        const parsed = parser.parse(input)

        const builder = new XMLBuilder({
          ignoreAttributes: false,
          format: false,
          preserveOrder: true,
          suppressEmptyNode: false,
          suppressBooleanAttributes: false
        })

        const minified = builder.build(parsed)
        setOutput(minified)
        setError('')
      } else {
        setError(`Cannot minify invalid XML`)
      }
    } catch (err) {
      setError(`Error minifying XML: ${(err as Error).message}`)
    }
  }

  const loadSampleXml = () => {
    setInput(`<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <!-- Popular books collection -->
  <book category="programming" id="1">
    <title lang="en">Clean Code</title>
    <author>Robert C. Martin</author>
    <year>2008</year>
    <price currency="USD">42.99</price>
    <available>true</available>
  </book>
  <book category="web" id="2">
    <title lang="en">Learning XML</title>
    <author>Erik T. Ray</author>
    <year>2003</year>
    <price currency="USD">39.95</price>
    <tags>
      <tag>XML</tag>
      <tag>Web Development</tag>
      <tag>Markup</tag>
    </tags>
  </book>
  <special-offers>
    <offer valid-until="2024-12-31">
      <discount>20%</discount>
      <code>SAVE20</code>
    </offer>
  </special-offers>
</bookstore>`)
  }

  const loadBrokenXml = () => {
    setInput(`<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="programming">
    <title>Clean Code</title>
    <author>Robert C. Martin
    <year>2008</year>
  </book>
  <book category="web">
    <title>Learning XML</title>
    <author>Erik T. Ray</author>
    <year>2003</year>
  <!-- Missing closing tag for bookstore`)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
    setValidationResult(null)
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
    
    const blob = new Blob([output], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formatted.xml'
    link.click()
    URL.revokeObjectURL(url)
  }

  const validateOnly = () => {
    if (!input.trim()) {
      setError('Please enter some XML to validate')
      return
    }

    const validation = XMLValidator.validate(input, {
      allowBooleanAttributes: true
    })

    if (validation === true) {
      setValidationResult({ valid: true })
      setError('')
      setOutput('✅ Valid XML!')
    } else {
      setValidationResult({
        valid: false,
        error: validation.err?.msg || 'Invalid XML',
        line: validation.err?.line,
        column: validation.err?.col
      })
      setError(`Invalid XML at line ${validation.err?.line || 'unknown'}, column ${validation.err?.col || 'unknown'}: ${validation.err?.msg || 'Unknown error'}`)
      setOutput('')
    }
  }

  // Auto-format when input or settings change
  useEffect(() => {
    if (input.trim()) {
      const timer = setTimeout(() => {
        formatXml()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [input, formatXml])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">XML Formatter & Validator</h1>
          <p className="text-gray-600 mt-1">Format, validate, and minify XML documents</p>
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
                  <option value="0">Tabs</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={validateOnly} variant="primary">Validate Only</Button>
              <Button onClick={minifyXml} variant="secondary">Minify</Button>
              <Button onClick={loadSampleXml} variant="secondary">Load Valid Sample</Button>
              <Button onClick={loadBrokenXml} variant="secondary">Load Broken Sample</Button>
              <Button onClick={clearAll} variant="danger">Clear</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">XML Input</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Paste your XML here..."
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
              {validationResult && (
                <div className={`${validationResult.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-md p-3 mb-4`}>
                  {validationResult.valid ? (
                    <p className="text-green-700 text-sm font-semibold">✅ Valid XML</p>
                  ) : (
                    <div className="text-red-700 text-sm">
                      <p className="font-semibold">❌ Invalid XML</p>
                      {validationResult.line && (
                        <p>Line {validationResult.line}, Column {validationResult.column}</p>
                      )}
                      <p>{validationResult.error}</p>
                    </div>
                  )}
                </div>
              )}

              {error && !validationResult && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <Textarea
                value={output}
                onChange={() => {}}
                placeholder="Formatted XML will appear here..."
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
                <li>• <strong>Validation:</strong> Check XML syntax with detailed error messages</li>
                <li>• <strong>Formatting:</strong> Beautify XML with consistent indentation</li>
                <li>• <strong>Minification:</strong> Remove unnecessary whitespace</li>
                <li>• <strong>Error location:</strong> Shows exact line and column of errors</li>
                <li>• <strong>Preserves structure:</strong> Maintains comments and attributes</li>
                <li>• <strong>Real-time validation:</strong> Updates as you type</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">XML Rules</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Well-formed:</strong> All tags must be properly closed</li>
                <li>• <strong>Case sensitive:</strong> {`<Tag>` }and {`<tag>`} are different</li>
                <li>• <strong>Single root:</strong> Must have one root element</li>
                <li>• <strong>Attributes:</strong> Must be quoted (single or double)</li>
                <li>• <strong>Special chars:</strong> Use entities like &amp;lt; &amp;gt; &amp;amp;</li>
                <li>• <strong>Comments:</strong> {`<!-- comment -->`} format</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}