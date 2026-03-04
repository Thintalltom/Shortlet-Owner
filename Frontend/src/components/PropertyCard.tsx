import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPinIcon,
  BedDoubleIcon,
  HeartIcon,
  StarIcon,
  ZapIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserIcon } from
'lucide-react';
import { Property, User } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { saveProperty, unsaveProperty } from '../store/savedPropertiesSlice';
interface PropertyCardProps {
  property: Property;
  agent?: User;
  showSave?: boolean;
}
function isBoosted(p: Property) {
  return p.boostedUntil && new Date(p.boostedUntil) > new Date();
}
function isFeaturedActive(p: Property) {
  return (
    p.isFeatured && p.featuredUntil && new Date(p.featuredUntil) > new Date());

}
export function PropertyCard({
  property,
  agent,
  showSave = true
}: PropertyCardProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const savedProperties = useAppSelector((s) => s.savedProperties.list);
  const isSaved = savedProperties.some(
    (s) => s.userId === currentUser?.id && s.propertyId === property.id
  );
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    if (isSaved) {
      dispatch(
        unsaveProperty({
          userId: currentUser.id,
          propertyId: property.id
        })
      );
    } else {
      dispatch(
        saveProperty({
          userId: currentUser.id,
          propertyId: property.id
        })
      );
    }
  };
  const displayPrice = property.publicPrice || property.price;
  const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(price);
  return (
    <Link
      to={`/property/${property.id}`}
      className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md hover:border-[#1B6B3A]/30 transition-all duration-200 block">

      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />


        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isBoosted(property) &&
          <span className="flex items-center gap-1 bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <ZapIcon size={10} /> Boosted
            </span>
          }
          {isFeaturedActive(property) &&
          <span className="flex items-center gap-1 bg-[#1B6B3A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <StarIcon size={10} className="fill-white" /> Featured
            </span>
          }
        </div>

        {/* Save button */}
        {showSave && currentUser &&
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}>

            <HeartIcon
            size={15}
            className={
            isSaved ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#6B7280]'
            } />

          </button>
        }

        {/* Views */}
        {property.viewsCount > 0 &&
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
            <EyeIcon size={10} /> {property.viewsCount}
          </div>
        }
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[#111827] text-sm leading-snug line-clamp-2 mb-2 group-hover:text-[#1B6B3A] transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-xs text-[#6B7280] mb-3">
          <MapPinIcon size={12} className="text-[#1B6B3A] flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <BedDoubleIcon size={13} className="text-[#1B6B3A]" />
            {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
          </div>
          <div className="text-right">
            <span className="font-bold text-[#1B6B3A] text-sm">
              {formatPrice(displayPrice)}
            </span>
            <span className="text-xs text-[#6B7280]">/night</span>
          </div>
        </div>

        {/* Managed By Tag */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-[#F3F4F6]">
          {property.manageType === 'owner' ?
          <span className="flex items-center gap-1 text-xs text-[#6B7280]">
              <UserIcon size={11} className="text-[#1B6B3A]" />
              Managed by Owner
            </span> :
          agent ?
          <span className="flex items-center gap-1 text-xs text-[#6B7280]">
              {agent.trustedStatus === 'active' ?
            <>
                  <ShieldCheckIcon size={11} className="text-[#F59E0B]" />
                  <span className="text-[#F59E0B] font-medium">
                    Trusted Agent
                  </span>
                </> :

            <>
                  <UserIcon size={11} className="text-blue-500" />
                  Managed by Agent
                </>
            }
            </span> :

          <span className="flex items-center gap-1 text-xs text-[#6B7280]">
              <UserIcon size={11} />
              Agent Needed
            </span>
          }
        </div>
      </div>
    </Link>);

}