'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import Papa from 'papaparse'

export default function CsvJsonConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json')
  const [error, setError] = useState('')
  const [hasHeader, setHasHeader] = useState(true)
  const [delimiter, setDelimiter] = useState(',')
  const [skipEmptyLines, setSkipEmptyLines] = useState(true)
  const [outputFormat, setOutputFormat] = useState<'array' | 'object'>('array')

  const convert = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some data to convert')
      setOutput('')
      return
    }

    try {
      setError('')
      
      if (mode === 'csv-to-json') {
        // Parse CSV
        const result = Papa.parse(input, {
          delimiter: delimiter === 'auto' ? undefined : delimiter,
          header: hasHeader && outputFormat === 'object',
          skipEmptyLines: skipEmptyLines,
          dynamicTyping: true,
          transformHeader: (header) => header.trim()
        })

        if (result.errors.length > 0) {
          const errorMessages = result.errors.map(e => e.message).join(', ')
          setError(`CSV parsing errors: ${errorMessages}`)
          return
        }

        let jsonData = result.data

        // If outputFormat is array and hasHeader is true, we need to format differently
        if (outputFormat === 'array' && hasHeader) {
          const headers = input.trim().split('\n')[0].split(delimiter).map(h => h.trim())
          const dataRows = input.trim().split('\n').slice(1)
          
          jsonData = dataRows
            .filter(row => skipEmptyLines ? row.trim() : true)
            .map(row => {
              const values = Papa.parse(row, { delimiter }).data[0] as string[]
              const obj: Record<string, unknown> = {}
              headers.forEach((header, index) => {
                obj[header] = values[index]
              })
              return obj
            })
        }

        setOutput(JSON.stringify(jsonData, null, 2))
      } else {
        // Convert JSON to CSV
        const jsonData = JSON.parse(input)
        
        if (!Array.isArray(jsonData)) {
          setError('JSON must be an array to convert to CSV')
          return
        }

        if (jsonData.length === 0) {
          setOutput('')
          return
        }

        // Convert to CSV
        const csv = Papa.unparse(jsonData, {
          delimiter,
          header: hasHeader,
          skipEmptyLines
        })

        setOutput(csv)
      }
    } catch (err) {
      setError(mode === 'csv-to-json' 
        ? `Invalid CSV: ${(err as Error).message}`
        : `Invalid JSON: ${(err as Error).message}`
      )
      setOutput('')
    }
  }, [input, mode, delimiter, hasHeader, skipEmptyLines, outputFormat])

  const swapMode = () => {
    setMode(mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json')
    setInput(output)
    setOutput('')
    setError('')
  }

  const loadCsvSample = () => {
    setMode('csv-to-json')
    setInput(`Name,Age,City,Country
John Doe,30,New York,USA
Jane Smith,25,London,UK
Bob Johnson,35,Toronto,Canada
Alice Brown,28,Sydney,Australia
Charlie Wilson,32,Berlin,Germany`)
  }

  const loadJsonSample = () => {
    setMode('json-to-csv')
    setInput(JSON.stringify([
      { Name: "John Doe", Age: 30, City: "New York", Country: "USA" },
      { Name: "Jane Smith", Age: 25, City: "London", Country: "UK" },
      { Name: "Bob Johnson", Age: 35, City: "Toronto", Country: "Canada" },
      { Name: "Alice Brown", Age: 28, City: "Sydney", Country: "Australia" }
    ], null, 2))
  }

  const loadComplexCsvSample = () => {
    setMode('csv-to-json')
    setInput(`Product,Price,Quantity,Description
"Laptop, Pro Model",1299.99,5,"High-end laptop with 16GB RAM, 512GB SSD"
"USB Cable",9.99,50,"USB-C to USB-A cable, 6ft"
"Mouse, Wireless",29.99,25,"Ergonomic wireless mouse with RGB"
"Keyboard ""Mechanical""",89.99,15,"Mechanical keyboard with blue switches"
"Monitor, 4K",399.99,8,"27-inch 4K monitor with HDR"`)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
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
    
    const extension = mode === 'csv-to-json' ? 'json' : 'csv'
    const mimeType = mode === 'csv-to-json' ? 'application/json' : 'text/csv'
    
    const blob = new Blob([output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `converted.${extension}`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Auto-convert when input or settings change
  useEffect(() => {
    if (input.trim()) {
      const timer = setTimeout(() => {
        convert()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [input, convert])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">CSV ↔ JSON Converter</h1>
          <p className="text-gray-600 mt-1">Convert between CSV and JSON formats with advanced options</p>
        </div>

        {/* Mode and Settings */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Conversion Settings</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mode buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setMode('csv-to-json')}
                  variant={mode === 'csv-to-json' ? 'primary' : 'secondary'}
                >
                  CSV → JSON
                </Button>
                <Button
                  onClick={() => setMode('json-to-csv')}
                  variant={mode === 'json-to-csv' ? 'primary' : 'secondary'}
                >
                  JSON → CSV
                </Button>
                <Button onClick={swapMode} variant="secondary">↔ Swap & Convert</Button>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium">Delimiter</label>
                  <select
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                    <option value="|">Pipe (|)</option>
                    <option value="auto">Auto-detect</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Headers</label>
                  <select
                    value={hasHeader ? 'yes' : 'no'}
                    onChange={(e) => setHasHeader(e.target.value === 'yes')}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="yes">First row is header</option>
                    <option value="no">No header row</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Empty lines</label>
                  <select
                    value={skipEmptyLines ? 'skip' : 'keep'}
                    onChange={(e) => setSkipEmptyLines(e.target.value === 'skip')}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="skip">Skip empty lines</option>
                    <option value="keep">Keep empty lines</option>
                  </select>
                </div>

                {mode === 'csv-to-json' && (
                  <div>
                    <label className="text-sm font-medium">Output format</label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as 'array' | 'object')}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="array">Array of objects</option>
                      <option value="object">Raw array</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Sample data buttons */}
              <div className="flex flex-wrap gap-2">
                <Button onClick={loadCsvSample} variant="secondary">Simple CSV Sample</Button>
                <Button onClick={loadComplexCsvSample} variant="secondary">Complex CSV Sample</Button>
                <Button onClick={loadJsonSample} variant="secondary">JSON Sample</Button>
                <Button onClick={clearAll} variant="danger">Clear</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}
              </h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder={mode === 'csv-to-json' 
                  ? 'Paste your CSV data here...\n\nExample:\nName,Age,City\nJohn,30,New York' 
                  : 'Paste your JSON array here...\n\nExample:\n[\n  {"Name": "John", "Age": 30}\n]'}
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">
                {mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}
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
                placeholder={mode === 'csv-to-json' 
                  ? 'JSON output will appear here...' 
                  : 'CSV output will appear here...'}
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
                <li>• <strong>Bidirectional conversion:</strong> CSV to JSON and JSON to CSV</li>
                <li>• <strong>Multiple delimiters:</strong> Comma, semicolon, tab, pipe, or auto-detect</li>
                <li>• <strong>Header support:</strong> Use first row as object keys</li>
                <li>• <strong>Handles complex data:</strong> Quoted fields, commas in values, line breaks</li>
                <li>• <strong>Type detection:</strong> Automatically converts numbers and booleans</li>
                <li>• <strong>Real-time conversion:</strong> Updates as you type</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">CSV Format Tips</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Quotes:</strong> Use double quotes for fields containing delimiters</li>
                <li>• <strong>Escape quotes:</strong> Use two double quotes {`""`} to represent one</li>
                <li>• <strong>Line breaks:</strong> Wrap fields with line breaks in quotes</li>
                <li>• <strong>Numbers:</strong> Unquoted numbers are auto-converted</li>
                <li>• <strong>Headers:</strong> First row typically contains column names</li>
                <li>• <strong>Consistency:</strong> Keep the same number of fields per row</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}