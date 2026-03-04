import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
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
    role: 'owner' as 'owner' | 'agent'
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
      navigate(form.role === 'owner' ? '/owner/dashboard' : '/agent/dashboard');
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
            Join thousands of owners and agents
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                  setForm((f) => ({
                    ...f,
                    role: 'owner'
                  }))
                  }
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.role === 'owner' ? 'border-[#1B6B3A] bg-[#E8F5EE] text-[#1B6B3A]' : 'border-[#E5E7EB] text-[#6B7280]'}`}>

                  🏠 Property Owner
                </button>
                <button
                  type="button"
                  onClick={() =>
                  setForm((f) => ({
                    ...f,
                    role: 'agent'
                  }))
                  }
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${form.role === 'agent' ? 'border-[#1B6B3A] bg-[#E8F5EE] text-[#1B6B3A]' : 'border-[#E5E7EB] text-[#6B7280]'}`}>

                  ⭐ Agent
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