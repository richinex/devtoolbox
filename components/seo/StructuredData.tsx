interface StructuredDataProps {
  data: object
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  )
}

// Organization structured data
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MyDailyDevTools",
  "description": "Essential developer tools for everyday tasks. Fast, free, and privacy-focused.",
  "url": "https://mydailydevtools.com",
  "logo": "https://mydailydevtools.com/logo.png",
  "sameAs": ["https://github.com/richinex/devtoolbox"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["English", "Dutch"]
  }
}

// Website structured data
export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MyDailyDevTools",
  "description": "Free online developer tools including JSON formatter, URL encoder, Base64 converter, hash generator, password generator, and more.",
  "url": "https://mydailydevtools.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://mydailydevtools.com/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

// Software Application structured data for tools
export function createToolStructuredData(tool: {
  name: string
  description: string
  url: string
  category: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "url": tool.url,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Client-side processing",
      "No data storage",
      "Privacy-focused",
      "Fast performance"
    ],
    "browserRequirements": "HTML5, JavaScript",
    "permissions": "None required",
    "isPartOf": {
      "@type": "WebSite",
      "name": "MyDailyDevTools",
      "url": "https://mydailydevtools.com"
    }
  }
}

// WebPage structured data
export function createWebPageStructuredData(page: {
  name: string
  description: string
  url: string
  breadcrumbs?: Array<{ name: string; url: string }>
}) {
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.name,
    "description": page.description,
    "url": page.url,
    "isPartOf": {
      "@type": "WebSite",
      "name": "MyDailyDevTools",
      "url": "https://mydailydevtools.com"
    },
    "inLanguage": "en-US",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": page.name,
      "description": page.description
    }
  }

  if (page.breadcrumbs && page.breadcrumbs.length > 0) {
    structuredData.breadcrumb = {
      "@type": "BreadcrumbList",
      "itemListElement": page.breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    }
  }

  return structuredData
}

// FAQ structured data for common questions
export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are MyDailyDevTools tools free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, all MyDailyDevTools tools are completely free to use. No registration or payment required."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data safe when using MyDailyDevTools tools?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. All tools process data client-side in your browser. No data is sent to our servers or stored anywhere."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to install anything to use MyDailyDevTools?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No installation required. All tools work directly in your web browser."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use MyDailyDevTools tools offline?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Once the page loads, most tools can work offline as they process data client-side."
      }
    }
  ]
}