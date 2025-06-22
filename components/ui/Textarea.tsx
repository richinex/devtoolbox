interface TextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
  disabled?: boolean
}

export function Textarea({ 
  value, 
  onChange, 
  placeholder = '',
  rows = 4,
  className = '',
  disabled = false 
}: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`w-full px-4 py-3 text-base md:px-3 md:py-2 md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-vertical ${className}`}
    />
  )
}