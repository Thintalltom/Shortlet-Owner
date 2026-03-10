import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  HeartIcon,
  MapPinIcon,
  ArrowRightIcon } from
'lucide-react';
import { useAppSelector } from '../../store';
export function UserDashboard() {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const bookings = useAppSelector((s) => s.bookings.bookings);
  const properties = useAppSelector((s) => s.properties.list);
  const savedProperties = useAppSelector((s) => s.savedProperties.list);
  const myBookings = bookings.filter((b) => b.userId === currentUser?.id);
  const activeBookings = myBookings.filter((b) => b.status === 'confirmed');
  const mySaved = savedProperties.filter((s) => s.userId === currentUser?.id);
  const recentBookings = [...myBookings].
  sort(
    (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).
  slice(0, 3);
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">
          Welcome back, {currentUser?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">Ready for your next trip?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
        {
          icon: CalendarIcon,
          value: myBookings.length,
          label: 'Total Bookings',
          color: 'bg-blue-50',
          iconColor: 'text-blue-600'
        },
        {
          icon: CalendarIcon,
          value: activeBookings.length,
          label: 'Active Bookings',
          color: 'bg-[#E8F5EE]',
          iconColor: 'text-[#1B6B3A]'
        },
        {
          icon: HeartIcon,
          value: mySaved.length,
          label: 'Saved Properties',
          color: 'bg-red-50',
          iconColor: 'text-red-600'
        }].
        map(({ icon: Icon, value, label, color, iconColor }) =>
        <div
          key={label}
          className="bg-white rounded-xl border border-[#E5E7EB] p-5">

            <div className="flex items-center justify-between mb-3">
              <div
              className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>

                <Icon size={20} className={iconColor} />
              </div>
              <span className="text-2xl font-bold text-[#111827]">{value}</span>
            </div>
            <div className="text-sm font-medium text-[#6B7280]">{label}</div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-[#111827]">Recent Bookings</h2>
          <Link
            to="/user/bookings"
            className="text-sm text-[#1B6B3A] font-semibold hover:underline flex items-center gap-1">

            View all <ArrowRightIcon size={14} />
          </Link>
        </div>

        {recentBookings.length === 0 ?
        <div className="p-8 text-center">
            <CalendarIcon size={32} className="text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-[#6B7280] text-sm">No bookings yet.</p>
            <Link
            to="/listings"
            className="btn-primary text-sm py-2 mt-4 inline-flex">

              Browse Properties
            </Link>
          </div> :

        <div className="divide-y divide-[#E5E7EB]">
            {recentBookings.map((booking) => {
            const property = properties.find(
              (p) => p.id === booking.propertyId
            );
            if (!property) return null;
            return (
              <div
                key={booking.id}
                className="flex items-center gap-4 px-5 py-4">

                  <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#111827] text-sm truncate">
                      {property.title}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-0.5">
                      <MapPinIcon size={11} /> {property.location}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full inline-block ${booking.status === 'confirmed' ? 'bg-green-50 text-[#10B981]' : booking.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-[#EF4444]'}`}>

                      {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                    </div>
                    <div className="text-xs text-[#6B7280] mt-1">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </div>
                  </div>
                </div>);

          })}
          </div>
        }
      </div>
    </div>);

}