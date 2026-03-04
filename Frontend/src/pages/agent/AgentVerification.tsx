import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  PhoneIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowLeftIcon } from
'lucide-react';
import { TrustedBadge } from '../../components/TrustedBadge';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateCurrentUser } from '../../store/authSlice';
export function AgentVerification() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const isTrusted = currentUser?.trustedStatus === 'active';
  const handleSendOtp = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setOtpSent(true);
    setLoading(false);
  };
  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    // OTP verified — agent becomes trusted
    dispatch(
      updateCurrentUser({
        trustedStatus: 'active'
      })
    );
    setVerified(true);
    setLoading(false);
  };
  // Already verified
  if (isTrusted || verified) {
    return (
      <div className="space-y-6 animate-fade-in max-w-lg">
        <h1 className="text-2xl font-bold text-[#111827]">Verification</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StarIcon size={36} className="text-amber-500 fill-amber-400" />
          </div>
          <TrustedBadge size="lg" />
          <h2 className="text-xl font-bold text-amber-800 mt-3 mb-2">
            You are a Verified Agent!
          </h2>
          <p className="text-amber-700 text-sm leading-relaxed">
            Your phone number has been verified. You now have the Trusted Agent
            badge, appear first in owner application lists, and have unlimited
            property applications.
          </p>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 justify-center text-sm text-amber-700">
              <CheckCircleIcon size={16} className="text-amber-500" /> Higher
              ranking in search results
            </div>
            <div className="flex items-center gap-2 justify-center text-sm text-amber-700">
              <CheckCircleIcon size={16} className="text-amber-500" /> Unlimited
              property applications
            </div>
            <div className="flex items-center gap-2 justify-center text-sm text-amber-700">
              <CheckCircleIcon size={16} className="text-amber-500" /> Trusted
              badge on your profile
            </div>
          </div>
          <Link
            to="/agent/dashboard"
            className="btn-primary text-sm py-2.5 mt-6 inline-flex">

            Back to Dashboard
          </Link>
        </div>
      </div>);

  }
  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Get Verified</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Verify your phone number to become a Trusted Agent
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <StarIcon size={16} className="text-amber-500 fill-amber-400" />
          <span className="font-semibold text-amber-800 text-sm">
            Trusted Agent Benefits
          </span>
        </div>
        <ul className="space-y-1.5 text-sm text-amber-700">
          {[
          'Appear first in owner application lists',
          'Unlimited property applications',
          'Trusted badge visible on property pages',
          'Higher trust from property owners'].
          map((b) =>
          <li key={b} className="flex items-center gap-2">
              <CheckCircleIcon
              size={14}
              className="text-amber-500 flex-shrink-0" />
            {' '}
              {b}
            </li>
          )}
        </ul>
      </div>

      {/* Verification Steps */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        {/* Progress indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${otpSent ? 'bg-[#10B981] text-white' : 'bg-[#1B6B3A] text-white'}`}>

            {otpSent ? <CheckCircleIcon size={16} /> : '1'}
          </div>
          <div
            className={`flex-1 h-1 rounded-full ${otpSent ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`} />

          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${otpSent ? 'bg-[#1B6B3A] text-white' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>

            2
          </div>
        </div>

        {!otpSent /* Step 1: Enter phone number */ ?
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <PhoneIcon size={18} className="text-[#1B6B3A]" />
              <h3 className="font-bold text-[#111827]">
                Step 1: Enter Your Phone Number
              </h3>
            </div>
            <p className="text-sm text-[#6B7280]">
              We'll send a 6-digit OTP code to verify your phone number.
            </p>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Phone Number
              </label>
              <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+2348012345678"
              className="input-field" />

            </div>
            <button
            onClick={handleSendOtp}
            disabled={loading || !phone.trim()}
            className="w-full btn-primary justify-center py-3 disabled:opacity-60">

              {loading ?
            <span className="flex items-center gap-2">
                  <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none">

                    <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4" />

                    <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />

                  </svg>
                  Sending OTP...
                </span> :

            'Send OTP Code'
            }
            </button>
          </div> /* Step 2: Enter OTP */ :

        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheckIcon size={18} className="text-[#1B6B3A]" />
              <h3 className="font-bold text-[#111827]">
                Step 2: Enter OTP Code
              </h3>
            </div>
            <p className="text-sm text-[#6B7280]">
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-[#111827]">{phone}</span>
            </p>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-4 py-3">
              <p className="text-xs text-[#6B7280]">
                📱 <span className="font-medium">Demo:</span> Enter any 6 digits
                to verify (e.g. 123456)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                OTP Code
              </label>
              <input
              type="text"
              value={otp}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(val);
              }}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="input-field text-center text-lg tracking-[0.5em] font-bold"
              autoFocus />

            </div>

            <button
            onClick={handleVerifyOtp}
            disabled={loading || otp.length < 6}
            className="w-full btn-primary justify-center py-3 disabled:opacity-60">

              {loading ?
            <span className="flex items-center gap-2">
                  <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none">

                    <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4" />

                    <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />

                  </svg>
                  Verifying...
                </span> :

            <>
                  <ShieldCheckIcon size={17} /> Verify & Get Trusted Badge
                </>
            }
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
              onClick={() => {
                setOtpSent(false);
                setOtp('');
              }}
              className="text-sm text-[#6B7280] hover:text-[#111827] flex items-center gap-1">

                <ArrowLeftIcon size={14} /> Change number
              </button>
              <button
              onClick={handleSendOtp}
              disabled={loading}
              className="text-sm text-[#1B6B3A] font-semibold hover:underline">

                Resend OTP
              </button>
            </div>
          </div>
        }
      </div>

      {/* Profile completion note */}
      <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4">
        <p className="text-xs text-[#6B7280] leading-relaxed">
          <span className="font-semibold text-[#111827]">Tip:</span> Make sure
          your profile is complete (photo, bio, WhatsApp number) before
          verifying. A complete profile increases your chances of getting
          approved by property owners.
        </p>
      </div>
    </div>);

}