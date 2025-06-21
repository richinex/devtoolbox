import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Text Diff Checker - Compare Text Differences Online | DevToolbox',
  description: 'Free online text diff tool. Compare two texts side-by-side and highlight differences. Perfect for code review, document comparison, and text analysis.',
  keywords: 'text diff, compare text, text comparison, diff checker, text differences, side by side comparison, code diff',
  openGraph: {
    title: 'Text Diff Checker - Compare Text Differences',
    description: 'Compare texts side-by-side and highlight differences with our free online diff tool. Perfect for developers and writers.',
    type: 'website',
  },
}

export default function TextDiffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}