import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPinIcon,
  PhoneIcon,
  MessageCircleIcon,
  BuildingIcon,
  StarIcon,
  CalendarIcon } from
'lucide-react';
import { TrustedBadge } from '../components/TrustedBadge';
import { PropertyCard } from '../components/PropertyCard';
import { useAppSelector } from '../store';
import { mockUsers } from '../data/mockData';
export function AgentProfilePage() {
  const { id } = useParams<{
    id: string;
  }>();
  const properties = useAppSelector((s) => s.properties.list);
  const applications = useAppSelector((s) => s.applications.list);
  const agent = mockUsers.find((u) => u.id === id && u.role === 'agent');
  const managedProperties = properties.filter(
    (p) => p.agentId === id && p.status === 'active'
  );
  const approvedApps = applications.filter(
    (a) => a.agentId === id && a.status === 'approved'
  );
  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#111827] mb-2">
            Agent not found
          </h2>
          <Link to="/listings" className="btn-primary">
            Browse Listings
          </Link>
        </div>
      </div>);

  }
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-gradient-to-br from-[#1B6B3A] to-[#145230] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={agent.profileImage || 'https://i.pravatar.cc/150?img=1'}
              alt={agent.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />

            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  Agent
                </span>
                {agent.trustedStatus === 'active' && <TrustedBadge size="sm" />}
              </div>
              {agent.bio &&
              <p className="text-white/80 text-sm mt-3 max-w-lg leading-relaxed">
                  {agent.bio}
                </p>
              }
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <BuildingIcon size={15} />
                  {managedProperties.length} properties managed
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <StarIcon
                    size={15}
                    className="fill-[#F59E0B] text-[#F59E0B]" />

                  {approvedApps.length} approved applications
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <CalendarIcon size={15} />
                  Member since{' '}
                  {new Date(agent.createdAt).toLocaleDateString('en-NG', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Contact */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mb-8 flex flex-wrap gap-3">
          <a href={`tel:${agent.phone}`} className="btn-primary py-2.5 text-sm">
            <PhoneIcon size={16} /> Call {agent.name.split(' ')[0]}
          </a>
          {agent.whatsapp &&
          <a
            href={`https://wa.me/${agent.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-colors">

              <MessageCircleIcon size={16} /> WhatsApp
            </a>
          }
        </div>

        {/* Properties */}
        <div>
          <h2 className="text-xl font-bold text-[#111827] mb-5">
            Properties Managed by {agent.name.split(' ')[0]}
          </h2>
          {managedProperties.length === 0 ?
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-10 text-center">
              <BuildingIcon size={32} className="text-[#E5E7EB] mx-auto mb-3" />
              <p className="text-[#6B7280] text-sm">
                No active properties yet.
              </p>
            </div> :

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {managedProperties.map((property) =>
            <PropertyCard
              key={property.id}
              property={property}
              agent={agent} />

            )}
            </div>
          }
        </div>
      </div>
    </div>);

}