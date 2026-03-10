import React from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingIcon,
  FileTextIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  BellIcon,
  CreditCardIcon } from
'lucide-react';
import { TrustedBadge } from '../../components/TrustedBadge';
import { useAppSelector } from '../../store';
import { mockUsers } from '../../data/mockData';
export function AgentDashboard() {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const applications = useAppSelector((s) => s.applications.list);
  const properties = useAppSelector((s) => s.properties.list);
  const bookings = useAppSelector((s) => s.bookings.bookings);
  const commissions = useAppSelector((s) => s.bookings.commissions);
  const myApplications = applications.filter(
    (a) => a.agentId === currentUser?.id
  );
  const pendingApps = myApplications.filter((a) => a.status === 'pending');
  const approvedApps = myApplications.filter((a) => a.status === 'approved');
  const managedProperties = properties.filter(
    (p) => p.agentId === currentUser?.id
  );
  const isTrusted = currentUser?.trustedStatus === 'active';
  const isPending = currentUser?.trustedStatus === 'pending';
  const managedPropertyIds = managedProperties.map((p) => p.id);
  const recentBookings = bookings.
  filter((b) => managedPropertyIds.includes(b.propertyId)).
  sort(
    (a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).
  slice(0, 3);
  const myCommissions = commissions.filter((c) => c.payerId === currentUser?.id);
  const pendingCommissions = myCommissions.filter((c) => c.status === 'pending');
  const totalPendingCommissions = pendingCommissions.reduce(
    (sum, c) => sum + c.amount,
    0
  );
  // Profile completion checklist
  const profileChecks = [
  {
    label: 'Profile photo uploaded',
    done: !!currentUser?.profileImage
  },
  {
    label: 'Bio written',
    done: !!currentUser?.bio && currentUser.bio.length > 10
  },
  {
    label: 'WhatsApp number added',
    done: !!currentUser?.whatsapp
  },
  {
    label: 'Phone number verified',
    done: !!currentUser?.phone
  },
  {
    label: 'Trusted Agent badge',
    done: isTrusted
  }];

  const completedChecks = profileChecks.filter((c) => c.done).length;
  const completionPercent = Math.round(
    completedChecks / profileChecks.length * 100
  );
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">
          Welcome back, {currentUser?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Here's your agent overview
        </p>
      </div>

      {totalPendingCommissions > 0 &&
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCardIcon size={20} className="text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">
                Pending Commissions: ₦{totalPendingCommissions.toLocaleString()}
              </p>
              <p className="text-xs text-amber-700">
                Please pay your pending commissions to avoid management
                restrictions.
              </p>
            </div>
          </div>
          <Link
          to="/agent/commissions"
          className="btn-accent text-xs py-2 px-4 whitespace-nowrap">

            Pay Now
          </Link>
        </div>
      }

      {/* Trusted Status Banner */}
      {isTrusted ?
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <StarIcon size={20} className="text-amber-600 fill-amber-500" />
          </div>
          <div>
            <div className="font-semibold text-amber-800 flex items-center gap-2">
              <TrustedBadge size="sm" /> You are a Trusted Agent!
            </div>
            <p className="text-xs text-amber-700 mt-0.5">
              You appear first in owner application lists and have unlimited
              applications.
            </p>
          </div>
        </div> :

      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E8F5EE] rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon size={20} className="text-[#1B6B3A]" />
            </div>
            <div>
              <div className="font-semibold text-[#111827] text-sm">
                {isPending ?
              'Verification Under Review' :
              'Get Trusted Agent Badge'}
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {isPending ?
              'Your application is being reviewed.' :
              'Pay ₦1,000 to get verified and appear first in listings.'}
              </p>
            </div>
          </div>
          {!isPending &&
        <Link
          to="/agent/verification"
          className="btn-accent text-sm py-2 flex-shrink-0">

              Get Badge
            </Link>
        }
        </div>
      }

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
        {
          icon: BuildingIcon,
          value: managedProperties.length,
          label: 'Managed Properties',
          color: 'bg-[#E8F5EE]',
          iconColor: 'text-[#1B6B3A]'
        },
        {
          icon: FileTextIcon,
          value: pendingApps.length,
          label: 'Pending Applications',
          color: 'bg-amber-50',
          iconColor: 'text-amber-600'
        },
        {
          icon: ShieldCheckIcon,
          value: approvedApps.length,
          label: 'Approved Applications',
          color: 'bg-blue-50',
          iconColor: 'text-blue-600'
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
        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="font-bold text-[#111827]">Recent Applications</h2>
            <Link
              to="/agent/applications"
              className="text-sm text-[#1B6B3A] font-semibold hover:underline flex items-center gap-1">

              View all <ArrowRightIcon size={14} />
            </Link>
          </div>
          {myApplications.length === 0 ?
          <div className="p-8 text-center">
              <FileTextIcon size={28} className="text-[#E5E7EB] mx-auto mb-3" />
              <p className="text-[#6B7280] text-sm">No applications yet.</p>
              <Link
              to="/listings"
              className="btn-primary text-sm py-2 mt-4 inline-flex">

                Browse Properties
              </Link>
            </div> :

          <div className="divide-y divide-[#E5E7EB]">
              {myApplications.slice(0, 4).map((app) => {
              const property = properties.find((p) => p.id === app.propertyId);
              if (!property) return null;
              return (
                <div
                  key={app.id}
                  className="flex items-center gap-4 px-5 py-4">

                    <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-12 h-9 rounded-lg object-cover flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#111827] text-sm truncate">
                        {property.title}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-0.5">
                        {property.location}
                      </div>
                    </div>
                    <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${app.status === 'approved' ? 'text-[#10B981] bg-green-50' : app.status === 'rejected' ? 'text-[#EF4444] bg-red-50' : 'text-amber-600 bg-amber-50'}`}>

                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>);

            })}
            </div>
          }
        </div>

        <div className="space-y-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
              <h2 className="font-bold text-[#111827]">Recent Bookings</h2>
            </div>
            {recentBookings.length === 0 ?
            <div className="p-8 text-center">
                <BellIcon size={32} className="text-[#E5E7EB] mx-auto mb-3" />
                <p className="text-[#6B7280] text-sm">No bookings yet</p>
              </div> :

            <div className="divide-y divide-[#E5E7EB]">
                {recentBookings.map((booking) => {
                const property = properties.find(
                  (p) => p.id === booking.propertyId
                );
                const user = mockUsers.find((u) => u.id === booking.userId);
                return (
                  <div key={booking.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-1">
                          <BellIcon size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-[#111827]">
                            <span className="font-semibold">{user?.name}</span>{' '}
                            confirmed a booking for{' '}
                            <span className="font-semibold">
                              {property?.title}
                            </span>
                          </p>
                          <p className="text-xs text-[#6B7280] mt-1">
                            {new Date(booking.createdAt).toLocaleDateString()} •
                            ₦{booking.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>);

              })}
              </div>
            }
          </div>

          {/* Profile Completion Checklist */}
          {!isTrusted &&
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#111827]">Profile Completion</h2>
                <span
                className={`text-sm font-bold ${completionPercent === 100 ? 'text-[#10B981]' : 'text-[#F59E0B]'}`}>

                  {completionPercent}%
                </span>
              </div>
              <div className="w-full bg-[#E5E7EB] rounded-full h-2 mb-4">
                <div
                className={`h-2 rounded-full transition-all duration-500 ${completionPercent === 100 ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}
                style={{
                  width: `${completionPercent}%`
                }} />

              </div>
              <div className="space-y-2.5">
                {profileChecks.map((check) =>
              <div key={check.label} className="flex items-center gap-3">
                    {check.done ?
                <CheckCircleIcon
                  size={17}
                  className="text-[#10B981] flex-shrink-0" /> :


                <XCircleIcon
                  size={17}
                  className="text-[#E5E7EB] flex-shrink-0" />

                }
                    <span
                  className={`text-sm ${check.done ? 'text-[#6B7280] line-through' : 'text-[#111827]'}`}>

                      {check.label}
                    </span>
                    {!check.done && check.label === 'Trusted Agent badge' &&
                <Link
                  to="/agent/verification"
                  className="ml-auto text-xs text-[#1B6B3A] font-semibold hover:underline">

                        Get badge →
                      </Link>
                }
                    {!check.done && check.label !== 'Trusted Agent badge' &&
                <Link
                  to="/agent/profile"
                  className="ml-auto text-xs text-[#1B6B3A] font-semibold hover:underline">

                        Update →
                      </Link>
                }
                  </div>
              )}
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}