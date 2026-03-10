import React, { useState } from 'react';
import {
  CreditCardIcon,
  CheckCircleIcon,
  AlertTriangleIcon } from
'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { payCommission } from '../../store/bookingsSlice';
export function OwnerCommissions() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const commissions = useAppSelector((s) => s.bookings.commissions);
  const properties = useAppSelector((s) => s.properties.list);
  const [payingId, setPayingId] = useState<string | null>(null);
  const myCommissions = commissions.filter((c) => c.payerId === currentUser?.id);
  const pendingCommissions = myCommissions.filter((c) => c.status === 'pending');
  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.amount, 0);
  const handlePay = async (id: string) => {
    setPayingId(id);
    await new Promise((r) => setTimeout(r, 1500));
    dispatch(payCommission(id));
    setPayingId(null);
  };
  const getPropertyName = (id: string) =>
  properties.find((p) => p.id === id)?.title || 'Unknown Property';
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Commissions</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Manage your 3% platform fees for successful bookings
        </p>
      </div>

      {pendingCommissions.length > 0 &&
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
          <AlertTriangleIcon
          size={20}
          className="text-amber-600 flex-shrink-0 mt-0.5" />

          <div>
            <h3 className="font-bold text-amber-800">Action Required</h3>
            <p className="text-sm text-amber-700 mt-1">
              You have ₦{totalPending.toLocaleString()} in pending commissions.
              Please pay to avoid posting restrictions.
            </p>
          </div>
        </div>
      }

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Property
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Date
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Amount
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {myCommissions.length === 0 ?
              <tr>
                  <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-[#6B7280]">

                    No commissions yet.
                  </td>
                </tr> :

              [...myCommissions].
              sort(
                (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              ).
              map((comm) =>
              <tr
                key={comm.id}
                className="hover:bg-[#F8FAFC] transition-colors">

                      <td className="px-5 py-4 font-medium text-[#111827] max-w-[200px] truncate">
                        {getPropertyName(comm.propertyId)}
                      </td>
                      <td className="px-5 py-4 text-[#6B7280]">
                        {new Date(comm.createdAt).toLocaleDateString()}
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
                        {comm.status === 'pending' ?
                  <button
                    onClick={() => handlePay(comm.id)}
                    disabled={payingId === comm.id}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-[#1B6B3A] text-white px-3 py-1.5 rounded-lg hover:bg-[#145230] transition-colors disabled:opacity-60">

                            <CreditCardIcon size={14} />{' '}
                            {payingId === comm.id ? 'Processing...' : 'Pay Now'}
                          </button> :

                  <span className="flex items-center gap-1 text-xs font-semibold text-[#10B981]">
                            <CheckCircleIcon size={14} /> Paid
                          </span>
                  }
                      </td>
                    </tr>
              )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}