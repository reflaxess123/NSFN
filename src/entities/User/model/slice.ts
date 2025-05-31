import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { checkProfile } from './thunks';
import type { User } from './types';

interface UserState {
  data: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.data = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isInitialized = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    // checkProfile
    builder
      .addCase(checkProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.data = action.payload;
          state.isAuthenticated = true;
        } else {
          // Пользователь не авторизован (401) - это нормально
          state.data = null;
          state.isAuthenticated = false;
        }
        state.isInitialized = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkProfile.rejected, (state, action) => {
        state.data = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
