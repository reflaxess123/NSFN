import type {
  LoginRequest,
  RegisterRequest,
  User,
} from '@/entities/User/model/types';
import { apiInstance } from './base';

export const authApi = {
  async login(credentials: LoginRequest) {
    const response = await apiInstance.post<User>('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterRequest) {
    const response = await apiInstance.post<User>(
      '/auth/register',
      credentials
    );
    return response.data;
  },

  async logout() {
    await apiInstance.post('/auth/logout');
  },

  async getProfile() {
    const response = await apiInstance.get<User>('/api/profile');
    return response.data;
  },
};
