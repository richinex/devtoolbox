'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { format } from 'sql-formatter'

export default function SqlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [dialect, setDialect] = useState<'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'mariadb'>('sql')
  const [uppercase, setUppercase] = useState(true)
  const [linesBetweenQueries, setLinesBetweenQueries] = useState(2)
  const [indentSize, setIndentSize] = useState(2)

  const formatSql = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter some SQL to format')
      setOutput('')
      return
    }

    try {
      const formatted = format(input, {
        language: dialect,
        keywordCase: uppercase ? 'upper' : 'lower',
        indentStyle: 'standard',
        linesBetweenQueries,
        tabWidth: indentSize,
      })
      
      setOutput(formatted)
      setError('')
    } catch (err) {
      setError(`Error formatting SQL: ${(err as Error).message}`)
      setOutput('')
    }
  }, [input, dialect, uppercase, linesBetweenQueries, indentSize])

  const minifySql = () => {
    if (!input.trim()) {
      setError('Please enter some SQL to minify')
      return
    }

    try {
      // Remove comments and extra whitespace
      const minified = input
        // Remove single-line comments
        .replace(/--.*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Replace multiple spaces with single space
        .replace(/\s+/g, ' ')
        // Remove spaces around operators
        .replace(/\s*([,;=<>!]+)\s*/g, '$1')
        // Remove leading/trailing whitespace
        .trim()
      
      setOutput(minified)
      setError('')
    } catch (err) {
      setError(`Error minifying SQL: ${(err as Error).message}`)
    }
  }

  const loadSelectExample = () => {
    setInput(`SELECT 
  u.id, u.username, u.email, u.created_at,
  p.title AS post_title, p.content, p.published_at,
  COUNT(c.id) AS comment_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id
WHERE u.active = true
  AND p.published_at >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
GROUP BY u.id, p.id
HAVING comment_count > 5
ORDER BY p.published_at DESC, comment_count DESC
LIMIT 10;`)
  }

  const loadComplexExample = () => {
    setInput(`-- Create user table with constraints
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created (created_at)
);

-- Insert sample data
INSERT INTO users (username, email, password_hash) VALUES
  ('john_doe', 'john@example.com', 'hash123'),
  ('jane_smith', 'jane@example.com', 'hash456'),
  ('bob_wilson', 'bob@example.com', 'hash789');

-- Update user with subquery
UPDATE users u
SET u.last_login = NOW()
WHERE u.id IN (
  SELECT user_id 
  FROM login_attempts 
  WHERE success = true 
    AND attempt_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)
);

-- Complex analytical query
WITH monthly_stats AS (
  SELECT 
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*) AS user_count,
    COUNT(CASE WHEN active = true THEN 1 END) AS active_count
  FROM users
  GROUP BY DATE_FORMAT(created_at, '%Y-%m')
)
SELECT 
  month,
  user_count,
  active_count,
  ROUND(active_count * 100.0 / user_count, 2) AS active_percentage
FROM monthly_stats
ORDER BY month DESC;`)
  }

  const loadStoredProcExample = () => {
    setInput(`DELIMITER //

CREATE PROCEDURE GetUserStats(
  IN p_user_id INT,
  OUT p_post_count INT,
  OUT p_comment_count INT
)
BEGIN
  -- Get post count
  SELECT COUNT(*) INTO p_post_count
  FROM posts
  WHERE user_id = p_user_id;
  
  -- Get comment count
  SELECT COUNT(*) INTO p_comment_count
  FROM comments c
  INNER JOIN posts p ON c.post_id = p.id
  WHERE p.user_id = p_user_id;
  
  -- Log the access
  INSERT INTO user_activity_log (user_id, action, timestamp)
  VALUES (p_user_id, 'stats_viewed', NOW());
END//

DELIMITER ;`)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
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
    
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formatted.sql'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Auto-format when input or settings change
  useEffect(() => {
    if (input.trim()) {
      const timer = setTimeout(() => {
        formatSql()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [input, formatSql])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">SQL Formatter</h1>
          <p className="text-gray-600 mt-1">Format and beautify SQL queries for better readability</p>
        </div>

        {/* Settings */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Formatting Options</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">SQL Dialect</label>
                <select
                  value={dialect}
                  onChange={(e) => setDialect(e.target.value as typeof dialect)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="sql">Standard SQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="sqlite">SQLite</option>
                  <option value="mariadb">MariaDB</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Keyword Case</label>
                <select
                  value={uppercase ? 'upper' : 'lower'}
                  onChange={(e) => setUppercase(e.target.value === 'upper')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="upper">UPPERCASE</option>
                  <option value="lower">lowercase</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Indent Size</label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Lines Between Queries</label>
                <select
                  value={linesBetweenQueries}
                  onChange={(e) => setLinesBetweenQueries(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="1">1 line</option>
                  <option value="2">2 lines</option>
                  <option value="3">3 lines</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={minifySql} variant="secondary">Minify</Button>
              <Button onClick={loadSelectExample} variant="secondary">Load SELECT Example</Button>
              <Button onClick={loadComplexExample} variant="secondary">Load Complex Example</Button>
              <Button onClick={loadStoredProcExample} variant="secondary">Load Stored Procedure</Button>
              <Button onClick={clearAll} variant="danger">Clear</Button>
            </div>
          </CardContent>
        </Card>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">SQL Input</h2>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={setInput}
                placeholder="Paste your SQL query here..."
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold">Formatted Output</h2>
              <div className="flex gap-2">
                {output && (
                  <>
                    <Button onClick={downloadOutput} size="sm" variant="secondary">
                      Download
                    </Button>
                    <Button onClick={copyToClipboard} size="sm" variant="secondary">
                      Copy
                    </Button>
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
              
              <Textarea
                value={output}
                onChange={() => {}}
                placeholder="Formatted SQL will appear here..."
                rows={20}
                className="font-mono text-sm"
                disabled
              />
            </CardContent>
          </Card>
        </div>

        {/* Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Features</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>Multiple dialects:</strong> Support for MySQL, PostgreSQL, SQLite, MariaDB</li>
                <li>• <strong>Keyword casing:</strong> Choose between UPPERCASE or lowercase</li>
                <li>• <strong>Smart indentation:</strong> Properly indents nested queries and clauses</li>
                <li>• <strong>Comment preservation:</strong> Maintains SQL comments in output</li>
                <li>• <strong>Minification:</strong> Remove unnecessary whitespace and comments</li>
                <li>• <strong>Real-time formatting:</strong> Updates as you type</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Supported SQL Statements</h3>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• <strong>DML:</strong> SELECT, INSERT, UPDATE, DELETE, MERGE</li>
                <li>• <strong>DDL:</strong> CREATE, ALTER, DROP, TRUNCATE</li>
                <li>• <strong>DCL:</strong> GRANT, REVOKE</li>
                <li>• <strong>TCL:</strong> COMMIT, ROLLBACK, SAVEPOINT</li>
                <li>• <strong>CTEs:</strong> WITH clauses and recursive queries</li>
                <li>• <strong>Joins:</strong> INNER, LEFT, RIGHT, FULL, CROSS</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}