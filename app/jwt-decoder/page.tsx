'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'

interface JWTHeader {
  alg?: string
  typ?: string
  kid?: string
  [key: string]: unknown
}

interface JWTPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
  [key: string]: unknown
}

export default function JwtDecoder() {
  const [token, setToken] = useState('')
  const [secret, setSecret] = useState('')
  const [header, setHeader] = useState<JWTHeader | null>(null)
  const [payload, setPayload] = useState<JWTPayload | null>(null)
  const [signature, setSignature] = useState('')
  const [error, setError] = useState('')
  const [isExpired, setIsExpired] = useState(false)

  const base64UrlDecode = (str: string): string => {
    // Add padding if needed
    const padding = '='.repeat((4 - (str.length % 4)) % 4)
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + padding
    
    try {
      return decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    } catch {
      throw new Error('Invalid base64url encoding')
    }
  }

  const decodeJWT = useCallback(() => {
    if (!token.trim()) {
      setError('Please enter a JWT token')
      setHeader(null)
      setPayload(null)
      setSignature('')
      return
    }

    try {
      // Split the token
      const parts = token.trim().split('.')
      
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts separated by dots.')
      }

      // Decode header
      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]))
      setHeader(decodedHeader)

      // Decode payload
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]))
      setPayload(decodedPayload)

      // Set signature
      setSignature(parts[2])

      // Check expiration
      if (decodedPayload.exp) {
        const expDate = new Date(decodedPayload.exp * 1000)
        setIsExpired(expDate < new Date())
      } else {
        setIsExpired(false)
      }

      setError('')
    } catch (err) {
      setError(`Invalid JWT: ${(err as Error).message}`)
      setHeader(null)
      setPayload(null)
      setSignature('')
    }
  }, [token, secret])

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
  }

  const formatJSON = (obj: unknown): string => {
    return JSON.stringify(obj, null, 2)
  }

  const loadSampleJWT = () => {
    // This is a sample JWT (not a real one, for demonstration)
    setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNhbXBsZS1rZXktaWQifQ.eyJpc3MiOiJodHRwczovL215ZGFpbHlkZXZ0b29scy5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTcwOTIzMjAwMCwiZXhwIjo5OTk5OTk5OTk5LCJuYmYiOjE3MDkyMzIwMDAsImF1ZCI6WyJhcGkiLCJ3ZWIiXSwicm9sZXMiOlsidXNlciIsImFkbWluIl0sInBlcm1pc3Npb25zIjp7InJlYWQiOnRydWUsIndyaXRlIjp0cnVlLCJkZWxldGUiOmZhbHNlfX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  }

  const loadExpiredJWT = () => {
    // JWT with exp set to past date
    setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkV4cGlyZWQgVXNlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy:', err)
    })
  }

  const clearAll = () => {
    setToken('')
    setSecret('')
    setHeader(null)
    setPayload(null)
    setSignature('')
    setError('')
    setIsExpired(false)
  }

  // Auto-decode when token changes
  useEffect(() => {
    if (token.trim()) {
      const timer = setTimeout(() => {
        decodeJWT()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [token, decodeJWT])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">JWT Decoder</h1>
          <p className="text-gray-600 mt-1">Decode and inspect JSON Web Tokens</p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">JWT Token</h2>
          </CardHeader>
          <CardContent>
            <Textarea
              value={token}
              onChange={setToken}
              placeholder="Paste your JWT token here..."
              rows={4}
              className="font-mono text-sm mb-4"
            />
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={loadSampleJWT} variant="secondary">Load Sample JWT</Button>
              <Button onClick={loadExpiredJWT} variant="secondary">Load Expired JWT</Button>
              <Button onClick={clearAll} variant="danger">Clear</Button>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Decoded Output */}
        {(header || payload) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Header */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-red-600">Header</h3>
                {header && (
                  <Button 
                    onClick={() => copyToClipboard(formatJSON(header))} 
                    size="sm" 
                    variant="secondary"
                  >
                    Copy
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {header && (
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    {formatJSON(header)}
                  </pre>
                )}
              </CardContent>
            </Card>

            {/* Payload */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-purple-600">Payload</h3>
                {payload && (
                  <Button 
                    onClick={() => copyToClipboard(formatJSON(payload))} 
                    size="sm" 
                    variant="secondary"
                  >
                    Copy
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {payload && (
                  <>
                    {isExpired && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-3">
                        <p className="text-red-700 text-sm font-semibold">⚠️ Token is expired</p>
                      </div>
                    )}
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {formatJSON(payload)}
                    </pre>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Signature */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-blue-600">Signature</h3>
              </CardHeader>
              <CardContent>
                {signature && (
                  <div className="break-all font-mono text-xs bg-gray-100 p-3 rounded">
                    {signature}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Claims Information */}
        {payload && (
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Standard Claims</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payload.iss && (
                  <div>
                    <span className="font-semibold text-sm">Issuer (iss):</span>
                    <p className="text-sm text-gray-600">{payload.iss}</p>
                  </div>
                )}
                {payload.sub && (
                  <div>
                    <span className="font-semibold text-sm">Subject (sub):</span>
                    <p className="text-sm text-gray-600">{payload.sub}</p>
                  </div>
                )}
                {payload.aud && (
                  <div>
                    <span className="font-semibold text-sm">Audience (aud):</span>
                    <p className="text-sm text-gray-600">
                      {Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud}
                    </p>
                  </div>
                )}
                {payload.exp && (
                  <div>
                    <span className="font-semibold text-sm">Expiration (exp):</span>
                    <p className="text-sm text-gray-600">
                      {formatDate(payload.exp)}
                      {isExpired && <span className="text-red-600 ml-2">(Expired)</span>}
                    </p>
                  </div>
                )}
                {payload.nbf && (
                  <div>
                    <span className="font-semibold text-sm">Not Before (nbf):</span>
                    <p className="text-sm text-gray-600">{formatDate(payload.nbf)}</p>
                  </div>
                )}
                {payload.iat && (
                  <div>
                    <span className="font-semibold text-sm">Issued At (iat):</span>
                    <p className="text-sm text-gray-600">{formatDate(payload.iat)}</p>
                  </div>
                )}
                {payload.jti && (
                  <div>
                    <span className="font-semibold text-sm">JWT ID (jti):</span>
                    <p className="text-sm text-gray-600">{payload.jti}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">About JWT</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Structure:</strong> Header.Payload.Signature</li>
                <li>• <strong>Encoding:</strong> Base64Url encoded JSON</li>
                <li>• <strong>Header:</strong> Contains algorithm and token type</li>
                <li>• <strong>Payload:</strong> Contains claims (user data)</li>
                <li>• <strong>Signature:</strong> Ensures token integrity</li>
                <li>• <strong>Security:</strong> Never share tokens publicly</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Standard Claims</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>iss:</strong> Issuer of the token</li>
                <li>• <strong>sub:</strong> Subject (user ID)</li>
                <li>• <strong>aud:</strong> Intended audience</li>
                <li>• <strong>exp:</strong> Expiration time</li>
                <li>• <strong>nbf:</strong> Not valid before</li>
                <li>• <strong>iat:</strong> Issued at time</li>
                <li>• <strong>jti:</strong> Unique token ID</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}