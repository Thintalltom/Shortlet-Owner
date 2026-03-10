import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingIcon,
  MapPinIcon,
  ZapIcon,
  AlertCircleIcon } from
'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { boostProperty, updateBookingStatus } from '../../store/propertiesSlice';
export function AgentProperties() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const properties = useAppSelector((s) => s.properties.list);
  const commissions = useAppSelector((s) => s.bookings.commissions);
  const [boostingId, setBoostingId] = useState<string | null>(null);
  const myProperties = properties.filter(
    (p) => p.agentId === currentUser?.id && p.status === 'active'
  );
  const myCommissions = commissions.filter((c) => c.payerId === currentUser?.id);
  const hasUnpaidCommissions = myCommissions.some((c) => c.status === 'pending');
  const limitReached = myProperties.length >= 3 && hasUnpaidCommissions;
  const now = new Date();
  const handleBoost = async (propertyId: string) => {
    setBoostingId(propertyId);
    await new Promise((r) => setTimeout(r, 800));
    dispatch(
      boostProperty({
        id: propertyId,
        days: 7
      })
    );
    setBoostingId(null);
  };
  const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(price);
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">My Properties</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          {myProperties.length} propert{myProperties.length !== 1 ? 'ies' : 'y'}{' '}
          assigned to you
        </p>
      </div>

      {limitReached &&
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircleIcon
          size={20}
          className="text-red-600 flex-shrink-0 mt-0.5" />

          <div>
            <h3 className="font-bold text-red-800">Management Limit Reached</h3>
            <p className="text-sm text-red-700 mt-1">
              You have reached the limit of 3 properties. To manage more, you
              must pay all pending commissions for your booked properties.
            </p>
            <Link
            to="/agent/commissions"
            className="text-sm font-semibold text-red-800 hover:underline mt-2 inline-block">

              Go to Commissions →
            </Link>
          </div>
        </div>
      }

      {myProperties.length === 0 ?
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
          <div className="w-16 h-16 bg-[#E8F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
            <BuildingIcon size={28} className="text-[#1B6B3A]" />
          </div>
          <h3 className="font-bold text-[#111827] mb-2">
            No assigned properties
          </h3>
          <p className="text-[#6B7280] text-sm mb-4">
            Apply to manage properties to see them here.
          </p>
          <Link
          to="/listings"
          className="btn-primary text-sm py-2.5 inline-flex">

            Browse Properties
          </Link>
        </div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myProperties.map((property) => {
          const isBoostedActive =
          property.boostedUntil && new Date(property.boostedUntil) > now;
          return (
            <div
              key={property.id}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover" />

                  <div className="absolute top-3 right-3 bg-[#1B6B3A] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    {formatPrice(property.price)}/night
                  </div>
                  {isBoostedActive &&
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <ZapIcon size={10} /> Boosted
                    </div>
                }
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#111827] text-sm mb-1.5 line-clamp-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-3">
                    <MapPinIcon size={12} className="text-[#1B6B3A]" />{' '}
                    {property.location}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <select
                    value={property.bookingStatus}
                    onChange={(e) =>
                    dispatch(
                      updateBookingStatus({
                        id: property.id,
                        status: e.target.value as any
                      })
                    )
                    }
                    className={`text-xs font-semibold px-2 py-1 rounded-lg border w-full ${property.bookingStatus === 'available' ? 'bg-green-50 text-[#10B981] border-green-200' : property.bookingStatus === 'booked' ? 'bg-red-50 text-[#EF4444] border-red-200' : 'bg-gray-100 text-[#6B7280] border-gray-200'}`}>

                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Link
                    to={`/property/${property.id}`}
                    className="flex-1 text-center text-sm font-medium text-[#1B6B3A] border border-[#1B6B3A] hover:bg-[#E8F5EE] py-2 rounded-lg transition-colors">

                      View
                    </Link>
                    {!isBoostedActive &&
                  <button
                    onClick={() => handleBoost(property.id)}
                    disabled={boostingId === property.id}
                    className="flex items-center gap-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-2 rounded-lg font-medium transition-colors disabled:opacity-60">

                        <ZapIcon size={12} />{' '}
                        {boostingId === property.id ? '...' : 'Boost'}
                      </button>
                  }
                  </div>
                </div>
              </div>);

        })}
        </div>
      }
    </div>);

}