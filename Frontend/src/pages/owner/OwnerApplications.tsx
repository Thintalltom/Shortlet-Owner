import React from 'react';
import { CheckIcon, XIcon, MapPinIcon } from 'lucide-react';
import { TrustedBadge } from '../../components/TrustedBadge';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  updateApplication,
  autoRejectOthers } from
'../../store/applicationsSlice';
import { updateProperty } from '../../store/propertiesSlice';
import { mockUsers } from '../../data/mockData';
export function OwnerApplications() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const properties = useAppSelector((s) => s.properties.list);
  const applications = useAppSelector((s) => s.applications.list);
  const myProperties = properties.filter(
    (p) => p.ownerId === currentUser?.id && p.manageType === 'agent'
  );
  const handleApprove = (
  applicationId: string,
  propertyId: string,
  agentId: string) =>
  {
    dispatch(
      updateApplication({
        id: applicationId,
        status: 'approved'
      })
    );
    dispatch(
      updateProperty({
        id: propertyId,
        updates: {
          agentId
        }
      })
    );
    dispatch(
      autoRejectOthers({
        propertyId,
        approvedId: applicationId
      })
    );
  };
  const handleReject = (applicationId: string) => {
    dispatch(
      updateApplication({
        id: applicationId,
        status: 'rejected'
      })
    );
  };
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
        <h1 className="text-2xl font-bold text-[#111827]">
          Agent Applications
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Review agents who want to manage your properties
        </p>
      </div>

      {myProperties.length === 0 ?
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
          <p className="text-[#6B7280] text-sm">
            No agent-managed properties yet.
          </p>
          <Link
          to="/owner/properties"
          className="btn-primary text-sm py-2 mt-4 inline-flex">

            Manage Properties
          </Link>
        </div> :

      <div className="space-y-6">
          {myProperties.map((property) => {
          const propertyApplications = applications.
          filter((a) => a.propertyId === property.id).
          sort((a, b) => {
            const agentA = mockUsers.find((u) => u.id === a.agentId);
            const agentB = mockUsers.find((u) => u.id === b.agentId);
            if (
            agentA?.trustedStatus === 'active' &&
            agentB?.trustedStatus !== 'active')

            return -1;
            if (
            agentB?.trustedStatus === 'active' &&
            agentA?.trustedStatus !== 'active')

            return 1;
            return 0;
          });
          return (
            <div
              key={property.id}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

                <div className="flex items-center gap-4 px-5 py-4 bg-[#F8FAFC] border-b border-[#E5E7EB]">
                  <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-14 h-10 rounded-lg object-cover" />

                  <div>
                    <div className="font-semibold text-[#111827] text-sm">
                      {property.title}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-0.5">
                      <MapPinIcon size={11} /> {property.location}
                    </div>
                  </div>
                  <span className="ml-auto text-xs text-[#6B7280]">
                    {propertyApplications.length} application
                    {propertyApplications.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {propertyApplications.length === 0 ?
              <div className="px-5 py-6 text-center text-sm text-[#6B7280]">
                    No applications yet for this property.
                  </div> :

              <div className="divide-y divide-[#E5E7EB]">
                    {propertyApplications.map((application) => {
                  const agent = mockUsers.find(
                    (u) => u.id === application.agentId
                  );
                  if (!agent) return null;
                  return (
                    <div key={application.id} className="p-5">
                          <div className="flex items-start gap-4">
                            <Link to={`/agent/${agent.id}`}>
                              <img
                            src={
                            agent.profileImage ||
                            'https://i.pravatar.cc/150?img=1'
                            }
                            alt={agent.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#E5E7EB] flex-shrink-0" />

                            </Link>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <Link
                              to={`/agent/${agent.id}`}
                              className="font-semibold text-[#111827] hover:text-[#1B6B3A]">

                                  {agent.name}
                                </Link>
                                {agent.trustedStatus === 'active' &&
                            <TrustedBadge size="sm" />
                            }
                                {getStatusBadge(application.status)}
                              </div>
                              <p className="text-sm text-[#6B7280] leading-relaxed mb-3">
                                "{application.message}"
                              </p>
                              {agent.bio &&
                          <p className="text-xs text-[#6B7280] italic mb-3">
                                  {agent.bio}
                                </p>
                          }
                              {application.status === 'pending' &&
                          <div className="flex gap-2">
                                  <button
                              onClick={() =>
                              handleApprove(
                                application.id,
                                property.id,
                                agent.id
                              )
                              }
                              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#1B6B3A] hover:bg-[#145230] px-4 py-2 rounded-lg transition-colors">

                                    <CheckIcon size={14} /> Approve
                                  </button>
                                  <button
                              onClick={() => handleReject(application.id)}
                              className="flex items-center gap-1.5 text-sm font-semibold text-[#EF4444] bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors">

                                    <XIcon size={14} /> Reject
                                  </button>
                                </div>
                          }
                            </div>
                          </div>
                        </div>);

                })}
                  </div>
              }
              </div>);

        })}
        </div>
      }
    </div>);

}