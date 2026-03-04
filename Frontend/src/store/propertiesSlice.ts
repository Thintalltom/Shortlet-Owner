import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '../types';
import { mockProperties } from '../data/mockData';

interface PropertiesState {
  list: Property[];
}

const initialState: PropertiesState = {
  list: mockProperties
};

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    addProperty: (state, action: PayloadAction<Property>) => {
      state.list.push(action.payload);
    },
    updateProperty: (
    state,
    action: PayloadAction<{id: string;updates: Partial<Property>;}>) =>
    {
      const idx = state.list.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...action.payload.updates };
      }
    },
    deleteProperty: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    incrementViews: (state, action: PayloadAction<string>) => {
      const idx = state.list.findIndex((p) => p.id === action.payload);
      if (idx !== -1) {
        state.list[idx].viewsCount = (state.list[idx].viewsCount || 0) + 1;
      }
    },
    featureProperty: (
    state,
    action: PayloadAction<{id: string;days: number;}>) =>
    {
      const idx = state.list.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        const until = new Date();
        until.setDate(until.getDate() + action.payload.days);
        state.list[idx].isFeatured = true;
        state.list[idx].featuredUntil = until.toISOString();
      }
    },
    boostProperty: (
    state,
    action: PayloadAction<{id: string;days: number;}>) =>
    {
      const idx = state.list.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        const until = new Date();
        until.setDate(until.getDate() + action.payload.days);
        state.list[idx].boostedUntil = until.toISOString();
      }
    },
    reportProperty: (state, action: PayloadAction<string>) => {
      const idx = state.list.findIndex((p) => p.id === action.payload);
      if (idx !== -1) {
        state.list[idx].isReported = true;
      }
    }
  }
});

export const {
  addProperty,
  updateProperty,
  deleteProperty,
  incrementViews,
  featureProperty,
  boostProperty,
  reportProperty
} = propertiesSlice.actions;

export default propertiesSlice.reducer;