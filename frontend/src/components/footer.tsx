'use client';

import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-(--color-border) bg-(--color-background) py-(--spacing-lg) px-(--spacing-lg) mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-(--spacing-lg) mb-(--spacing-lg)">
          {/* Brand Section */}
          <div className="space-y-2">
            <h3 className="text-label font-semibold text-(--color-text-primary)">
              ArthaPath
            </h3>
            <p className="text-caption text-(--color-text-secondary)">
              Smart investment planning for Nepal
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-2">
            <h4 className="text-label font-semibold text-(--color-text-primary)">
              Product
            </h4>
            <ul className="space-y-1">
              <li>
                <a
                  href="/dashboard"
                  className="text-caption text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/simulator"
                  className="text-caption text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Simulator
                </a>
              </li>
              <li>
                <a
                  href="/explore"
                  className="text-caption text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Explore
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-2">
            <h4 className="text-label font-semibold text-(--color-text-primary)">
              Resources
            </h4>
            <ul className="space-y-1">
              <li>
                <a
                  href="/education"
                  className="text-caption text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Education
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="text-caption text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Help & Support
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-caption text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-2">
            <h4 className="text-label font-semibold text-(--color-text-primary)">
              Legal
            </h4>
            <ul className="space-y-1">
              <li>
                <a
                  href="/privacy"
                  className="text-caption text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-caption text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/disclaimer"
                  className="text-caption text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
                >
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="border-t border-(--color-border) pt-(--spacing-md) mb-(--spacing-md)">
          <p className="text-caption text-(--color-text-secondary) bg-(--color-background-hover) border border-(--color-border) rounded-md p-(--spacing-md)">
            <strong>Disclaimer:</strong> ArthaPath does not provide financial advice. All projections
            are estimates based on historical data and assumptions. Please consult with a qualified
            financial advisor before making investment decisions.
          </p>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-(--color-border) pt-(--spacing-md) flex flex-col md:flex-row justify-between items-center text-caption text-(--color-text-secondary)">
          <p>&copy; {currentYear} ArthaPath Nepal. All rights reserved.</p>
          <div className="flex gap-(--spacing-md) mt-4 md:mt-0">
            <a href="#" aria-label="Twitter">
              𝕏
            </a>
            <a href="#" aria-label="GitHub">
              GitHub
            </a>
            <a href="#" aria-label="LinkedIn">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
