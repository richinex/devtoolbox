'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import QRCode from 'qrcode'

export default function QrGenerator() {
  const [input, setInput] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [error, setError] = useState('')

  const generateQRCode = async () => {
    if (!input.trim()) {
      setError('Please enter text or URL')
      setQrCodeUrl('')
      return
    }

    try {
      const url = await QRCode.toDataURL(input, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeUrl(url)
      setError('')
    } catch {
      setError('Error generating QR code')
      setQrCodeUrl('')
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrCodeUrl
    link.click()
  }

  const clearAll = () => {
    setInput('')
    setQrCodeUrl('')
    setError('')
  }

  useEffect(() => {
    if (input.trim()) {
      generateQRCode()
    } else {
      setQrCodeUrl('')
      setError('')
    }
  }, [input])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">QR Code Generator</h1>
          <p className="text-gray-600 mt-1">Create QR codes from text or URLs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Input</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Enter text or URL to generate QR code..."
                rows={6}
                className="font-mono text-sm"
              />
              <div className="flex gap-2 mt-4">
                <Button onClick={generateQRCode}>Generate QR Code</Button>
                <Button onClick={clearAll} variant="danger">Clear</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">QR Code</h2>
              {qrCodeUrl && (
                <Button onClick={downloadQRCode} size="sm" variant="secondary">
                  Download
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <div className="flex items-center justify-center min-h-[300px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="max-w-full h-auto"
                  />
                ) : (
                  <p className="text-gray-500 text-center">
                    QR code will appear here<br />
                    <span className="text-sm">Enter text above to generate</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">About QR Codes</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>QR (Quick Response) codes</strong> are matrix barcodes that can store various types of information.</p>
            <p><strong>Common use cases:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Website URLs for easy mobile access</li>
              <li>• Contact information (vCard format)</li>
              <li>• WiFi network credentials</li>
              <li>• Event tickets and boarding passes</li>
              <li>• Payment information</li>
              <li>• Product information and links</li>
            </ul>
            <p><strong>Tips:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Keep text short for better scanning reliability</li>
              <li>• Test QR codes before printing or sharing</li>
              <li>• Ensure adequate contrast and size for scanning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}