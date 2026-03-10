import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangleIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateProperty } from '../../store/propertiesSlice';
export function AdminProperties() {
  const dispatch = useAppDispatch();
  const properties = useAppSelector((s) => s.properties.list);
  const users = useAppSelector((s) => s.auth.users);
  const [filter, setFilter] = useState<'all' | 'reported' | 'inactive'>('all');
  const filteredProperties = properties.filter((p) => {
    if (filter === 'reported') return p.isReported;
    if (filter === 'inactive') return p.status === 'inactive';
    return true;
  });
  const handleDeactivate = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    dispatch(
      updateProperty({
        id,
        updates: {
          status: newStatus
        }
      })
    );
  };
  const getUserName = (id?: string) =>
  users.find((u) => u.id === id)?.name || 'Unknown';
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">
          Property Management
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Review and moderate listings
        </p>
      </div>

      <div className="flex gap-2 border-b border-[#E5E7EB] pb-4">
        {['all', 'reported', 'inactive'].map((f) =>
        <button
          key={f}
          onClick={() => setFilter(f as any)}
          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-[#1B6B3A] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'}`}>

            {f}{' '}
            {f === 'reported' && properties.some((p) => p.isReported) &&
          <span className="ml-1 text-red-300">•</span>
          }
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Property
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Owner / Agent
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredProperties.map((property) =>
              <tr
                key={property.id}
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
                        <div className="text-xs text-[#6B7280] mt-0.5">
                          ₦{property.price.toLocaleString()}/night
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs">
                      <span className="text-[#6B7280]">O:</span>{' '}
                      <span className="font-medium">
                        {getUserName(property.ownerId)}
                      </span>
                    </div>
                    {property.agentId &&
                  <div className="text-xs mt-0.5">
                        <span className="text-[#6B7280]">A:</span>{' '}
                        <span className="font-medium">
                          {getUserName(property.agentId)}
                        </span>
                      </div>
                  }
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${property.status === 'active' ? 'bg-green-50 text-[#10B981]' : 'bg-gray-100 text-[#6B7280]'}`}>

                        {property.status}
                      </span>
                      {property.isReported &&
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#EF4444]">
                          <AlertTriangleIcon size={12} /> Reported
                        </span>
                    }
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                      to={`/property/${property.id}`}
                      className="text-xs text-[#1B6B3A] font-semibold hover:underline">

                        View
                      </Link>
                      <button
                      onClick={() =>
                      handleDeactivate(property.id, property.status)
                      }
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${property.status === 'active' ? 'bg-red-50 text-[#EF4444] hover:bg-red-100' : 'bg-green-50 text-[#10B981] hover:bg-green-100'}`}>

                        {property.status === 'active' ?
                      'Deactivate' :
                      'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}