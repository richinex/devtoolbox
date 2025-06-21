declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

export const event = (action: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('event', action, parameters)
  }
}

export const trackToolUsage = (toolName: string, action: string) => {
  event('tool_usage', {
    tool_name: toolName,
    action: action,
  })
}