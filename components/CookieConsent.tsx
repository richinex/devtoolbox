'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [hasConsent, setHasConsent] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (consent === null) {
      setShowBanner(true)
    } else {
      setHasConsent(consent === 'true')
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true')
    setHasConsent(true)
    setShowBanner(false)
    
    // Enable Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      })
    }
    
    // Reload to initialize analytics
    window.location.reload()
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'false')
    setHasConsent(false)
    setShowBanner(false)
    
    // Disable Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      })
    }
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          <p>
            We use cookies to improve your experience and analyze site traffic. 
            By clicking "Accept", you consent to our use of cookies. 
            Read our{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="/cookie-policy" className="text-blue-600 hover:underline">
              Cookie Policy
            </a>
            .
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleReject} variant="secondary" size="sm">
            Reject
          </Button>
          <Button onClick={handleAccept} size="sm">
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}