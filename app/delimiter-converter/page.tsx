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
  { label: 'Newline', value: '\n', description: 'One value per line (Excel column)' },
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
  const [detectedDelimiter, setDetectedDelimiter] = useState<string | null>(null)
  const [autoDetect, setAutoDetect] = useState(true)

  const getActualDelimiter = (selected: string, custom: string): string => {
    return selected === 'custom' ? custom : selected
  }

  const detectDelimiter = (text: string): string => {
    // First check if it's newline-separated (single column from Excel)
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length > 1) {
      // Check if all lines have no common delimiters
      const hasNoDelimiters = lines.every(line => {
        return !line.includes('\t') && !line.includes(',') && !line.includes(';') && !line.includes('|')
      })
      if (hasNoDelimiters) {
        return '\n'
      }
    }
    
    // Common delimiters to check
    const delimitersToCheck = [
      { delimiter: '\t', name: 'Tab' },
      { delimiter: ',', name: 'Comma' },
      { delimiter: ';', name: 'Semicolon' },
      { delimiter: '|', name: 'Pipe' },
      { delimiter: ':', name: 'Colon' },
    ]
    
    // Get first few lines for analysis
    const sampleLines = lines.slice(0, 10)
    if (sampleLines.length === 0) return ','
    
    // Count occurrences of each delimiter
    const delimiterCounts: Record<string, number[]> = {}
    
    for (const { delimiter } of delimitersToCheck) {
      delimiterCounts[delimiter] = sampleLines.map(line => {
        // Count delimiter occurrences, but ignore those within quotes
        let count = 0
        let inQuotes = false
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '"') {
            inQuotes = !inQuotes
          } else if (!inQuotes && line.substring(i, i + delimiter.length) === delimiter) {
            count++
          }
        }
        return count
      })
    }
    
    // Find delimiter with most consistent count across lines
    let bestDelimiter = ','
    let bestScore = -1
    
    for (const { delimiter } of delimitersToCheck) {
      const counts = delimiterCounts[delimiter]
      if (counts.length === 0 || counts[0] === 0) continue
      
      // Check if counts are consistent across lines
      const firstCount = counts[0]
      const isConsistent = counts.every(count => count === firstCount)
      const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length
      
      // Score based on consistency and average count
      const score = isConsistent ? avgCount * 2 : avgCount
      
      if (score > bestScore) {
        bestScore = score
        bestDelimiter = delimiter
      }
    }
    
    // Special check for Excel paste (tab-delimited)
    if (bestDelimiter === '\t' && sampleLines.every(line => line.includes('\t'))) {
      return '\t'
    }
    
    return bestDelimiter
  }

  const parseCSV = (text: string, delimiter: string): string[][] => {
    if (!text.trim()) return []
    
    // Special handling for newline delimiter (single column data)
    if (delimiter === '\n') {
      return text.split('\n')
        .filter(line => line.trim())
        .map(line => [line.trim()])
    }
    
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
    // Tab-separated data (like Excel paste)
    const sampleTSV = `Name	Age	City	Country
John Doe	30	New York	USA
Jane Smith	25	London	UK
Johnson, Mike	35	Los Angeles, CA	USA
Marie Dupont	28	Paris	France`
    setInput(sampleTSV)
    if (autoDetect) {
      const detected = detectDelimiter(sampleTSV)
      setDetectedDelimiter(detected)
      setInputDelimiter(detected)
    }
    setOutputDelimiter(';')
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
                  checked={autoDetect}
                  onChange={(e) => setAutoDetect(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Auto-detect input delimiter</span>
              </label>
              
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
                onChange={(value) => {
                  setInput(value)
                  if (autoDetect && value.trim()) {
                    const detected = detectDelimiter(value)
                    setDetectedDelimiter(detected)
                    setInputDelimiter(detected)
                  }
                }}
                placeholder="Paste your delimited data here (Excel, CSV, TSV, etc.)..."
                rows={12}
                className="font-mono text-sm"
              />
              {detectedDelimiter && autoDetect && (
                <p className="text-sm text-green-600 mt-2">
                  Auto-detected delimiter: {
                    detectedDelimiter === '\t' ? 'Tab' : 
                    detectedDelimiter === ' ' ? 'Space' : 
                    detectedDelimiter === '\n' ? 'Newline (Excel column)' :
                    `"${detectedDelimiter}"`
                  }
                </p>
              )}
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
                <li>• <strong>Excel paste:</strong> Auto-detects tab delimiters from Excel copy/paste</li>
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
                <li>• <strong>Auto-detection:</strong> Automatically detects delimiter when you paste</li>
                <li>• <strong>Auto-conversion:</strong> Updates output as you change settings</li>
                <li>• <strong>Quote handling:</strong> Properly handles quoted fields with delimiters</li>
                <li>• <strong>Custom delimiters:</strong> Support any character or string</li>
                <li>• <strong>File download:</strong> Save as CSV, TSV, or TXT</li>
                <li>• <strong>Privacy first:</strong> All processing happens in your browser</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}