import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Privacy Policy</h1>
          <p className="text-gray-600 mt-1">Last updated: December 21, 2024</p>
        </div>

        <Card className="prose prose-gray max-w-none">
          <CardContent className="p-8">
            <h2>1. Introduction</h2>
            <p>
              MyDailyDevTools ("we", "our", or "us") operates the website mydailydevtools.com. 
              This Privacy Policy explains how we collect, use, and protect your information when 
              you use our website and services.
            </p>

            <h2>2. Information We Collect</h2>
            <h3>2.1 Analytics Data</h3>
            <p>
              With your consent, we use Google Analytics to collect:
            </p>
            <ul>
              <li>Pages visited and time spent on each page</li>
              <li>Browser type and version</li>
              <li>Device type (desktop, mobile, tablet)</li>
              <li>General geographic location (country/city level)</li>
              <li>Referral source (how you arrived at our site)</li>
            </ul>

            <h3>2.2 Technical Data</h3>
            <p>
              Our web server automatically collects:
            </p>
            <ul>
              <li>IP address (anonymized)</li>
              <li>Browser user agent</li>
              <li>Pages requested</li>
              <li>Time and date of requests</li>
            </ul>

            <h3>2.3 Local Storage</h3>
            <p>
              All tool data (JSON, text, generated passwords, etc.) is processed entirely in your 
              browser and is never sent to our servers.
            </p>

            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Improve our website and tools</li>
              <li>Understand which tools are most popular</li>
              <li>Fix technical issues</li>
              <li>Display relevant advertisements (with consent)</li>
            </ul>

            <h2>4. Cookies and Tracking</h2>
            <p>
              We use cookies only with your explicit consent. You can choose to:
            </p>
            <ul>
              <li>Accept all cookies (analytics and advertising)</li>
              <li>Reject all cookies (site remains fully functional)</li>
              <li>Modify your choice at any time</li>
            </ul>
            <p>
              For details, see our <Link href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</Link>.
            </p>

            <h2>5. Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information. We share data only with:
            </p>
            <ul>
              <li>Google Analytics (for website analytics, with your consent)</li>
              <li>Google AdSense (for advertising, with your consent)</li>
            </ul>

            <h2>6. Your Rights (GDPR)</h2>
            <p>Under the General Data Protection Regulation (GDPR), you have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2>7. Data Security</h2>
            <p>
              We implement appropriate technical measures to protect your information, including:
            </p>
            <ul>
              <li>HTTPS encryption for all data transmission</li>
              <li>Regular security updates</li>
              <li>Limited access to analytics data</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 16. We do not knowingly collect 
              personal information from children.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last updated" date.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              For questions about this Privacy Policy or to exercise your rights, contact us at:
            </p>
            <p>
              Email: privacy@mydailydevtools.com<br />
              Website: mydailydevtools.com
            </p>

            <h2>11. Data Protection Authority</h2>
            <p>
              If you are not satisfied with our response, you have the right to lodge a complaint with 
              the Dutch Data Protection Authority (Autoriteit Persoonsgegevens):
            </p>
            <p>
              Website: <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                autoriteitpersoonsgegevens.nl
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}