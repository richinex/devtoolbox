'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

interface DiffLine {
  type: 'add' | 'remove' | 'normal'
  content: string
  lineNumber1?: number
  lineNumber2?: number
}

export default function TextDiff() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')

  const diff = useMemo(() => {
    if (!text1 && !text2) return []

    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    const result: DiffLine[] = []

    const maxLines = Math.max(lines1.length, lines2.length)
    let lineNumber1 = 1
    let lineNumber2 = 1

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || ''
      const line2 = lines2[i] || ''

      if (line1 === line2) {
        result.push({
          type: 'normal',
          content: line1,
          lineNumber1: lineNumber1++,
          lineNumber2: lineNumber2++
        })
      } else {
        if (line1 && i < lines1.length) {
          result.push({
            type: 'remove',
            content: line1,
            lineNumber1: lineNumber1++
          })
        }
        if (line2 && i < lines2.length) {
          result.push({
            type: 'add',
            content: line2,
            lineNumber2: lineNumber2++
          })
        }
      }
    }

    return result
  }, [text1, text2])

  const clearAll = () => {
    setText1('')
    setText2('')
  }

  const stats = useMemo(() => {
    const added = diff.filter(line => line.type === 'add').length
    const removed = diff.filter(line => line.type === 'remove').length
    const unchanged = diff.filter(line => line.type === 'normal').length
    return { added, removed, unchanged }
  }, [diff])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Text Diff Checker</h1>
          <p className="text-gray-600 mt-1">Compare text differences side-by-side</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Original Text</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text1}
                onChange={setText1}
                placeholder="Paste your original text here..."
                rows={12}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Modified Text</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={text2}
                onChange={setText2}
                placeholder="Paste your modified text here..."
                rows={12}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 text-sm">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-200 rounded mr-1"></span>
              Added: {stats.added}
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-red-200 rounded mr-1"></span>
              Removed: {stats.removed}
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-gray-200 rounded mr-1"></span>
              Unchanged: {stats.unchanged}
            </span>
          </div>
          <Button onClick={clearAll} variant="danger" size="sm">
            Clear
          </Button>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Comparison Result</h2>
          </CardHeader>
          <CardContent>
            {diff.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Enter text in both fields to see the differences
              </p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {diff.map((line, index) => (
                    <div
                      key={index}
                      className={`flex font-mono text-sm border-b border-gray-100 ${
                        line.type === 'add' 
                          ? 'bg-green-50 border-l-4 border-l-green-400'
                          : line.type === 'remove'
                          ? 'bg-red-50 border-l-4 border-l-red-400'
                          : 'bg-white'
                      }`}
                    >
                      <div className="flex-shrink-0 w-16 px-2 py-1 text-xs text-gray-500 border-r border-gray-200">
                        {line.type === 'add' && '+'}
                        {line.type === 'remove' && '-'}
                        {line.lineNumber1 || line.lineNumber2 || ''}
                      </div>
                      <div className="flex-1 px-3 py-1 whitespace-pre-wrap break-all">
                        {line.content || '\u00A0'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">How to Use Text Diff</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Text Diff</strong> helps you identify changes between two versions of text.</p>
            <p><strong>Color coding:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• <span className="bg-green-200 px-1 rounded">Green</span> - Added lines</li>
              <li>• <span className="bg-red-200 px-1 rounded">Red</span> - Removed lines</li>
              <li>• White - Unchanged lines</li>
            </ul>
            <p><strong>Common use cases:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Comparing document versions</li>
              <li>• Code review and change tracking</li>
              <li>• Identifying content modifications</li>
              <li>• Proofreading and editing assistance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}