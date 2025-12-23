/**
 * Dealer-branded Header Component
 * 
 * Displays dealer logo, name, and contact information with dealer-specific branding
 * Server Component - receives website info as prop for better performance
 */

import type { DealerInfoWithGroup } from '@dealertower/lib/api/dealer';

interface HeaderProps {
  websiteInfo: DealerInfoWithGroup | null;
}

export function Header({ websiteInfo }: HeaderProps) {

  if (!websiteInfo) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Dealer Tower
            </h1>
          </div>
        </div>
      </header>
    );
  }

  const { name: dealershipName, theme, phone_numbers } = websiteInfo;
  const primaryPhone = phone_numbers?.[0];

  return (
    <header 
      className="bg-white shadow-sm border-b"
      style={{ borderBottomColor: theme.primaryColor }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Dealership Name */}
          <div className="flex items-center gap-4">
            <div>
              <h1 
                className="text-2xl font-bold"
                style={{ color: theme.primaryColor }}
              >
                {dealershipName}
              </h1>
              {websiteInfo.city && websiteInfo.state && (
                <p className="text-sm text-gray-600">
                  {websiteInfo.city}, {websiteInfo.state}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {primaryPhone && (
            <div className="hidden md:block">
              <a 
                href={`tel:${primaryPhone.value.replace(/\D/g, '')}`}
                className="btn-dealer-primary px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {primaryPhone.value}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
