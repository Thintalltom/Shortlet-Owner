import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from 'lucide-react';
import { PropertyCard } from '../../components/PropertyCard';
import { useAppSelector } from '../../store';
import { mockUsers } from '../../data/mockData';
export function UserSaved() {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const properties = useAppSelector((s) => s.properties.list);
  const savedProperties = useAppSelector((s) => s.savedProperties.list);
  const mySavedIds = savedProperties.
  filter((s) => s.userId === currentUser?.id).
  map((s) => s.propertyId);
  const mySavedProperties = properties.filter((p) => mySavedIds.includes(p.id));
  const getAgent = (agentId?: string) =>
  agentId ? mockUsers.find((u) => u.id === agentId) : undefined;
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Saved Properties</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Properties you've bookmarked
        </p>
      </div>

      {mySavedProperties.length === 0 ?
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HeartIcon size={28} className="text-red-500" />
          </div>
          <h3 className="font-bold text-[#111827] mb-2">No saved properties</h3>
          <p className="text-[#6B7280] text-sm mb-4">
            Click the heart icon on properties you like to save them here.
          </p>
          <Link
          to="/listings"
          className="btn-primary text-sm py-2.5 inline-flex">

            Browse Properties
          </Link>
        </div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mySavedProperties.map((property) =>
        <PropertyCard
          key={property.id}
          property={property}
          agent={getAgent(property.agentId)} />

        )}
        </div>
      }
    </div>);

}