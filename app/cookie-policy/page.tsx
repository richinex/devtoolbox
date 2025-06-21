import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/Card'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Cookie Policy</h1>
          <p className="text-gray-600 mt-1">Last updated: December 21, 2024</p>
        </div>

        <Card className="prose prose-gray max-w-none">
          <CardContent className="p-8">
            <h2>1. What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help 
              websites remember your preferences and improve your browsing experience.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              MyDailyDevTools uses cookies only with your explicit consent. Our website remains fully 
              functional without cookies - you can use all our developer tools without accepting cookies.
            </p>

            <h2>3. Types of Cookies We Use</h2>
            
            <h3>3.1 Strictly Necessary Cookies</h3>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Cookie Name</th>
                  <th className="text-left">Purpose</th>
                  <th className="text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>cookieConsent</td>
                  <td>Stores your cookie consent preference</td>
                  <td>1 year</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-gray-600 mt-2">
              These cookies are essential and do not require consent.
            </p>

            <h3>3.2 Analytics Cookies (With Consent)</h3>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Cookie Name</th>
                  <th className="text-left">Provider</th>
                  <th className="text-left">Purpose</th>
                  <th className="text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics</td>
                  <td>Distinguishes unique users</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_ga_*</td>
                  <td>Google Analytics</td>
                  <td>Maintains session state</td>
                  <td>2 years</td>
                </tr>
              </tbody>
            </table>

            <h3>3.3 Advertising Cookies (With Consent)</h3>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Cookie Name</th>
                  <th className="text-left">Provider</th>
                  <th className="text-left">Purpose</th>
                  <th className="text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Various</td>
                  <td>Google AdSense</td>
                  <td>Display relevant advertisements</td>
                  <td>Various</td>
                </tr>
              </tbody>
            </table>

            <h2>4. Your Cookie Choices</h2>
            <p>You have complete control over cookies on our website:</p>
            <ul>
              <li><strong>Accept:</strong> Enable analytics and advertising cookies</li>
              <li><strong>Reject:</strong> Use the site without any tracking cookies</li>
              <li><strong>Browser Settings:</strong> Block or delete cookies via your browser</li>
            </ul>

            <h2>5. Managing Your Consent</h2>
            <p>
              You can change your cookie preferences at any time by:
            </p>
            <ul>
              <li>Clearing your browser's cookies for this site</li>
              <li>Revisiting the site to see the consent banner again</li>
              <li>Using your browser's cookie management tools</li>
            </ul>

            <h2>6. Third-Party Services</h2>
            <p>We use the following third-party services that may set cookies:</p>
            <ul>
              <li>
                <strong>Google Analytics:</strong> For website analytics<br />
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong>Google AdSense:</strong> For displaying advertisements<br />
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Ads Privacy Policy
                </a>
              </li>
            </ul>

            <h2>7. How to Disable Cookies</h2>
            <p>You can disable cookies in your browser:</p>
            <ul>
              <li>
                <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
              </li>
              <li>
                <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
              </li>
              <li>
                <strong>Edge:</strong> Settings → Privacy, search, and services → Cookies and site permissions
              </li>
            </ul>

            <h2>8. Impact of Disabling Cookies</h2>
            <p>
              If you disable cookies:
            </p>
            <ul>
              <li>All developer tools will continue to work normally</li>
              <li>We won't be able to track usage analytics</li>
              <li>You may see less relevant advertisements</li>
              <li>Your cookie preference won't be remembered</li>
            </ul>

            <h2>9. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy to reflect changes in our practices or legal requirements. 
              Check the "Last updated" date for the latest version.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              For questions about our use of cookies:
            </p>
            <p>
              Email: privacy@mydailydevtools.com<br />
              Website: mydailydevtools.com
            </p>

            <h2>11. More Information</h2>
            <p>
              For more information about cookies and online privacy:
            </p>
            <ul>
              <li>
                <a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  AboutCookies.org
                </a>
              </li>
              <li>
                <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  AllAboutCookies.org
                </a>
              </li>
              <li>
                <a href="https://autoriteitpersoonsgegevens.nl/en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Dutch Data Protection Authority
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}