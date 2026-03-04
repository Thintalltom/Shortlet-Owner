import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthState {
  currentUser: User | null;
}

const initialState: AuthState = {
  currentUser: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      const user = mockUsers.find((u) => u.id === action.payload);
      state.currentUser = user || null;
    },
    logout: (state) => {
      state.currentUser = null;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    }
  }
});

export const { login, logout, updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;