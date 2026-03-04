import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon } from 'lucide-react';
import { useAppSelector } from '../../store';
export function AgentApplications() {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const applications = useAppSelector((s) => s.applications.list);
  const properties = useAppSelector((s) => s.properties.list);
  const myApplications = applications.
  filter((a) => a.agentId === currentUser?.id).
  sort(
    (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(price);
  const getStatusBadge = (status: string) => {
    if (status === 'approved')
    return (
      <span className="text-xs font-semibold text-[#10B981] bg-green-50 px-2.5 py-1 rounded-full">
          Approved
        </span>);

    if (status === 'rejected')
    return (
      <span className="text-xs font-semibold text-[#EF4444] bg-red-50 px-2.5 py-1 rounded-full">
          Rejected
        </span>);

    return (
      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
        Pending
      </span>);

  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">My Applications</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          {myApplications.length} total application
          {myApplications.length !== 1 ? 's' : ''}
        </p>
      </div>

      {myApplications.length === 0 ?
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
          <div className="w-16 h-16 bg-[#E8F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPinIcon size={28} className="text-[#1B6B3A]" />
          </div>
          <h3 className="font-bold text-[#111827] mb-2">No applications yet</h3>
          <p className="text-[#6B7280] text-sm mb-4">
            Browse properties and apply to manage them.
          </p>
          <Link
          to="/listings"
          className="btn-primary text-sm py-2.5 inline-flex">

            Browse Properties
          </Link>
        </div> :

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <tr>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                    Property
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280] hidden sm:table-cell">
                    Price
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280] hidden md:table-cell">
                    Date Applied
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                    Message
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {myApplications.map((app) => {
                const property = properties.find(
                  (p) => p.id === app.propertyId
                );
                if (!property) return null;
                return (
                  <tr
                    key={app.id}
                    className="hover:bg-[#F8FAFC] transition-colors">

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-12 h-9 rounded-lg object-cover flex-shrink-0" />

                          <div>
                            <div className="font-medium text-[#111827] line-clamp-1">
                              {property.title}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-0.5">
                              <MapPinIcon size={11} /> {property.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-[#1B6B3A] hidden sm:table-cell">
                        {formatPrice(property.price)}/night
                      </td>
                      <td className="px-5 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-5 py-4 text-[#6B7280] hidden md:table-cell">
                        {new Date(app.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-xs text-[#6B7280] line-clamp-2 italic">
                          "{app.message}"
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                        to={`/property/${property.id}`}
                        className="text-xs text-[#1B6B3A] hover:underline font-medium">

                          View
                        </Link>
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>);

}