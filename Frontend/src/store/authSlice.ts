import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthState {
  currentUser: User | null;
  users: User[];
}

const initialState: AuthState = {
  currentUser: null,
  users: mockUsers
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user && !user.isBlocked) {
        state.currentUser = user;
      }
    },
    logout: (state) => {
      state.currentUser = null;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        // Also update in users array
        const idx = state.users.findIndex((u) => u.id === state.currentUser!.id);
        if (idx !== -1) {
          state.users[idx] = { ...state.users[idx], ...action.payload };
        }
      }
    },
    blockUser: (state, action: PayloadAction<string>) => {
      const idx = state.users.findIndex((u) => u.id === action.payload);
      if (idx !== -1) {
        state.users[idx].isBlocked = true;
      }
    },
    unblockUser: (state, action: PayloadAction<string>) => {
      const idx = state.users.findIndex((u) => u.id === action.payload);
      if (idx !== -1) {
        state.users[idx].isBlocked = false;
      }
    }
  }
});

export const { login, logout, updateCurrentUser, blockUser, unblockUser } =
authSlice.actions;
export default authSlice.reducer;