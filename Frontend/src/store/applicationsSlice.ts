import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Application } from '../types';
import { mockApplications } from '../data/mockData';

interface ApplicationsState {
  list: Application[];
}

const initialState: ApplicationsState = {
  list: mockApplications
};

export const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    addApplication: (state, action: PayloadAction<Application>) => {
      state.list.push(action.payload);
    },
    updateApplication: (
    state,
    action: PayloadAction<{id: string;status: Application['status'];}>) =>
    {
      const idx = state.list.findIndex((a) => a.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx].status = action.payload.status;
      }
    },
    autoRejectOthers: (
    state,
    action: PayloadAction<{propertyId: string;approvedId: string;}>) =>
    {
      state.list = state.list.map((a) => {
        if (
        a.propertyId === action.payload.propertyId &&
        a.id !== action.payload.approvedId &&
        a.status === 'pending')
        {
          return { ...a, status: 'rejected' };
        }
        return a;
      });
    }
  }
});

export const { addApplication, updateApplication, autoRejectOthers } =
applicationsSlice.actions;
export default applicationsSlice.reducer;