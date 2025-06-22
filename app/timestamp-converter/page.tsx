'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('')
  const [dateString, setDateString] = useState('')
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [timestampUnit, setTimestampUnit] = useState<'seconds' | 'milliseconds'>('seconds')
  const [dateFormat] = useState('local')
  
  // Conversion results
  const [timestampToDate, setTimestampToDate] = useState<{
    local: string
    utc: string
    iso: string
    relative: string
  } | null>(null)
  
  const [dateToTimestamp, setDateToTimestamp] = useState<{
    seconds: number
    milliseconds: number
  } | null>(null)
  
  const [error, setError] = useState('')

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const convertTimestampToDate = useCallback(() => {
    if (!timestamp.trim()) {
      setTimestampToDate(null)
      setError('')
      return
    }

    try {
      const ts = parseInt(timestamp.trim())
      if (isNaN(ts)) {
        throw new Error('Invalid timestamp')
      }

      // Convert to milliseconds if needed
      const msTimestamp = timestampUnit === 'seconds' ? ts * 1000 : ts
      
      // Validate reasonable date range (1970 - 2100)
      if (msTimestamp < 0 || msTimestamp > 4102444800000) {
        throw new Error('Timestamp out of reasonable range')
      }

      const date = new Date(msTimestamp)
      
      // Check for invalid date
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date')
      }

      // Calculate relative time
      const now = Date.now()
      const diff = now - msTimestamp
      const seconds = Math.floor(Math.abs(diff) / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const years = Math.floor(days / 365)

      let relative = ''
      if (diff > 0) {
        if (years > 0) relative = `${years} year${years > 1 ? 's' : ''} ago`
        else if (days > 0) relative = `${days} day${days > 1 ? 's' : ''} ago`
        else if (hours > 0) relative = `${hours} hour${hours > 1 ? 's' : ''} ago`
        else if (minutes > 0) relative = `${minutes} minute${minutes > 1 ? 's' : ''} ago`
        else relative = `${seconds} second${seconds > 1 ? 's' : ''} ago`
      } else {
        if (years > 0) relative = `in ${years} year${years > 1 ? 's' : ''}`
        else if (days > 0) relative = `in ${days} day${days > 1 ? 's' : ''}`
        else if (hours > 0) relative = `in ${hours} hour${hours > 1 ? 's' : ''}`
        else if (minutes > 0) relative = `in ${minutes} minute${minutes > 1 ? 's' : ''}`
        else relative = `in ${seconds} second${seconds > 1 ? 's' : ''}`
      }

      setTimestampToDate({
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        iso: date.toISOString(),
        relative
      })
      setError('')
    } catch (err) {
      setError(`Error: ${(err as Error).message}`)
      setTimestampToDate(null)
    }
  }, [timestamp, timestampUnit])

  const convertDateToTimestamp = useCallback(() => {
    if (!dateString.trim()) {
      setDateToTimestamp(null)
      setError('')
      return
    }

    try {
      const date = new Date(dateString.trim())
      
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format')
      }

      const ms = date.getTime()
      setDateToTimestamp({
        seconds: Math.floor(ms / 1000),
        milliseconds: ms
      })
      setError('')
    } catch (err) {
      setError(`Error: ${(err as Error).message}`)
      setDateToTimestamp(null)
    }
  }, [dateString])

  const setCurrentTimestamp = () => {
    const now = Date.now()
    const value = timestampUnit === 'seconds' ? Math.floor(now / 1000) : now
    setTimestamp(value.toString())
  }

  const setCurrentDate = () => {
    const now = new Date()
    if (dateFormat === 'iso') {
      setDateString(now.toISOString())
    } else {
      // Format as YYYY-MM-DD HH:MM:SS
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setDateString(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
    }
  }

  const loadExamples = () => {
    // Set some example values
    setTimestamp('1640995200') // 2022-01-01 00:00:00 UTC
    setDateString('2022-01-01 00:00:00')
  }

  const clearAll = () => {
    setTimestamp('')
    setDateString('')
    setTimestampToDate(null)
    setDateToTimestamp(null)
    setError('')
  }

  // Auto-convert when inputs change
  useEffect(() => {
    if (timestamp.trim()) {
      convertTimestampToDate()
    }
  }, [timestamp, timestampUnit, convertTimestampToDate])

  useEffect(() => {
    if (dateString.trim()) {
      convertDateToTimestamp()
    }
  }, [dateString, convertDateToTimestamp])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy:', err)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Unix Timestamp Converter</h1>
          <p className="text-gray-600 mt-1">Convert between Unix timestamps and human-readable dates</p>
        </div>

        {/* Current Time Display */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Current Time</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Unix Timestamp (seconds)</p>
                <p className="font-mono text-lg">{Math.floor(currentTime / 1000)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unix Timestamp (milliseconds)</p>
                <p className="font-mono text-lg">{currentTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Local Time</p>
                <p className="font-mono text-lg">{new Date(currentTime).toLocaleTimeString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">UTC Time</p>
                <p className="font-mono text-lg">{new Date(currentTime).toISOString().split('T')[1].split('.')[0]}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Timestamp to Date */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Timestamp → Date</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Unix Timestamp</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={timestamp}
                      onChange={setTimestamp}
                      placeholder="e.g., 1640995200"
                      className="flex-1"
                    />
                    <Button onClick={setCurrentTimestamp} variant="secondary">
                      Now
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Unit</label>
                  <select
                    value={timestampUnit}
                    onChange={(e) => setTimestampUnit(e.target.value as 'seconds' | 'milliseconds')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="seconds">Seconds</option>
                    <option value="milliseconds">Milliseconds</option>
                  </select>
                </div>

                {timestampToDate && (
                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Local Time</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono">{timestampToDate.local}</p>
                        <Button 
                          onClick={() => copyToClipboard(timestampToDate.local)} 
                          size="sm" 
                          variant="secondary"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">UTC Time</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-sm">{timestampToDate.utc}</p>
                        <Button 
                          onClick={() => copyToClipboard(timestampToDate.utc)} 
                          size="sm" 
                          variant="secondary"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ISO 8601</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-sm">{timestampToDate.iso}</p>
                        <Button 
                          onClick={() => copyToClipboard(timestampToDate.iso)} 
                          size="sm" 
                          variant="secondary"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Relative Time</p>
                      <p className="font-semibold">{timestampToDate.relative}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Date to Timestamp */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Date → Timestamp</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Date & Time</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={dateString}
                      onChange={setDateString}
                      placeholder="e.g., 2022-01-01 00:00:00 or ISO format"
                      className="flex-1"
                    />
                    <Button onClick={setCurrentDate} variant="secondary">
                      Now
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepts various formats: YYYY-MM-DD, ISO 8601, or locale strings
                  </p>
                </div>

                {dateToTimestamp && (
                  <div className="space-y-3 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Unix Timestamp (seconds)</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-lg">{dateToTimestamp.seconds}</p>
                        <Button 
                          onClick={() => copyToClipboard(dateToTimestamp.seconds.toString())} 
                          size="sm" 
                          variant="secondary"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unix Timestamp (milliseconds)</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-lg">{dateToTimestamp.milliseconds}</p>
                        <Button 
                          onClick={() => copyToClipboard(dateToTimestamp.milliseconds.toString())} 
                          size="sm" 
                          variant="secondary"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200">
            <CardContent className="py-4">
              <p className="text-red-700 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={loadExamples} variant="secondary">Load Examples</Button>
          <Button onClick={clearAll} variant="danger">Clear All</Button>
        </div>

        {/* Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">About Unix Timestamps</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Epoch:</strong> January 1, 1970 00:00:00 UTC</li>
                <li>• <strong>Seconds:</strong> Standard Unix time (10 digits)</li>
                <li>• <strong>Milliseconds:</strong> JavaScript/Java time (13 digits)</li>
                <li>• <strong>Range:</strong> Can represent dates from 1970 to 2038 (32-bit)</li>
                <li>• <strong>Timezone:</strong> Always UTC, converted to local for display</li>
                <li>• <strong>Precision:</strong> Seconds or milliseconds depending on system</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Common Timestamp Values</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>0:</strong> Unix Epoch (Jan 1, 1970)</li>
                <li>• <strong>86400:</strong> One day (in seconds)</li>
                <li>• <strong>604800:</strong> One week (in seconds)</li>
                <li>• <strong>2147483647:</strong> Max 32-bit timestamp (Jan 19, 2038)</li>
                <li>• <strong>1000000000:</strong> Sep 9, 2001 (Unix billennium)</li>
                <li>• <strong>1234567890:</strong> Feb 13, 2009 (Timestamp Day)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}