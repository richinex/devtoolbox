// Common types for DevToolbox application

export interface Tool {
  title: string
  description: string
  href: string
  icon: string
  category?: string
  keywords?: string[]
}

export interface ToolCategory {
  name: string
  tools: Tool[]
}

// SEO Types
export interface SEOMetadata {
  title: string
  description: string
  keywords?: string
  canonical?: string
  noindex?: boolean
  openGraph?: OpenGraphData
  structuredData?: StructuredData
}

export interface OpenGraphData {
  title: string
  description: string
  type: 'website' | 'article'
  url?: string
  image?: string
  siteName?: string
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: string | number | boolean | object | null
}

// Analytics Types
export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export interface PageView {
  page_title: string
  page_location: string
  page_path: string
}

// Tool-specific Types

// JSON Formatter
export interface JsonValidationResult {
  isValid: boolean
  error?: string
  formatted?: string
}

// Hash Generator
export interface HashResult {
  algorithm: string
  input: string
  hash: string
  timestamp: Date
}

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512'

// Password Generator
export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

export interface PasswordResult {
  password: string
  strength: PasswordStrength
  entropy: number
}

export type PasswordStrength = 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'

// UUID Generator
export type UuidVersion = 'v1' | 'v3' | 'v4' | 'v5'

export interface UuidOptions {
  version: UuidVersion
  namespace?: string
  name?: string
  count: number
}

// Base64 Encoder/Decoder
export interface Base64Result {
  input: string
  output: string
  operation: 'encode' | 'decode'
  isValid: boolean
  error?: string
}

// URL Encoder/Decoder
export interface UrlResult {
  input: string
  output: string
  operation: 'encode' | 'decode'
  component?: 'full' | 'component'
}

// Text Diff
export interface DiffResult {
  added: string[]
  removed: string[]
  common: string[]
  changes: DiffChange[]
}

export interface DiffChange {
  type: 'add' | 'remove' | 'common'
  content: string
  lineNumber?: number
}

// QR Code Generator
export interface QRCodeOptions {
  text: string
  size: number
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  margin: number
  colorDark: string
  colorLight: string
}

// Delimiter Converter
export interface DelimiterOptions {
  inputDelimiter: string
  outputDelimiter: string
  hasHeader: boolean
  preserveQuotes: boolean
}

export interface ConversionResult {
  success: boolean
  output?: string
  error?: string
  stats?: {
    rows: number
    columns: number
    totalCells: number
  }
}

// File handling
export interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: Date
  content?: string | ArrayBuffer
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

export interface ThemeConfig {
  theme: Theme
  accentColor: string
  fontSize: 'sm' | 'md' | 'lg'
}

// Settings Types
export interface UserSettings {
  theme: ThemeConfig
  defaultCopyBehavior: 'auto' | 'manual'
  showTooltips: boolean
  autoSave: boolean
  analytics: boolean
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: Date
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ToolComponentProps extends BaseComponentProps {
  onSuccess?: (result: unknown) => void
  onError?: (error: AppError) => void
}

// Navigation Types
export interface NavItem {
  title: string
  href: string
  icon?: string
  description?: string
  external?: boolean
}

export interface BreadcrumbItem {
  title: string
  href?: string
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Constants
export const TOOL_CATEGORIES = {
  TEXT_DATA: 'Text & Data',
  SECURITY: 'Security & Hashing',
  WEB_URLS: 'Web & URLs',
  IDENTIFIERS: 'Identifiers',
  CONVERTERS: 'Converters'
} as const

export const HASH_ALGORITHMS = ['md5', 'sha1', 'sha256', 'sha512'] as const

export const UUID_VERSIONS = ['v1', 'v3', 'v4', 'v5'] as const

export const QR_ERROR_LEVELS = ['L', 'M', 'Q', 'H'] as const