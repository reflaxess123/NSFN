export {
  selectError,
  selectIsAuthenticated,
  selectIsInitialized,
  selectIsLoading,
  selectUser,
} from './model/selectors';
export {
  clearUser,
  setError,
  setLoading,
  setUser,
  default as userSlice,
} from './model/slice';
export {
  checkProfile,
  loginUser,
  logoutUser,
  registerUser,
} from './model/thunks';
export type { User } from './model/types';
