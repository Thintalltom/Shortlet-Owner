import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking, Commission } from '../types';
import { mockBookings, mockCommissions } from '../data/mockData';

interface BookingsState {
  bookings: Booking[];
  commissions: Commission[];
}

const initialState: BookingsState = {
  bookings: mockBookings,
  commissions: mockCommissions
};

export const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
    },
    updateBooking: (
    state,
    action: PayloadAction<{id: string;updates: Partial<Booking>;}>) =>
    {
      const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) {
        state.bookings[idx] = {
          ...state.bookings[idx],
          ...action.payload.updates
        };
      }
    },
    addCommission: (state, action: PayloadAction<Commission>) => {
      state.commissions.push(action.payload);
    },
    payCommission: (state, action: PayloadAction<string>) => {
      const idx = state.commissions.findIndex((c) => c.id === action.payload);
      if (idx !== -1) {
        state.commissions[idx].status = 'paid';
        // Also update the related booking
        const bookingIdx = state.bookings.findIndex(
          (b) => b.id === state.commissions[idx].bookingId
        );
        if (bookingIdx !== -1) {
          state.bookings[bookingIdx].commissionPaid = true;
        }
      }
    }
  }
});

export const { addBooking, updateBooking, addCommission, payCommission } =
bookingsSlice.actions;
export default bookingsSlice.reducer;