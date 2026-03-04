import React, { useState } from 'react';
import { SaveIcon } from 'lucide-react';
import { TrustedBadge } from '../../components/TrustedBadge';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateCurrentUser } from '../../store/authSlice';
export function AgentProfile() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    whatsapp: currentUser?.whatsapp || '',
    bio: currentUser?.bio || ''
  });
  const [saved, setSaved] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 600));
    dispatch(updateCurrentUser(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">My Profile</h1>
        <p className="text-[#6B7280] text-sm mt-1">Manage your agent profile</p>
      </div>
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#E5E7EB]">
          <img
            src={currentUser?.profileImage || 'https://i.pravatar.cc/150?img=1'}
            alt={currentUser?.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-[#E5E7EB]" />

          <div>
            <div className="font-bold text-[#111827] text-lg">
              {currentUser?.name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge-agent text-xs">Agent</span>
              {currentUser?.trustedStatus === 'active' &&
              <TrustedBadge size="sm" />
              }
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
          {
            id: 'name',
            label: 'Full Name',
            type: 'text'
          },
          {
            id: 'email',
            label: 'Email Address',
            type: 'email'
          },
          {
            id: 'phone',
            label: 'Phone Number',
            type: 'tel'
          },
          {
            id: 'whatsapp',
            label: 'WhatsApp Number',
            type: 'tel'
          }].
          map((field) =>
          <div key={field.id}>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                {field.label}
              </label>
              <input
              type={field.type}
              value={form[field.id as keyof typeof form]}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                [field.id]: e.target.value
              }))
              }
              className="input-field" />

            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Bio{' '}
              <span className="text-[#6B7280] font-normal">
                (required for Trusted Badge)
              </span>
            </label>
            <textarea
              value={form.bio}
              onChange={(e) =>
              setForm((f) => ({
                ...f,
                bio: e.target.value
              }))
              }
              rows={4}
              placeholder="Tell property owners about your experience..."
              className="input-field resize-none" />

          </div>
          <button type="submit" className="btn-primary py-2.5">
            <SaveIcon size={16} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>);

}