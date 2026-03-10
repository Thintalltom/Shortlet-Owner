import React, { useState } from 'react';
import { XIcon, CalendarIcon, CheckCircleIcon } from 'lucide-react';
import { Property } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { addBooking, addCommission } from '../store/bookingsSlice';
import { updateBookingStatus } from '../store/propertiesSlice';
interface BookingPromptProps {
  property: Property;
  onClose: () => void;
}
export function BookingPrompt({ property, onClose }: BookingPromptProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const [step, setStep] = useState<'prompt' | 'form' | 'success'>('prompt');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const pricePerNight = property.publicPrice || property.price;
  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const days = calculateDays();
  const totalPrice = days * pricePerNight;
  const commission = totalPrice * 0.03;
  const handleConfirm = async () => {
    if (!checkIn || !checkOut || days <= 0 || !currentUser) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const bookingId = `book-${Date.now()}`;
    dispatch(
      addBooking({
        id: bookingId,
        propertyId: property.id,
        userId: currentUser.id,
        ownerId: property.ownerId,
        agentId: property.agentId,
        status: 'confirmed',
        checkIn,
        checkOut,
        totalPrice,
        commissionAmount: commission,
        commissionPaid: false,
        createdAt: new Date().toISOString()
      })
    );
    dispatch(
      addCommission({
        id: `comm-${Date.now()}`,
        bookingId,
        propertyId: property.id,
        payerId: property.agentId || property.ownerId,
        amount: commission,
        status: 'pending',
        createdAt: new Date().toISOString()
      })
    );
    dispatch(
      updateBookingStatus({
        id: property.id,
        status: 'booked'
      })
    );
    setLoading(false);
    setStep('success');
    setTimeout(() => onClose(), 3000);
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-slide-up">
        {step !== 'success' &&
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#6B7280] hover:bg-gray-100 transition-colors">

            <XIcon size={20} />
          </button>
        }

        {step === 'prompt' &&
        <div className="text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon size={32} className="text-[#F59E0B]" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">
              Have you booked this apartment?
            </h2>
            <p className="text-[#6B7280] mb-6">
              If you successfully agreed with the host and booked this
              apartment, please let us know to keep your records updated.
            </p>
            <div className="space-y-3">
              <button
              onClick={() => setStep('form')}
              className="w-full btn-primary justify-center py-3 text-base">

                Yes, I booked it
              </button>
              <button
              onClick={onClose}
              className="w-full btn-outline justify-center py-3 text-base">

                Not yet
              </button>
            </div>
          </div>
        }

        {step === 'form' &&
        <div>
            <h2 className="text-xl font-bold text-[#111827] mb-4">
              Booking Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Check-in Date
                </label>
                <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="input-field"
                min={new Date().toISOString().split('T')[0]} />

              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Check-out Date
                </label>
                <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="input-field"
                min={checkIn || new Date().toISOString().split('T')[0]} />

              </div>

              {days > 0 &&
            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl p-4 mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#6B7280]">Price per night</span>
                    <span className="font-semibold">
                      ₦{pricePerNight.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#6B7280]">Nights</span>
                    <span className="font-semibold">{days}</span>
                  </div>
                  <div className="border-t border-[#E5E7EB] pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-[#111827]">Total</span>
                    <span className="font-bold text-[#1B6B3A]">
                      ₦{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
            }

              <button
              onClick={handleConfirm}
              disabled={loading || days <= 0}
              className="w-full btn-primary justify-center py-3 mt-4 disabled:opacity-60">

                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        }

        {step === 'success' &&
        <div className="text-center py-4">
            <CheckCircleIcon
            size={56}
            className="text-[#10B981] mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-[#111827] mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-[#6B7280]">
              Your booking has been recorded. You can view it in your dashboard.
            </p>
          </div>
        }
      </div>
    </div>);

}