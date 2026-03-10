import React from 'react';
import { Link } from 'react-router-dom';
import { XIcon, UserPlusIcon, LogInIcon } from 'lucide-react';
interface ContactGateProps {
  onClose: () => void;
}
export function ContactGate({ onClose }: ContactGateProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#6B7280] hover:bg-gray-100 transition-colors">

          <XIcon size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#E8F5EE] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlusIcon size={32} className="text-[#1B6B3A]" />
          </div>
          <h2 className="text-2xl font-bold text-[#111827] mb-2">
            Create an Account
          </h2>
          <p className="text-[#6B7280] leading-relaxed">
            Please log in or register to contact property owners and agents
            directly. It's free and takes just a minute!
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/register"
            className="w-full btn-primary justify-center py-3 text-base">

            <UserPlusIcon size={18} /> Register Now
          </Link>
          <Link
            to="/login"
            className="w-full btn-outline justify-center py-3 text-base">

            <LogInIcon size={18} /> Log In
          </Link>
        </div>
      </div>
    </div>);

}