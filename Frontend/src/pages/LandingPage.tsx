import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  MapPinIcon,
  BedDoubleIcon,
  ShieldCheckIcon,
  PhoneIcon,
  TagIcon,
  UsersIcon,
  BuildingIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ZapIcon,
  TrendingUpIcon,
  ClockIcon } from
'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { useAppSelector } from '../store';
import { mockUsers } from '../data/mockData';
export function LandingPage() {
  const navigate = useNavigate();
  const properties = useAppSelector((s) => s.properties.list);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBedrooms, setSearchBedrooms] = useState('');
  const now = new Date();
  // Smart ranking: boosted > featured > newest
  const rankedProperties = [...properties].
  filter((p) => p.status === 'active').
  sort((a, b) => {
    const aBoosted = a.boostedUntil && new Date(a.boostedUntil) > now ? 1 : 0;
    const bBoosted = b.boostedUntil && new Date(b.boostedUntil) > now ? 1 : 0;
    if (bBoosted !== aBoosted) return bBoosted - aBoosted;
    const aFeatured =
    a.isFeatured && a.featuredUntil && new Date(a.featuredUntil) > now ?
    1 :
    0;
    const bFeatured =
    b.isFeatured && b.featuredUntil && new Date(b.featuredUntil) > now ?
    1 :
    0;
    if (bFeatured !== aFeatured) return bFeatured - aFeatured;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const featuredProperties = rankedProperties.
  filter(
    (p) => p.isFeatured && p.featuredUntil && new Date(p.featuredUntil) > now
  ).
  slice(0, 4);
  const recentProperties = [...properties].
  filter((p) => p.status === 'active').
  sort(
    (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).
  slice(0, 4);
  const trendingProperties = [...properties].
  filter((p) => p.status === 'active').
  sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).
  slice(0, 4);
  const getAgent = (agentId?: string) =>
  agentId ? mockUsers.find((u) => u.id === agentId) : undefined;
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set('city', searchLocation);
    if (searchBedrooms) params.set('bedrooms', searchBedrooms);
    navigate(`/listings?${params.toString()}`);
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1B6B3A] via-[#1a5e33] to-[#145230] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <StarIcon size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
              Nigeria's Trusted Shortlet Marketplace
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Find Your Perfect <span className="text-[#F59E0B]">Shortlet</span>{' '}
              in Nigeria
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed">
              Browse verified listings in Lagos, Abuja and beyond. Connect
              directly with owners and trusted agents — no middlemen, no hidden
              fees.
            </p>

            <div className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <MapPinIcon
                  size={18}
                  className="text-[#1B6B3A] flex-shrink-0" />

                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full text-[#111827] text-sm bg-transparent focus:outline-none">

                  <option value="">All Cities</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                </select>
              </div>
              <div className="hidden sm:block w-px bg-[#E5E7EB]" />
              <div className="flex-1 flex items-center gap-3 px-4 py-2">
                <BedDoubleIcon
                  size={18}
                  className="text-[#1B6B3A] flex-shrink-0" />

                <select
                  value={searchBedrooms}
                  onChange={(e) => setSearchBedrooms(e.target.value)}
                  className="w-full text-[#111827] text-sm bg-transparent focus:outline-none">

                  <option value="">Any Bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">

                <SearchIcon size={16} /> Search
              </button>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
            {
              value: '500+',
              label: 'Listings'
            },
            {
              value: '200+',
              label: 'Trusted Agents'
            },
            {
              value: '10K+',
              label: 'Happy Guests'
            }].
            map((stat) =>
            <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#F59E0B]">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm mt-0.5">{stat.label}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredProperties.length > 0 &&
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1B6B3A] rounded-lg flex items-center justify-center">
                <StarIcon size={16} className="text-white fill-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Featured Properties
                </h2>
                <p className="text-[#6B7280] text-sm">
                  Premium listings with top visibility
                </p>
              </div>
            </div>
            <Link
            to="/listings"
            className="hidden sm:flex items-center gap-1.5 text-[#1B6B3A] font-semibold text-sm hover:gap-2.5 transition-all">

              View All <ArrowRightIcon size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProperties.map((property) =>
          <PropertyCard
            key={property.id}
            property={property}
            agent={getAgent(property.agentId)} />

          )}
          </div>
        </section>
      }

      {/* Recently Added */}
      <section
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${featuredProperties.length > 0 ? 'pb-14' : 'py-14'}`}>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <ClockIcon size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                Recently Added
              </h2>
              <p className="text-[#6B7280] text-sm">
                Fresh listings just posted
              </p>
            </div>
          </div>
          <Link
            to="/listings"
            className="hidden sm:flex items-center gap-1.5 text-[#1B6B3A] font-semibold text-sm hover:gap-2.5 transition-all">

            View All <ArrowRightIcon size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentProperties.map((property) =>
          <PropertyCard
            key={property.id}
            property={property}
            agent={getAgent(property.agentId)} />

          )}
        </div>
      </section>

      {/* Trending */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                <TrendingUpIcon size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Trending This Week
                </h2>
                <p className="text-[#6B7280] text-sm">Most viewed properties</p>
              </div>
            </div>
            <Link
              to="/listings"
              className="hidden sm:flex items-center gap-1.5 text-[#1B6B3A] font-semibold text-sm hover:gap-2.5 transition-all">

              View All <ArrowRightIcon size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trendingProperties.map((property) =>
            <PropertyCard
              key={property.id}
              property={property}
              agent={getAgent(property.agentId)} />

            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">
              How It Works
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              ShortletConnect makes it simple to find, list, and manage shortlet
              properties across Nigeria.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            {
              icon: UsersIcon,
              title: 'For Guests',
              color: 'bg-[#E8F5EE]',
              iconColor: 'text-[#1B6B3A]',
              items: [
              'Browse hundreds of verified listings',
              'Filter by location, price, and size',
              'Contact owners or agents directly']

            },
            {
              icon: BuildingIcon,
              title: 'For Owners',
              color: 'bg-[#E8F5EE]',
              iconColor: 'text-[#1B6B3A]',
              items: [
              'List your property in minutes',
              'Choose to self-manage or assign an agent',
              'Feature your listing for premium visibility']

            },
            {
              icon: StarIcon,
              title: 'For Agents',
              color: 'bg-amber-50',
              iconColor: 'text-[#F59E0B]',
              items: [
              'Apply to manage properties in your area',
              'Get the Trusted Agent badge for ₦1,000',
              'Boost listings for maximum visibility']

            }].
            map(({ icon: Icon, title, color, iconColor, items }) =>
            <div
              key={title}
              className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#E5E7EB]">

                <div
                className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5`}>

                  <Icon size={24} className={iconColor} />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-3">
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {items.map((item) =>
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-[#6B7280]">

                      <CheckCircleIcon
                    size={16}
                    className="text-[#10B981] mt-0.5 flex-shrink-0" />

                      {item}
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Monetization CTA */}
      <section className="bg-white py-14 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">
              Grow Your Business
            </h2>
            <p className="text-[#6B7280]">
              Premium tools to maximize your visibility and earnings
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
            {
              icon: ShieldCheckIcon,
              title: 'Trusted Agent Badge',
              price: '₦1,000',
              desc: 'One-time fee. Get verified, appear first, unlimited applications.',
              color: 'border-[#F59E0B] bg-amber-50',
              iconBg: 'bg-amber-100',
              iconColor: 'text-amber-600'
            },
            {
              icon: StarIcon,
              title: 'Featured Listing',
              price: '₦5,000',
              desc: 'Appear on homepage and top of search results for 30 days.',
              color: 'border-[#1B6B3A] bg-[#E8F5EE]',
              iconBg: 'bg-[#1B6B3A]/10',
              iconColor: 'text-[#1B6B3A]'
            },
            {
              icon: ZapIcon,
              title: 'Boost Listing',
              price: '₦2,000',
              desc: 'Move your listing to the top of search results for 7 days.',
              color: 'border-blue-300 bg-blue-50',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600'
            }].
            map(
              ({
                icon: Icon,
                title,
                price,
                desc,
                color,
                iconBg,
                iconColor
              }) =>
              <div
                key={title}
                className={`rounded-2xl border-2 p-6 ${color}`}>

                  <div
                  className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4`}>

                    <Icon size={24} className={iconColor} />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="font-bold text-[#111827]">{title}</h3>
                    <span className="text-sm font-bold text-[#1B6B3A]">
                      {price}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {desc}
                  </p>
                </div>

            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1B6B3A] to-[#145230] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of owners, agents, and guests on Nigeria's most
            trusted shortlet platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-[#1B6B3A] hover:bg-[#E8F5EE] font-semibold px-8 py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2">

              <BuildingIcon size={18} /> List as Owner
            </Link>
            <Link
              to="/register"
              className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-8 py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2">

              <StarIcon size={18} /> Join as Agent
            </Link>
          </div>
        </div>
      </section>
    </div>);

}