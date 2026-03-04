import React, { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FilterIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { useAppSelector } from '../store';
import { mockUsers } from '../data/mockData';
export function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const properties = useAppSelector((s) => s.properties.list);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: searchParams.get('bedrooms') || '',
    manageType: ''
  });
  const [sortBy, setSortBy] = useState('smart');
  const now = new Date();
  const filteredProperties = useMemo(() => {
    let result = properties.filter((p) => p.status === 'active');
    if (filters.city) result = result.filter((p) => p.city === filters.city);
    if (filters.bedrooms) {
      const beds = parseInt(filters.bedrooms);
      if (beds === 4) result = result.filter((p) => p.bedrooms >= 4);else
      result = result.filter((p) => p.bedrooms === beds);
    }
    if (filters.minPrice)
    result = result.filter((p) => p.price >= parseInt(filters.minPrice));
    if (filters.maxPrice)
    result = result.filter((p) => p.price <= parseInt(filters.maxPrice));
    if (filters.manageType)
    result = result.filter((p) => p.manageType === filters.manageType);
    // Smart ranking: boosted > featured > trusted agent > newest
    if (sortBy === 'smart') {
      result = [...result].sort((a, b) => {
        const aBoosted =
        a.boostedUntil && new Date(a.boostedUntil) > now ? 3 : 0;
        const bBoosted =
        b.boostedUntil && new Date(b.boostedUntil) > now ? 3 : 0;
        const aFeatured =
        a.isFeatured && a.featuredUntil && new Date(a.featuredUntil) > now ?
        2 :
        0;
        const bFeatured =
        b.isFeatured && b.featuredUntil && new Date(b.featuredUntil) > now ?
        2 :
        0;
        const aAgent = a.agentId ?
        mockUsers.find((u) => u.id === a.agentId) :
        null;
        const bAgent = b.agentId ?
        mockUsers.find((u) => u.id === b.agentId) :
        null;
        const aTrusted = aAgent?.trustedStatus === 'active' ? 1 : 0;
        const bTrusted = bAgent?.trustedStatus === 'active' ? 1 : 0;
        const aScore = aBoosted + aFeatured + aTrusted;
        const bScore = bBoosted + bFeatured + bTrusted;
        if (bScore !== aScore) return bScore - aScore;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result = [...result].sort(
        (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'popular') {
      result = [...result].sort(
        (a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)
      );
    }
    return result;
  }, [properties, filters, sortBy]);
  const clearFilters = () => {
    setFilters({
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      manageType: ''
    });
    setSearchParams({});
  };
  const hasActiveFilters = Object.values(filters).some((v) => v !== '');
  const getAgent = (agentId?: string) =>
  agentId ? mockUsers.find((u) => u.id === agentId) : undefined;
  const FilterPanel = () =>
  <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#111827]">Filters</h3>
        {hasActiveFilters &&
      <button
        onClick={clearFilters}
        className="text-xs text-[#EF4444] hover:underline flex items-center gap-1">

            <XIcon size={12} /> Clear all
          </button>
      }
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#111827] mb-2">
          City
        </label>
        <select
        value={filters.city}
        onChange={(e) =>
        setFilters((f) => ({
          ...f,
          city: e.target.value
        }))
        }
        className="input-field text-sm">

          <option value="">All Cities</option>
          <option value="Lagos">Lagos</option>
          <option value="Abuja">Abuja</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#111827] mb-2">
          Price Range (₦/night)
        </label>
        <div className="flex gap-2">
          <input
          type="number"
          placeholder="Min"
          value={filters.minPrice}
          onChange={(e) =>
          setFilters((f) => ({
            ...f,
            minPrice: e.target.value
          }))
          }
          className="input-field text-sm" />

          <input
          type="number"
          placeholder="Max"
          value={filters.maxPrice}
          onChange={(e) =>
          setFilters((f) => ({
            ...f,
            maxPrice: e.target.value
          }))
          }
          className="input-field text-sm" />

        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#111827] mb-2">
          Bedrooms
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['1', '2', '3', '4'].map((b) =>
        <button
          key={b}
          onClick={() =>
          setFilters((f) => ({
            ...f,
            bedrooms: f.bedrooms === b ? '' : b
          }))
          }
          className={`py-2 rounded-lg text-sm font-medium border transition-colors ${filters.bedrooms === b ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]' : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#1B6B3A]'}`}>

              {b === '4' ? '4+' : b}
            </button>
        )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#111827] mb-2">
          Managed By
        </label>
        <div className="space-y-2">
          {[
        {
          value: '',
          label: 'All'
        },
        {
          value: 'owner',
          label: 'Owner'
        },
        {
          value: 'agent',
          label: 'Agent'
        }].
        map((opt) =>
        <label
          key={opt.value}
          className="flex items-center gap-2.5 cursor-pointer">

              <input
            type="radio"
            name="manageType"
            value={opt.value}
            checked={filters.manageType === opt.value}
            onChange={(e) =>
            setFilters((f) => ({
              ...f,
              manageType: e.target.value
            }))
            }
            className="accent-[#1B6B3A]" />

              <span className="text-sm text-[#6B7280]">{opt.label}</span>
            </label>
        )}
        </div>
      </div>
    </div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-[#E5E7EB] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-[#111827]">Browse Listings</h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Find shortlet properties across Nigeria
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#6B7280] hover:border-[#1B6B3A] bg-white transition-colors">

                  <SlidersHorizontalIcon size={15} /> Filters
                  {hasActiveFilters &&
                  <span className="w-2 h-2 rounded-full bg-[#1B6B3A]" />
                  }
                </button>
                <span className="text-sm text-[#6B7280]">
                  <span className="font-semibold text-[#111827]">
                    {filteredProperties.length}
                  </span>{' '}
                  {filteredProperties.length === 1 ? 'property' : 'properties'}{' '}
                  found
                </span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A]">

                <option value="smart">Smart Ranking</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {filtersOpen &&
            <div className="lg:hidden bg-white rounded-xl border border-[#E5E7EB] p-5 mb-5 animate-slide-down">
                <FilterPanel />
              </div>
            }

            {filteredProperties.length > 0 ?
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProperties.map((property) =>
              <PropertyCard
                key={property.id}
                property={property}
                agent={getAgent(property.agentId)} />

              )}
              </div> :

            <div className="text-center py-20">
                <div className="w-16 h-16 bg-[#E8F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FilterIcon size={28} className="text-[#1B6B3A]" />
                </div>
                <h3 className="font-bold text-[#111827] mb-2">
                  No properties found
                </h3>
                <p className="text-[#6B7280] text-sm mb-4">
                  Try adjusting your filters.
                </p>
                <button
                onClick={clearFilters}
                className="btn-outline text-sm py-2">

                  Clear Filters
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}