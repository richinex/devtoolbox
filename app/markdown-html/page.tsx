'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

export default function MarkdownHtmlConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [preview, setPreview] = useState('')
  const [mode, setMode] = useState<'html' | 'preview'>('html')
  const [error, setError] = useState('')
  const [options, setOptions] = useState({
    breaks: true,
    gfm: true,
    sanitize: true
  })

  const convertMarkdown = useCallback(async () => {
    if (!input.trim()) {
      setError('Please enter some Markdown to convert')
      setOutput('')
      setPreview('')
      return
    }

    try {
      // Configure marked options
      marked.setOptions({
        breaks: options.breaks,
        gfm: options.gfm,
      })

      // Convert markdown to HTML
      const rawHtml = await marked(input)
      
      // Sanitize HTML if option is enabled
      const html = options.sanitize ? DOMPurify.sanitize(rawHtml) : rawHtml
      
      setOutput(html)
      setPreview(html)
      setError('')
    } catch (err) {
      setError(`Error converting Markdown: ${(err as Error).message}`)
      setOutput('')
      setPreview('')
    }
  }, [input, options])

  const loadBasicExample = () => {
    setInput(`# MyDailyDevTools - Markdown Example

## Introduction
Welcome to the **Markdown to HTML** converter! This tool supports [CommonMark](https://commonmark.org/) and GitHub Flavored Markdown.

### Features
- **Bold** and *italic* text
- ~~Strikethrough~~ text
- \`Inline code\`
- [Links](https://mydailydevtools.com)

### Lists

#### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered List
1. First step
2. Second step
3. Third step

### Code Block
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

### Blockquote
> "The best tool for the job is the one that gets the job done."
> 
> — Anonymous Developer

### Table
| Tool | Description | Status |
|------|-------------|--------|
| Markdown | Lightweight markup | ✅ Active |
| HTML | Web standard | ✅ Active |
| LaTeX | Document prep | ⏸️ Legacy |

---

Made with ❤️ by MyDailyDevTools`)
  }

  const loadAdvancedExample = () => {
    setInput(`# Advanced Markdown Features

## Task Lists
- [x] Create Markdown parser
- [x] Add syntax highlighting
- [ ] Implement live preview
- [ ] Add export options

## Footnotes
Here's a sentence with a footnote[^1].

[^1]: This is the footnote explanation.

## Definition Lists
Term 1
:   Definition for term 1

Term 2
:   Definition for term 2
:   Another definition for term 2

## HTML in Markdown
<div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
  <p>This is <strong>HTML</strong> inside Markdown!</p>
</div>

## Images
![Placeholder Image](https://via.placeholder.com/300x200)

### Image with Title
![Alt text](https://via.placeholder.com/300x200 "Image Title")

## Horizontal Rules

Three or more hyphens:

---

Three or more asterisks:

***

Three or more underscores:

___

## Escaping Characters
\\*This text is not italic\\*
\\[This is not a link\\](not-a-url)

## Nested Blockquotes
> Level 1 quote
>> Level 2 nested quote
>>> Level 3 deeply nested quote

## Complex Tables

| Left aligned | Center aligned | Right aligned |
|:-------------|:--------------:|--------------:|
| Row 1 Col 1  | Row 1 Col 2    | Row 1 Col 3   |
| Row 2 Col 1  | Row 2 Col 2    | Row 2 Col 3   |
| Multi<br>line | **Bold**<br>*Italic* | \`code\`   |

## Mathematical Expressions (when supported)
When $a \\ne 0$, there are two solutions to $(ax^2 + bx + c = 0)$`)
  }

  const loadGitHubExample = () => {
    setInput(`# GitHub Flavored Markdown

## Mentions and References
Hey @username, check out issue #123 and PR #456!

## Emoji Support
:smile: :rocket: :tada: :100: :heart:

## Syntax Highlighting
\`\`\`python
def fibonacci(n):
    """Generate Fibonacci sequence up to n"""
    a, b = 0, 1
    while a < n:
        yield a
        a, b = b, a + b

# Example usage
for num in fibonacci(100):
    print(num)
\`\`\`

\`\`\`sql
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.active = true
GROUP BY u.id, u.name
HAVING COUNT(p.id) > 5
ORDER BY post_count DESC;
\`\`\`

## Diff Highlighting
\`\`\`diff
- const oldFunction = () => {
-   return "old implementation";
- }
+ const newFunction = () => {
+   return "new and improved implementation";
+ }
\`\`\`

## Alerts (GitHub-style)
> [!NOTE]
> Useful information that users should know.

> [!WARNING]
> Critical content demanding user attention.

> [!TIP]
> Helpful advice for users.`)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setPreview('')
    setError('')
  }

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output).catch(err => {
        console.error('Failed to copy:', err)
      })
    }
  }

  const downloadOutput = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'converted.html'
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadFullPage = () => {
    if (!output) return
    
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Markdown</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        pre {
            background-color: #f6f8fa;
            padding: 16px;
            overflow: auto;
            border-radius: 6px;
        }
        code {
            background-color: #f3f4f6;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: Consolas, Monaco, monospace;
        }
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding-left: 16px;
            margin-left: 0;
            color: #6a737d;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
        }
        th, td {
            border: 1px solid #dfe2e5;
            padding: 8px 12px;
        }
        th {
            background-color: #f6f8fa;
            font-weight: 600;
        }
        img {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>
<body>
${output}
</body>
</html>`
    
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'markdown-page.html'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Auto-convert when input or options change
  useEffect(() => {
    if (input.trim()) {
      const timer = setTimeout(() => {
        convertMarkdown()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [input, convertMarkdown])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Markdown to HTML Converter</h1>
          <p className="text-gray-600 mt-1">Convert Markdown to HTML with live preview</p>
        </div>

        {/* Settings */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Options</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.breaks}
                  onChange={(e) => setOptions({...options, breaks: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Line breaks as {'<br>'}</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.gfm}
                  onChange={(e) => setOptions({...options, gfm: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">GitHub Flavored Markdown</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.sanitize}
                  onChange={(e) => setOptions({...options, sanitize: e.target.checked})}
                  className="rounded"
                />
                <span className="text-sm">Sanitize HTML</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={loadBasicExample} variant="secondary">Basic Example</Button>
              <Button onClick={loadAdvancedExample} variant="secondary">Advanced Example</Button>
              <Button onClick={loadGitHubExample} variant="secondary">GitHub Example</Button>
              <Button onClick={clearAll} variant="danger">Clear</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Markdown Input</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Enter your Markdown here..."
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={() => setMode('html')}
                  variant={mode === 'html' ? 'primary' : 'secondary'}
                  size="sm"
                >
                  HTML
                </Button>
                <Button
                  onClick={() => setMode('preview')}
                  variant={mode === 'preview' ? 'primary' : 'secondary'}
                  size="sm"
                >
                  Preview
                </Button>
              </div>
              <div className="flex gap-2">
                {output && (
                  <>
                    <Button onClick={downloadOutput} size="sm" variant="secondary">
                      Download HTML
                    </Button>
                    <Button onClick={downloadFullPage} size="sm" variant="secondary">
                      Full Page
                    </Button>
                    {mode === 'html' && (
                      <Button onClick={copyToClipboard} size="sm" variant="secondary">
                        Copy
                      </Button>
                    )}
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              {mode === 'html' ? (
                <Textarea
                  value={output}
                  onChange={() => {}}
                  placeholder="HTML output will appear here..."
                  rows={20}
                  className="font-mono text-sm"
                  disabled
                />
              ) : (
                <div 
                  className="prose prose-sm max-w-none p-4 bg-white rounded-md border overflow-auto"
                  style={{ minHeight: '500px' }}
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Supported Markdown Features</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Headers:</strong> # H1, ## H2, ### H3, etc.</li>
                <li>• <strong>Emphasis:</strong> **bold**, *italic*, ~~strikethrough~~</li>
                <li>• <strong>Lists:</strong> Ordered (1. 2. 3.) and unordered (- * +)</li>
                <li>• <strong>Links:</strong> [text](url) and reference style</li>
                <li>• <strong>Images:</strong> ![alt](url &quot;title&quot;)</li>
                <li>• <strong>Code:</strong> `inline` and ```fenced blocks```</li>
                <li>• <strong>Tables:</strong> With alignment support</li>
                <li>• <strong>Blockquotes:</strong> {'>'} quoted text</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">GitHub Flavored Markdown</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Task lists:</strong> - [x] completed, - [ ] todo</li>
                <li>• <strong>Tables:</strong> Extended table syntax</li>
                <li>• <strong>Strikethrough:</strong> ~~deleted text~~</li>
                <li>• <strong>Autolinks:</strong> URLs become clickable</li>
                <li>• <strong>Emoji:</strong> :smile: :rocket: (in preview)</li>
                <li>• <strong>Syntax highlighting:</strong> Language-specific code blocks</li>
                <li>• <strong>Footnotes:</strong> Reference-style footnotes</li>
                <li>• <strong>HTML:</strong> Inline HTML support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}