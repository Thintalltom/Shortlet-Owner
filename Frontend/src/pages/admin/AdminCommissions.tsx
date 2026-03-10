import React from 'react';
import { CheckCircleIcon, ClockIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { payCommission } from '../../store/bookingsSlice';
export function AdminCommissions() {
  const dispatch = useAppDispatch();
  const commissions = useAppSelector((s) => s.bookings.commissions);
  const properties = useAppSelector((s) => s.properties.list);
  const users = useAppSelector((s) => s.auth.users);
  const pendingCommissions = commissions.filter((c) => c.status === 'pending');
  const paidCommissions = commissions.filter((c) => c.status === 'paid');
  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.amount, 0);
  const totalPaid = paidCommissions.reduce((sum, c) => sum + c.amount, 0);
  const handleMarkPaid = (id: string) => {
    if (window.confirm('Mark this commission as paid?')) {
      dispatch(payCommission(id));
    }
  };
  const getPropertyName = (id: string) =>
  properties.find((p) => p.id === id)?.title || 'Unknown Property';
  const getUserName = (id: string) =>
  users.find((u) => u.id === id)?.name || 'Unknown User';
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Commissions</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Track 3% platform fees from bookings
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#6B7280]">
              Pending Collection
            </span>
            <ClockIcon size={20} className="text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-[#111827]">
            ₦{totalPending.toLocaleString()}
          </span>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#6B7280]">
              Total Collected
            </span>
            <CheckCircleIcon size={20} className="text-[#10B981]" />
          </div>
          <span className="text-2xl font-bold text-[#111827]">
            ₦{totalPaid.toLocaleString()}
          </span>
        </div>
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
                  Payer
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Amount (3%)
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
              {[...commissions].
              sort(
                (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              ).
              map((comm) =>
              <tr
                key={comm.id}
                className="hover:bg-[#F8FAFC] transition-colors">

                    <td className="px-5 py-4">
                      <div className="font-medium text-[#111827] line-clamp-1 max-w-[200px]">
                        {getPropertyName(comm.propertyId)}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {new Date(comm.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {getUserName(comm.payerId)}
                    </td>
                    <td className="px-5 py-4 font-bold text-[#1B6B3A]">
                      ₦{comm.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${comm.status === 'paid' ? 'bg-green-50 text-[#10B981]' : 'bg-amber-50 text-amber-600'}`}>

                        {comm.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {comm.status === 'pending' &&
                  <button
                    onClick={() => handleMarkPaid(comm.id)}
                    className="text-xs font-semibold bg-[#1B6B3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#145230] transition-colors">

                          Mark Paid
                        </button>
                  }
                    </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}