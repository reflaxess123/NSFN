import type {
  AdminStats,
  AdminUser,
  CreateUserRequest,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  User,
} from '@/entities/User/model/types';
import type { AxiosResponse } from 'axios';
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

  admin: {
    getStats: (): Promise<AdminStats> =>
      apiInstance
        .get('/api/admin/stats')
        .then((response: AxiosResponse<AdminStats>) => response.data),

    getUsers: (params?: {
      page?: number;
      limit?: number;
      role?: string;
      search?: string;
    }): Promise<{ users: AdminUser[]; total: number; pages: number }> =>
      apiInstance.get('/api/admin/users', { params }).then(
        (
          response: AxiosResponse<{
            users: AdminUser[];
            total: number;
            pages: number;
          }>
        ) => response.data
      ),

    createUser: (data: CreateUserRequest): Promise<AdminUser> =>
      apiInstance
        .post('/api/admin/users', data)
        .then((response: AxiosResponse<AdminUser>) => response.data),

    updateUser: (userId: number, data: UpdateUserRequest): Promise<AdminUser> =>
      apiInstance
        .put(`/api/admin/users/${userId}`, data)
        .then((response: AxiosResponse<AdminUser>) => response.data),

    deleteUser: (userId: number): Promise<void> =>
      apiInstance
        .delete(`/api/admin/users/${userId}`)
        .then((response: AxiosResponse<void>) => response.data),

    getContentStats: (): Promise<Record<string, unknown>> =>
      apiInstance
        .get('/api/admin/content/stats')
        .then(
          (response: AxiosResponse<Record<string, unknown>>) => response.data
        ),

    deleteContentFile: (fileId: string): Promise<void> =>
      apiInstance
        .delete(`/api/admin/content/files/${fileId}`)
        .then((response: AxiosResponse<void>) => response.data),
  },
};
