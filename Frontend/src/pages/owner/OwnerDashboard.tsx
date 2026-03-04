import React from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingIcon,
  UsersIcon,
  FileTextIcon,
  PlusIcon,
  ArrowRightIcon } from
'lucide-react';
import { useAppSelector } from '../../store';
import { mockUsers } from '../../data/mockData';
export function OwnerDashboard() {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const properties = useAppSelector((s) => s.properties.list);
  const applications = useAppSelector((s) => s.applications.list);
  const myProperties = properties.filter((p) => p.ownerId === currentUser?.id);
  const myPropertyIds = myProperties.map((p) => p.id);
  const myApplications = applications.filter((a) =>
  myPropertyIds.includes(a.propertyId)
  );
  const pendingApplications = myApplications.filter(
    (a) => a.status === 'pending'
  );
  const assignedAgents = myProperties.filter((p) => p.agentId).length;
  const recentProperties = myProperties.slice(0, 3);
  const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(price);
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">
            Welcome back, {currentUser?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Here's an overview of your properties
          </p>
        </div>
        <Link
          to="/owner/properties"
          className="btn-primary text-sm py-2.5 hidden sm:flex">

          <PlusIcon size={16} /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
        {
          icon: BuildingIcon,
          value: myProperties.length,
          label: 'Total Properties',
          color: 'bg-[#E8F5EE]',
          iconColor: 'text-[#1B6B3A]'
        },
        {
          icon: UsersIcon,
          value: assignedAgents,
          label: 'Assigned Agents',
          color: 'bg-blue-50',
          iconColor: 'text-blue-600'
        },
        {
          icon: FileTextIcon,
          value: pendingApplications.length,
          label: 'Pending Applications',
          color: 'bg-amber-50',
          iconColor: 'text-amber-600',
          action:
          pendingApplications.length > 0 ?
          '/owner/applications' :
          undefined
        }].
        map(({ icon: Icon, value, label, color, iconColor, action }) =>
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
            {action &&
          <Link
            to={action}
            className="text-xs text-[#1B6B3A] font-semibold mt-1 hover:underline block">

                Review now →
              </Link>
          }
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-bold text-[#111827]">Recent Properties</h2>
          <Link
            to="/owner/properties"
            className="text-sm text-[#1B6B3A] font-semibold hover:underline flex items-center gap-1">

            View all <ArrowRightIcon size={14} />
          </Link>
        </div>
        {recentProperties.length === 0 ?
        <div className="p-8 text-center">
            <BuildingIcon size={32} className="text-[#E5E7EB] mx-auto mb-3" />
            <p className="text-[#6B7280] text-sm">No properties yet</p>
            <Link
            to="/owner/properties"
            className="btn-primary text-sm py-2 mt-4 inline-flex">

              <PlusIcon size={15} /> Add Your First Property
            </Link>
          </div> :

        <div className="divide-y divide-[#E5E7EB]">
            {recentProperties.map((property) => {
            const agent = property.agentId ?
            mockUsers.find((u) => u.id === property.agentId) :
            undefined;
            return (
              <div
                key={property.id}
                className="flex items-center gap-4 px-5 py-4">

                  <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-14 h-10 rounded-lg object-cover flex-shrink-0" />

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#111827] text-sm truncate">
                      {property.title}
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5">
                      {property.location}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-[#1B6B3A]">
                      {formatPrice(property.price)}
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5">
                      {property.manageType === 'owner' ?
                    'Self-managed' :
                    agent ?
                    `Agent: ${agent.name.split(' ')[0]}` :
                    'No agent'}
                    </div>
                  </div>
                </div>);

          })}
          </div>
        }
      </div>

      <Link
        to="/owner/properties"
        className="sm:hidden w-full btn-primary justify-center py-3 flex">

        <PlusIcon size={16} /> Add New Property
      </Link>
    </div>);

}