import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SavedProperty } from '../types';

interface SavedPropertiesState {
  list: SavedProperty[];
}

const initialState: SavedPropertiesState = {
  list: []
};

export const savedPropertiesSlice = createSlice({
  name: 'savedProperties',
  initialState,
  reducers: {
    saveProperty: (
    state,
    action: PayloadAction<{userId: string;propertyId: string;}>) =>
    {
      const exists = state.list.find(
        (s) =>
        s.userId === action.payload.userId &&
        s.propertyId === action.payload.propertyId
      );
      if (!exists) {
        state.list.push({
          userId: action.payload.userId,
          propertyId: action.payload.propertyId,
          savedAt: new Date().toISOString()
        });
      }
    },
    unsaveProperty: (
    state,
    action: PayloadAction<{userId: string;propertyId: string;}>) =>
    {
      state.list = state.list.filter(
        (s) =>
        !(
        s.userId === action.payload.userId &&
        s.propertyId === action.payload.propertyId)

      );
    }
  }
});

export const { saveProperty, unsaveProperty } = savedPropertiesSlice.actions;
export default savedPropertiesSlice.reducer;