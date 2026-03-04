import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, PhoneIcon, MailIcon, MapPinIcon } from 'lucide-react';
interface FooterProps {
  onNavigate?: (path: string) => void;
}
export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#1B6B3A] rounded-lg flex items-center justify-center">
                <HomeIcon size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg">
                Shortlet<span className="text-[#F59E0B]">Connect</span>
              </span>
            </Link>
            <p className="text-[#9CA3AF] text-sm leading-relaxed max-w-sm">
              Nigeria's most trusted shortlet marketplace. Connecting property
              owners, verified agents, and guests across Lagos, Abuja and
              beyond.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                <PhoneIcon size={14} className="text-[#1B6B3A]" />
                +234 800 SHORTLET
              </div>
              <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                <MailIcon size={14} className="text-[#1B6B3A]" />
                hello@shortletconnect.ng
              </div>
              <div className="flex items-center gap-2 text-sm text-[#9CA3AF]">
                <MapPinIcon size={14} className="text-[#1B6B3A]" />
                Lagos & Abuja, Nigeria
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
              {
                label: 'Browse Listings',
                path: '/listings'
              },
              {
                label: 'How It Works',
                path: '/#how-it-works'
              },
              {
                label: 'Login',
                path: '/login'
              },
              {
                label: 'Register',
                path: '/register'
              }].
              map((link) =>
              <li key={link.path}>
                  <Link
                  to={link.path}
                  className="text-sm text-[#9CA3AF] hover:text-white transition-colors">

                    {link.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">For Agents</h4>
            <ul className="space-y-2">
              {[
              {
                label: 'Get Trusted Badge',
                path: '/register'
              },
              {
                label: 'Agent Dashboard',
                path: '/agent/dashboard'
              },
              {
                label: 'Boost Listings',
                path: '/agent/properties'
              },
              {
                label: 'Apply to Properties',
                path: '/listings'
              }].
              map((link) =>
              <li key={link.path}>
                  <Link
                  to={link.path}
                  className="text-sm text-[#9CA3AF] hover:text-white transition-colors">

                    {link.label}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6B7280]">
            © {new Date().getFullYear()} ShortletConnect. All rights reserved.
          </p>
          <p className="text-xs text-[#6B7280] text-center">
            ⚠️ We do not handle payments or bookings. All transactions occur
            independently between parties.
          </p>
        </div>
      </div>
    </footer>);

}