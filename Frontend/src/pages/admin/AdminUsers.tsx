import React, { useState } from 'react';
import { ShieldAlertIcon, ShieldCheckIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { blockUser, unblockUser } from '../../store/authSlice';
export function AdminUsers() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.auth.users);
  const [filter, setFilter] = useState<'all' | 'owner' | 'agent' | 'user'>(
    'all'
  );
  const filteredUsers = users.filter(
    (u) => u.role !== 'admin' && (filter === 'all' || u.role === filter)
  );
  const handleBlockToggle = (userId: string, isBlocked: boolean) => {
    if (isBlocked) {
      dispatch(unblockUser(userId));
    } else {
      if (
      window.confirm(
        'Are you sure you want to block this user? They will not be able to log in.'
      ))
      {
        dispatch(blockUser(userId));
      }
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">User Management</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Manage and moderate platform users
        </p>
      </div>

      <div className="flex gap-2 border-b border-[#E5E7EB] pb-4">
        {['all', 'owner', 'agent', 'user'].map((f) =>
        <button
          key={f}
          onClick={() => setFilter(f as any)}
          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-[#1B6B3A] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'}`}>

            {f}
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  User
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Role
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Joined
                </th>
                <th className="text-left px-5 py-3.5 font-semibold text-[#6B7280]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredUsers.map((user) =>
              <tr
                key={user.id}
                className="hover:bg-[#F8FAFC] transition-colors">

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                      src={
                      user.profileImage ||
                      `https://ui-avatars.com/api/?name=${user.name}`
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover" />

                      <div>
                        <div className="font-medium text-[#111827]">
                          {user.name}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${user.role === 'owner' ? 'bg-[#E8F5EE] text-[#1B6B3A]' : user.role === 'agent' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>

                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {user.isBlocked ?
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#EF4444]">
                        <ShieldAlertIcon size={14} /> Blocked
                      </span> :

                  <span className="flex items-center gap-1 text-xs font-semibold text-[#10B981]">
                        <ShieldCheckIcon size={14} /> Active
                      </span>
                  }
                  </td>
                  <td className="px-5 py-4 text-[#6B7280]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <button
                    onClick={() =>
                    handleBlockToggle(user.id, !!user.isBlocked)
                    }
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${user.isBlocked ? 'bg-gray-100 text-[#111827] hover:bg-gray-200' : 'bg-red-50 text-[#EF4444] hover:bg-red-100'}`}>

                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

}