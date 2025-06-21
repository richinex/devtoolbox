'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

interface DelimiterOption {
  label: string
  value: string
  description: string
}

const delimiterOptions: DelimiterOption[] = [
  { label: 'Comma (CSV)', value: ',', description: 'Standard CSV format' },
  { label: 'Tab (TSV)', value: '\t', description: 'Tab-separated values' },
  { label: 'Semicolon', value: ';', description: 'European CSV format' },
  { label: 'Pipe', value: '|', description: 'Pipe-separated values' },
  { label: 'Colon', value: ':', description: 'Colon-separated values' },
  { label: 'Space', value: ' ', description: 'Space-separated values' },
  { label: 'Custom', value: 'custom', description: 'Custom delimiter' },
]

export default function DelimiterConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [inputDelimiter, setInputDelimiter] = useState(',')
  const [outputDelimiter, setOutputDelimiter] = useState('\t')
  const [customInputDelimiter, setCustomInputDelimiter] = useState('')
  const [customOutputDelimiter, setCustomOutputDelimiter] = useState('')
  const [error, setError] = useState('')
  const [hasHeader, setHasHeader] = useState(true)
  const [preserveQuotes, setPreserveQuotes] = useState(true)

  const getActualDelimiter = (selected: string, custom: string): string => {
    return selected === 'custom' ? custom : selected
  }

  const parseCSV = (text: string, delimiter: string): string[][] => {
    if (!text.trim()) return []
    
    const rows: string[][] = []
    const lines = text.split('\n')
    
    for (const line of lines) {
      if (!line.trim()) continue
      
      const row: string[] = []
      let current = ''
      let inQuotes = false
      let i = 0
      
      while (i < line.length) {
        const char = line[i]
        
        if (char === '"' && preserveQuotes) {
          if (inQuotes && line[i + 1] === '"') {
            current += '"'
            i += 2
            continue
          }
          inQuotes = !inQuotes
          i++
          continue
        }
        
        if (!inQuotes && line.substring(i, i + delimiter.length) === delimiter) {
          row.push(current.trim())
          current = ''
          i += delimiter.length
          continue
        }
        
        current += char
        i++
      }
      
      row.push(current.trim())
      rows.push(row)
    }
    
    return rows
  }

  const formatCSV = (rows: string[][], delimiter: string): string => {
    return rows.map(row => {
      return row.map(cell => {
        const needsQuoting = preserveQuotes && (
          cell.includes(delimiter) || 
          cell.includes('"') || 
          cell.includes('\n') ||
          cell.includes('\r')
        )
        
        if (needsQuoting) {
          return `"${cell.replace(/"/g, '""')}"`
        }
        
        return cell
      }).join(delimiter)
    }).join('\n')
  }

  const convertDelimiters = useCallback(() => {
    try {
      setError('')
      
      if (!input.trim()) {
        setError('Please enter some data to convert')
        setOutput('')
        return
      }

      const actualInputDelimiter = getActualDelimiter(inputDelimiter, customInputDelimiter)
      const actualOutputDelimiter = getActualDelimiter(outputDelimiter, customOutputDelimiter)
      
      if (!actualInputDelimiter) {
        setError('Please specify an input delimiter')
        return
      }
      
      if (!actualOutputDelimiter) {
        setError('Please specify an output delimiter')
        return
      }

      const rows = parseCSV(input, actualInputDelimiter)
      
      if (rows.length === 0) {
        setError('No valid data found')
        setOutput('')
        return
      }

      const result = formatCSV(rows, actualOutputDelimiter)
      setOutput(result)
      
    } catch (err) {
      setError('Error processing data: ' + (err as Error).message)
      setOutput('')
    }
  }, [input, inputDelimiter, outputDelimiter, customInputDelimiter, customOutputDelimiter, preserveQuotes])

  const loadSampleData = () => {
    const sampleCSV = `Name,Age,City,Country
John Doe,30,New York,USA
Jane Smith,25,London,UK
"Johnson, Mike",35,"Los Angeles, CA",USA
Marie Dupont,28,Paris,France`
    setInput(sampleCSV)
    setInputDelimiter(',')
    setOutputDelimiter('\t')
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

  const swapDelimiters = () => {
    const tempInput = inputDelimiter
    const tempCustomInput = customInputDelimiter
    
    setInputDelimiter(outputDelimiter)
    setCustomInputDelimiter(customOutputDelimiter)
    setOutputDelimiter(tempInput)
    setCustomOutputDelimiter(tempCustomInput)
  }

  const downloadAsFile = () => {
    if (!output) return
    
    const actualOutputDelimiter = getActualDelimiter(outputDelimiter, customOutputDelimiter)
    let extension = 'txt'
    let mimeType = 'text/plain'
    
    if (actualOutputDelimiter === ',') {
      extension = 'csv'
      mimeType = 'text/csv'
    } else if (actualOutputDelimiter === '\t') {
      extension = 'tsv'
      mimeType = 'text/tab-separated-values'
    }
    
    const blob = new Blob([output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `converted_data.${extension}`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Auto-convert when settings change
  useEffect(() => {
    if (input.trim()) {
      convertDelimiters()
    }
  }, [convertDelimiters, input])

  const getStats = () => {
    if (!output) return null
    
    const lines = output.split('\n').filter(line => line.trim())
    const firstLine = lines[0]
    if (!firstLine) return null
    
    const actualOutputDelimiter = getActualDelimiter(outputDelimiter, customOutputDelimiter)
    const columns = parseCSV(firstLine, actualOutputDelimiter)[0]?.length || 0
    
    return {
      rows: hasHeader ? lines.length - 1 : lines.length,
      columns,
      totalCells: (hasHeader ? lines.length - 1 : lines.length) * columns
    }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Delimiter Converter</h1>
          <p className="text-gray-600 mt-1">Convert between CSV, TSV, pipe, and custom delimited formats</p>
        </div>

        {/* Settings Panel */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Conversion Settings</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Delimiter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Delimiter
                </label>
                <select
                  value={inputDelimiter}
                  onChange={(e) => setInputDelimiter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {delimiterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                {inputDelimiter === 'custom' && (
                  <input
                    type="text"
                    value={customInputDelimiter}
                    onChange={(e) => setCustomInputDelimiter(e.target.value)}
                    placeholder="Enter custom delimiter"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Output Delimiter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Delimiter
                </label>
                <select
                  value={outputDelimiter}
                  onChange={(e) => setOutputDelimiter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {delimiterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
                {outputDelimiter === 'custom' && (
                  <input
                    type="text"
                    value={customOutputDelimiter}
                    onChange={(e) => setCustomOutputDelimiter(e.target.value)}
                    placeholder="Enter custom delimiter"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>

            {/* Options */}
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasHeader}
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">First row is header</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preserveQuotes}
                  onChange={(e) => setPreserveQuotes(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Preserve/add quotes when needed</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={convertDelimiters}>Convert</Button>
              <Button onClick={swapDelimiters} variant="secondary">↔ Swap</Button>
              <Button onClick={loadSampleData} variant="secondary">Load Sample</Button>
              <Button onClick={clearAll} variant="danger">Clear</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Input Data</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Paste your delimited data here..."
                rows={12}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Converted Output</h2>
              <div className="flex gap-2">
                {output && (
                  <>
                    <Button onClick={downloadAsFile} size="sm" variant="secondary">
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
              
              {stats && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                  <p className="text-blue-700 text-sm">
                    <strong>Stats:</strong> {stats.rows} rows × {stats.columns} columns = {stats.totalCells} cells
                  </p>
                </div>
              )}
              
              <Textarea
                value={output}
                onChange={() => {}}
                placeholder="Converted data will appear here..."
                rows={12}
                className="font-mono text-sm"
                disabled
              />
            </CardContent>
          </Card>
        </div>

        {/* Information Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Common Use Cases</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>CSV to TSV:</strong> Convert Excel exports for database imports</li>
                <li>• <strong>Pipe to CSV:</strong> Process database exports for Excel</li>
                <li>• <strong>Custom delimiters:</strong> Handle legacy system formats</li>
                <li>• <strong>Data cleaning:</strong> Standardize delimiter formats</li>
                <li>• <strong>System integration:</strong> Convert between different APIs</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Features & Tips</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Auto-conversion:</strong> Updates output as you change settings</li>
                <li>• <strong>Quote handling:</strong> Properly handles quoted fields with delimiters</li>
                <li>• <strong>Custom delimiters:</strong> Support any character or string</li>
                <li>• <strong>File download:</strong> Save as CSV, TSV, or TXT</li>
                <li>• <strong>Privacy first:</strong> All processing happens in your browser</li>
                <li>• <strong>Large files:</strong> Handles thousands of rows efficiently</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}