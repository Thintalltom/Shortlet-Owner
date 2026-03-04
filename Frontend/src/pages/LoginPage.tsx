import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
  BuildingIcon,
  StarIcon } from
'lucide-react';
import { useAppDispatch } from '../store';
import { login } from '../store/authSlice';
import { mockUsers } from '../data/mockData';
export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState<'owner' | 'agent' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!role) {
      setError('Please select your account type.');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const user = mockUsers.find((u) => u.email === email && u.role === role);
    if (user) {
      dispatch(login(user.id));
      navigate(user.role === 'owner' ? '/owner/dashboard' : '/agent/dashboard');
    } else {
      setError(
        role === 'owner' ?
        'No owner account found with that email. Try: chidi@example.com or amaka@example.com' :
        'No agent account found with that email. Try: emeka@example.com, fatima@example.com, tunde@example.com, or blessing@example.com'
      );
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
          <h1 className="text-2xl font-bold text-[#111827]">Welcome back</h1>
          <p className="text-[#6B7280] text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error &&
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            }

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRole('owner');
                    setError('');
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${role === 'owner' ? 'border-[#1B6B3A] bg-[#E8F5EE]' : 'border-[#E5E7EB] hover:border-[#1B6B3A]/40'}`}>

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${role === 'owner' ? 'bg-[#1B6B3A]' : 'bg-[#F8FAFC]'}`}>

                    <BuildingIcon
                      size={18}
                      className={
                      role === 'owner' ? 'text-white' : 'text-[#6B7280]'
                      } />

                  </div>
                  <div>
                    <div
                      className={`font-semibold text-sm ${role === 'owner' ? 'text-[#1B6B3A]' : 'text-[#111827]'}`}>

                      Owner
                    </div>
                    <div className="text-[10px] text-[#6B7280]">
                      Property owner
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('agent');
                    setError('');
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${role === 'agent' ? 'border-[#F59E0B] bg-amber-50' : 'border-[#E5E7EB] hover:border-[#F59E0B]/40'}`}>

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${role === 'agent' ? 'bg-[#F59E0B]' : 'bg-[#F8FAFC]'}`}>

                    <StarIcon
                      size={18}
                      className={
                      role === 'agent' ? 'text-white' : 'text-[#6B7280]'
                      } />

                  </div>
                  <div>
                    <div
                      className={`font-semibold text-sm ${role === 'agent' ? 'text-amber-700' : 'text-[#111827]'}`}>

                      Agent
                    </div>
                    <div className="text-[10px] text-[#6B7280]">
                      Property agent
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#111827] mb-1.5">

                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email" />

            </div>

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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pr-12"
                  autoComplete="current-password" />

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
              disabled={loading || !role}
              className="w-full btn-primary justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">

              {loading ?
              'Signing in...' :

              <>
                  <LogInIcon size={17} /> Sign In
                </>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#6B7280] mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-[#1B6B3A] font-semibold hover:underline">

            Register here
          </Link>
        </p>
      </div>
    </div>);

}