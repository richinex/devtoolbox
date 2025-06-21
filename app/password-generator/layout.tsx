import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Password Generator - Secure Random Password Creator | DevToolbox',
  description: 'Generate strong, secure passwords online. Customize length, character sets, and complexity. Create random passwords for accounts, WiFi, and applications. Free and secure.',
  keywords: 'password generator, secure password, random password, strong password generator, password creator, generate password online',
  openGraph: {
    title: 'Password Generator - Create Strong Secure Passwords',
    description: 'Generate secure, random passwords with customizable options. Perfect for creating strong passwords for all your accounts.',
    type: 'website',
  },
}

export default function PasswordGeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}