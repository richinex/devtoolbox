'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import CryptoJS from 'crypto-js'

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [md5Hash, setMd5Hash] = useState('')
  const [sha256Hash, setSha256Hash] = useState('')
  const [sha512Hash, setSha512Hash] = useState('')

  const generateHashes = () => {
    if (!input) {
      setMd5Hash('')
      setSha256Hash('')
      setSha512Hash('')
      return
    }

    setMd5Hash(CryptoJS.MD5(input).toString())
    setSha256Hash(CryptoJS.SHA256(input).toString())
    setSha512Hash(CryptoJS.SHA512(input).toString())
  }

  const clearAll = () => {
    setInput('')
    setMd5Hash('')
    setSha256Hash('')
    setSha512Hash('')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Hash Generator</h1>
          <p className="text-gray-600 mt-1">Generate MD5, SHA-256, and SHA-512 hashes</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Input Text</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Enter text to generate hashes..."
                rows={4}
                className="font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={generateHashes}>Generate Hashes</Button>
                <Button onClick={clearAll} variant="danger">Clear</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">MD5</h3>
                {md5Hash && (
                  <Button onClick={() => copyToClipboard(md5Hash)} size="sm" variant="secondary">
                    Copy
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Input
                  value={md5Hash}
                  onChange={() => {}}
                  placeholder="MD5 hash will appear here..."
                  className="font-mono text-sm"
                  disabled
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">SHA-256</h3>
                {sha256Hash && (
                  <Button onClick={() => copyToClipboard(sha256Hash)} size="sm" variant="secondary">
                    Copy
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Input
                  value={sha256Hash}
                  onChange={() => {}}
                  placeholder="SHA-256 hash will appear here..."
                  className="font-mono text-sm"
                  disabled
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold">SHA-512</h3>
                {sha512Hash && (
                  <Button onClick={() => copyToClipboard(sha512Hash)} size="sm" variant="secondary">
                    Copy
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Textarea
                  value={sha512Hash}
                  onChange={() => {}}
                  placeholder="SHA-512 hash will appear here..."
                  rows={3}
                  className="font-mono text-sm"
                  disabled
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">About Hash Functions</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>Hash functions</strong> convert input data into fixed-length strings. They are one-way functions - you cannot reverse them to get the original input.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p><strong>MD5 (128-bit)</strong></p>
                <p>Fast but cryptographically broken. Use only for checksums, not security.</p>
              </div>
              <div>
                <p><strong>SHA-256 (256-bit)</strong></p>
                <p>Secure and widely used. Part of the SHA-2 family. Good for most applications.</p>
              </div>
              <div>
                <p><strong>SHA-512 (512-bit)</strong></p>
                <p>Most secure option. Longer hash provides higher security but uses more space.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}