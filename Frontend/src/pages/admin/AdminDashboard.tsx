import React from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  BuildingIcon,
  CalendarIcon,
  CreditCardIcon } from
'lucide-react';
import { useAppSelector } from '../../store';
export function AdminDashboard() {
  const users = useAppSelector((s) => s.auth.users);
  const properties = useAppSelector((s) => s.properties.list);
  const bookings = useAppSelector((s) => s.bookings.bookings);
  const commissions = useAppSelector((s) => s.bookings.commissions);
  const owners = users.filter((u) => u.role === 'owner');
  const agents = users.filter((u) => u.role === 'agent');
  const guests = users.filter((u) => u.role === 'user');
  const pendingCommissions = commissions.filter((c) => c.status === 'pending');
  const totalPendingAmount = pendingCommissions.reduce(
    (sum, c) => sum + c.amount,
    0
  );
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Admin Dashboard</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Platform overview and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
        {
          icon: UsersIcon,
          value: users.length,
          label: 'Total Users',
          color: 'bg-blue-50',
          iconColor: 'text-blue-600'
        },
        {
          icon: BuildingIcon,
          value: properties.length,
          label: 'Total Properties',
          color: 'bg-[#E8F5EE]',
          iconColor: 'text-[#1B6B3A]'
        },
        {
          icon: CalendarIcon,
          value: bookings.length,
          label: 'Total Bookings',
          color: 'bg-purple-50',
          iconColor: 'text-purple-600'
        },
        {
          icon: CreditCardIcon,
          value: `₦${totalPendingAmount.toLocaleString()}`,
          label: 'Pending Commissions',
          color: 'bg-amber-50',
          iconColor: 'text-amber-600'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="font-bold text-[#111827] mb-4">User Breakdown</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Owners</span>
              <span className="font-bold text-[#111827]">{owners.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Agents</span>
              <span className="font-bold text-[#111827]">{agents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Guests</span>
              <span className="font-bold text-[#111827]">{guests.length}</span>
            </div>
          </div>
          <Link
            to="/admin-x7k9/users"
            className="btn-outline w-full justify-center mt-6 py-2">

            Manage Users
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="font-bold text-[#111827] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin-x7k9/properties"
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:border-[#1B6B3A] transition-colors group">

              <div className="flex items-center gap-3">
                <BuildingIcon
                  size={18}
                  className="text-[#6B7280] group-hover:text-[#1B6B3A]" />

                <span className="font-medium text-[#111827]">
                  Review Properties
                </span>
              </div>
            </Link>
            <Link
              to="/admin-x7k9/commissions"
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] hover:border-[#F59E0B] transition-colors group">

              <div className="flex items-center gap-3">
                <CreditCardIcon
                  size={18}
                  className="text-[#6B7280] group-hover:text-[#F59E0B]" />

                <span className="font-medium text-[#111827]">
                  Process Commissions
                </span>
              </div>
              {pendingCommissions.length > 0 &&
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                  {pendingCommissions.length} pending
                </span>
              }
            </Link>
          </div>
        </div>
      </div>
    </div>);

}