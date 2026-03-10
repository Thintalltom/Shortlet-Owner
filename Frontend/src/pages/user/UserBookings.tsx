import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon } from 'lucide-react';
import { useAppSelector } from '../../store';
export function UserBookings() {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const bookings = useAppSelector((s) => s.bookings.bookings);
  const properties = useAppSelector((s) => s.properties.list);
  const myBookings = bookings.
  filter((b) => b.userId === currentUser?.id).
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
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">My Bookings</h1>
        <p className="text-[#6B7280] text-sm mt-1">History of your stays</p>
      </div>

      {myBookings.length === 0 ?
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
          <div className="w-16 h-16 bg-[#E8F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon size={28} className="text-[#1B6B3A]" />
          </div>
          <h3 className="font-bold text-[#111827] mb-2">No bookings yet</h3>
          <p className="text-[#6B7280] text-sm mb-4">
            You haven't booked any properties yet.
          </p>
          <Link
          to="/listings"
          className="btn-primary text-sm py-2.5 inline-flex">

            Browse Properties
          </Link>
        </div> :

      <div className="space-y-4">
          {myBookings.map((booking) => {
          const property = properties.find((p) => p.id === booking.propertyId);
          if (!property) return null;
          return (
            <div
              key={booking.id}
              className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex flex-col sm:flex-row gap-5">

                <img
                src={property.images[0]}
                alt={property.title}
                className="w-full sm:w-48 h-32 rounded-lg object-cover flex-shrink-0" />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-[#111827] text-lg line-clamp-1">
                        {property.title}
                      </h3>
                      <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${booking.status === 'confirmed' ? 'bg-green-50 text-[#10B981]' : booking.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-[#EF4444]'}`}>

                        {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#6B7280] mb-3">
                      <MapPinIcon size={14} className="text-[#1B6B3A]" />{' '}
                      {property.location}
                    </div>
                    <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] p-3 rounded-lg border border-[#E5E7EB]">
                      <div>
                        <div className="text-xs text-[#6B7280] uppercase font-semibold">
                          Check-in
                        </div>
                        <div className="text-sm font-medium text-[#111827]">
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280] uppercase font-semibold">
                          Check-out
                        </div>
                        <div className="text-sm font-medium text-[#111827]">
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="font-bold text-[#1B6B3A]">
                      {formatPrice(booking.totalPrice)}
                    </div>
                    <Link
                    to={`/property/${property.id}`}
                    className="text-sm font-semibold text-[#1B6B3A] hover:underline">

                      View Property
                    </Link>
                  </div>
                </div>
              </div>);

        })}
        </div>
      }
    </div>);

}