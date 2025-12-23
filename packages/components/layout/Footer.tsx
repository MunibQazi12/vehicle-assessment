/**
 * Dealer-branded Footer Component
 * 
 * Displays dealer information, links, and contact details with dealer-specific branding
 * Server Component - receives website info as prop for better performance
 */

import type { DealerInfoWithGroup } from '@dealertower/lib/api/dealer';
import Link from 'next/link';

interface FooterProps {
  websiteInfo: DealerInfoWithGroup | null;
}

export function Footer({ websiteInfo }: FooterProps) {
  if (!websiteInfo) {
    return (
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Dealer Tower. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  const { name: dealershipName, theme } = websiteInfo;
  const currentYear = new Date().getFullYear();

  // Footer link hover styles using CSS custom properties
  const footerLinkStyle = `
    .footer-link {
      color: rgb(209, 213, 219);
      transition: color 0.2s;
    }
    .footer-link:hover {
      color: ${theme.primaryColor};
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: footerLinkStyle }} />
      <footer 
        className="bg-gray-900 text-gray-300 border-t-4"
        style={{ borderTopColor: theme.primaryColor }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Dealership Info */}
            <div>
              <h3 
              className="text-lg font-bold mb-4"
              style={{ color: theme.primaryColor }}
            >
              {dealershipName}
            </h3>
            <div className="space-y-2 text-sm">
              {websiteInfo.address && (
                <p className="flex flex-col">
                  <span>{websiteInfo.address}</span>
                  {(websiteInfo.city || websiteInfo.state || websiteInfo.zip_code) && (
                    <span>
                      {[websiteInfo.city, websiteInfo.state, websiteInfo.zip_code]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  )}
                </p>
              )}
              {websiteInfo.phone_numbers?.[0] && (
                <p>
                  <a 
                    href={`tel:${websiteInfo.phone_numbers[0].value.replace(/\D/g, '')}`}
                    className="footer-link"
                  >
                    {websiteInfo.phone_numbers[0].value}
                  </a>
                </p>
              )}
              {websiteInfo.email_addresses?.[0] && (
                <p>
                  <a 
                    href={`mailto:${websiteInfo.email_addresses[0]}`}
                    className="footer-link"
                  >
                    {websiteInfo.email_addresses[0]}
                  </a>
                </p>
              )}
            </div>
          </div>
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/new-vehicles" className="footer-link">
                    New Vehicles
                  </Link>
                </li>
                <li>
                  <Link href="/used-vehicles" className="footer-link">
                    Used Vehicles
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="footer-link">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/financing" className="footer-link">
                    Financing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Hours</h3>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="text-white">9:00 AM - 8:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="text-white">9:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="text-white">Closed</span>
                </p>
              </div>
            </div>

            {/* Social & Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <Link href="/privacy-policy" className="footer-link">
                    Privacy Policy
                  </Link>
                </p>
                <p>
                  <Link href="/terms-of-service" className="footer-link">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col gap-4 text-center text-sm md:flex-row md:justify-between md:text-left">
              <p>
                &copy; {currentYear} {dealershipName}. All rights reserved.
              </p>
              <p className="text-gray-400">
                Powered by{' '}
                <a 
                  href="https://dealertower.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Dealer Tower
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
