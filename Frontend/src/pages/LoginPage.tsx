import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  EyeIcon,
  EyeOffIcon,
  LogInIcon,
  BuildingIcon,
  StarIcon,
  UserIcon } from
'lucide-react';
import { useAppDispatch } from '../store';
import { login } from '../store/authSlice';
import { mockUsers } from '../data/mockData';
export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState<'owner' | 'agent' | 'user' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Admin bypass
    if (email === 'admin@shortletconnect.ng') {
      dispatch(login('admin-1'));
      navigate('/admin-x7k9');
      return;
    }
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
      if (user.isBlocked) {
        setError('Your account has been blocked by an administrator.');
      } else {
        dispatch(login(user.id));
        if (user.role === 'owner') navigate('/owner/dashboard');else
        if (user.role === 'agent') navigate('/agent/dashboard');else
        navigate('/user/dashboard');
      }
    } else {
      setError(
        role === 'owner' ?
        'No owner account found. Try: chidi@example.com' :
        role === 'agent' ?
        'No agent account found. Try: emeka@example.com' :
        'No user account found. Try: ngozi@example.com'
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRole('user');
                    setError('');
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${role === 'user' ? 'border-[#1B6B3A] bg-[#E8F5EE]' : 'border-[#E5E7EB] hover:border-[#1B6B3A]/40'}`}>

                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'user' ? 'bg-[#1B6B3A]' : 'bg-[#F8FAFC]'}`}>

                    <UserIcon
                      size={16}
                      className={
                      role === 'user' ? 'text-white' : 'text-[#6B7280]'
                      } />

                  </div>
                  <div>
                    <div
                      className={`font-semibold text-xs ${role === 'user' ? 'text-[#1B6B3A]' : 'text-[#111827]'}`}>

                      Guest
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('owner');
                    setError('');
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${role === 'owner' ? 'border-[#1B6B3A] bg-[#E8F5EE]' : 'border-[#E5E7EB] hover:border-[#1B6B3A]/40'}`}>

                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'owner' ? 'bg-[#1B6B3A]' : 'bg-[#F8FAFC]'}`}>

                    <BuildingIcon
                      size={16}
                      className={
                      role === 'owner' ? 'text-white' : 'text-[#6B7280]'
                      } />

                  </div>
                  <div>
                    <div
                      className={`font-semibold text-xs ${role === 'owner' ? 'text-[#1B6B3A]' : 'text-[#111827]'}`}>

                      Owner
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('agent');
                    setError('');
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${role === 'agent' ? 'border-[#F59E0B] bg-amber-50' : 'border-[#E5E7EB] hover:border-[#F59E0B]/40'}`}>

                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'agent' ? 'bg-[#F59E0B]' : 'bg-[#F8FAFC]'}`}>

                    <StarIcon
                      size={16}
                      className={
                      role === 'agent' ? 'text-white' : 'text-[#6B7280]'
                      } />

                  </div>
                  <div>
                    <div
                      className={`font-semibold text-xs ${role === 'agent' ? 'text-amber-700' : 'text-[#111827]'}`}>

                      Agent
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
              disabled={
              loading || !role && email !== 'admin@shortletconnect.ng'
              }
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