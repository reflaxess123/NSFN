import { authApi } from '@/shared/api/auth';
import type { LoginRequest } from '@/shared/types/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearUser, setError, setLoading, setUser } from './slice';

export const checkProfile = createAsyncThunk(
  'user/checkProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const user = await authApi.getProfile();
      dispatch(setUser(user));
      return user;
    } catch (error) {
      dispatch(clearUser());
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: LoginRequest, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await authApi.login(credentials);
      const user = await authApi.getProfile();
      dispatch(setUser(user));
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      await authApi.logout();
      dispatch(clearUser());
    } catch (error) {
      dispatch(clearUser());
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      dispatch(setLoading(false));
    }
  }
);
