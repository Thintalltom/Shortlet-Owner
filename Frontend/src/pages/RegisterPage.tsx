import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  EyeIcon,
  EyeOffIcon,
  BuildingIcon,
  StarIcon,
  UserIcon } from
'lucide-react';
import { useAppDispatch } from '../store';
import { login } from '../store/authSlice';
import { mockUsers } from '../data/mockData';
export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user' as 'owner' | 'agent' | 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    // Demo: log in as first matching role user
    const demoUser = mockUsers.find((u) => u.role === form.role);
    if (demoUser) {
      dispatch(login(demoUser.id));
      if (form.role === 'owner') navigate('/owner/dashboard');else
      if (form.role === 'agent') navigate('/agent/dashboard');else
      navigate('/user/dashboard');
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#1B6B3A] rounded-xl flex items-center justify-center">
              <HomeIcon size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-[#111827]">
              Shortlet<span className="text-[#1B6B3A]">Connect</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">
            Create your account
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">
            Join thousands of owners, agents, and guests
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error &&
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            }

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() =>
                  setForm((f) => ({
                    ...f,
                    role: 'user'
                  }))
                  }
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.role === 'user' ? 'border-[#1B6B3A] bg-[#E8F5EE]' : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#1B6B3A]/40'}`}>

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.role === 'user' ? 'bg-[#1B6B3A]' : 'bg-[#F8FAFC]'}`}>

                    <UserIcon
                      size={18}
                      className={
                      form.role === 'user' ? 'text-white' : 'text-[#6B7280]'
                      } />

                  </div>
                  <div>
                    <div
                      className={`font-semibold ${form.role === 'user' ? 'text-[#1B6B3A]' : 'text-[#111827]'}`}>

                      Guest / Traveler
                    </div>
                    <div className="text-xs font-normal">
                      Find and book shortlet apartments
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                  setForm((f) => ({
                    ...f,
                    role: 'owner'
                  }))
                  }
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.role === 'owner' ? 'border-[#1B6B3A] bg-[#E8F5EE]' : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#1B6B3A]/40'}`}>

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.role === 'owner' ? 'bg-[#1B6B3A]' : 'bg-[#F8FAFC]'}`}>

                    <BuildingIcon
                      size={18}
                      className={
                      form.role === 'owner' ? 'text-white' : 'text-[#6B7280]'
                      } />

                  </div>
                  <div>
                    <div
                      className={`font-semibold ${form.role === 'owner' ? 'text-[#1B6B3A]' : 'text-[#111827]'}`}>

                      Property Owner
                    </div>
                    <div className="text-xs font-normal">
                      List and manage your properties
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                  setForm((f) => ({
                    ...f,
                    role: 'agent'
                  }))
                  }
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left ${form.role === 'agent' ? 'border-[#F59E0B] bg-amber-50' : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#F59E0B]/40'}`}>

                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.role === 'agent' ? 'bg-[#F59E0B]' : 'bg-[#F8FAFC]'}`}>

                    <StarIcon
                      size={18}
                      className={
                      form.role === 'agent' ? 'text-white' : 'text-[#6B7280]'
                      } />

                  </div>
                  <div>
                    <div
                      className={`font-semibold ${form.role === 'agent' ? 'text-amber-700' : 'text-[#111827]'}`}>

                      Agent
                    </div>
                    <div className="text-xs font-normal">
                      Manage properties for owners
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {[
            {
              id: 'name',
              label: 'Full Name',
              type: 'text',
              placeholder: 'Chidi Okonkwo'
            },
            {
              id: 'email',
              label: 'Email Address',
              type: 'email',
              placeholder: 'you@example.com'
            },
            {
              id: 'phone',
              label: 'Phone Number',
              type: 'tel',
              placeholder: '+2348012345678'
            }].
            map((field) =>
            <div key={field.id}>
                <label
                htmlFor={field.id}
                className="block text-sm font-semibold text-[#111827] mb-1.5">

                  {field.label}
                </label>
                <input
                id={field.id}
                type={field.type}
                value={form[field.id as keyof typeof form]}
                onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  [field.id]: e.target.value
                }))
                }
                placeholder={field.placeholder}
                className="input-field" />

              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#111827] mb-1.5">

                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    password: e.target.value
                  }))
                  }
                  placeholder="Create a password"
                  className="input-field pr-12" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]">

                  {showPassword ?
                  <EyeOffIcon size={18} /> :

                  <EyeIcon size={18} />
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-3 disabled:opacity-60">

              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[#1B6B3A] font-semibold hover:underline">

            Sign in
          </Link>
        </p>
      </div>
    </div>);

}