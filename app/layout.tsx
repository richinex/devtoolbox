import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StructuredData, { organizationStructuredData, websiteStructuredData } from "@/components/seo/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Online Developer Tools - JSON Formatter, Base64, URL Encoder | MyDailyDevTools",
  description: "Best free online developer tools: JSON formatter, URL encoder/decoder, Base64 converter, hash generator, password generator, text diff, UUID generator, QR codes. No signup, privacy-focused, works offline.",
  keywords: "developer tools, json formatter, base64 encoder, url encoder, hash generator, password generator, text diff, uuid generator, qr code generator, delimiter converter, online tools, free tools",
  authors: [{ name: "MyDailyDevTools" }],
  openGraph: {
    title: "Free Online Developer Tools - MyDailyDevTools",
    description: "Essential developer tools for everyday tasks. JSON formatter, Base64, URL encoder, and more. Fast, free, and privacy-focused.",
    url: "https://mydailydevtools.com",
    siteName: "MyDailyDevTools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Developer Tools - MyDailyDevTools",
    description: "JSON formatter, Base64, URL encoder, and more developer tools. Fast, free, and privacy-focused.",
  },
  alternates: {
    canonical: "https://mydailydevtools.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationStructuredData} />
        <StructuredData data={websiteStructuredData} />
        <meta name="google-adsense-account" content="ca-pub-1647044477984258" />
        <Script
          async
          src="https://fundingchoicesmessages.google.com/i/ca-pub-1647044477984258?ers=1"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1647044477984258"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
