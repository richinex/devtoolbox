'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState('12')
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    let charset = ''
    if (includeUppercase) charset += uppercase
    if (includeLowercase) charset += lowercase
    if (includeNumbers) charset += numbers
    if (includeSymbols) charset += symbols

    if (!charset) {
      setPassword('Please select at least one character type')
      return
    }

    let generatedPassword = ''
    const passwordLength = parseInt(length)

    for (let i = 0; i < passwordLength; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }

    setPassword(generatedPassword)
  }

  const copyToClipboard = () => {
    if (password && password !== 'Please select at least one character type') {
      navigator.clipboard.writeText(password)
    }
  }

  const getPasswordStrength = () => {
    if (!password || password === 'Please select at least one character type') return ''
    
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score < 3) return { text: 'Weak', color: 'text-red-600' }
    if (score < 5) return { text: 'Medium', color: 'text-yellow-600' }
    return { text: 'Strong', color: 'text-green-600' }
  }

  const strength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Password Generator</h1>
          <p className="text-gray-600 mt-1">Generate secure passwords with custom criteria</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Password Settings</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Length: {length}
                </label>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>4</span>
                  <span>50</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include Uppercase Letters (A-Z)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include Lowercase Letters (a-z)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include Numbers (0-9)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include Symbols (!@#$%^&*)</span>
                </label>
              </div>

              <Button onClick={generatePassword} className="w-full">
                Generate Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Generated Password</h2>
              {password && password !== 'Please select at least one character type' && (
                <Button onClick={copyToClipboard} size="sm" variant="secondary">
                  Copy
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Input
                value={password}
                onChange={() => {}}
                placeholder="Click 'Generate Password' to create a secure password"
                className="font-mono text-lg"
                disabled
              />
              {strength && (
                <div className="mt-3">
                  <span className="text-sm text-gray-600">Strength: </span>
                  <span className={`text-sm font-medium ${strength.color}`}>
                    {strength.text}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">Password Security Tips</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <ul className="space-y-1">
              <li>• Use at least 12 characters for better security</li>
              <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
              <li>• Never reuse passwords across different accounts</li>
              <li>• Consider using a password manager to store unique passwords</li>
              <li>• Enable two-factor authentication when available</li>
              <li>• This tool generates passwords locally - nothing is sent to servers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}