import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || 'An unknown error occurred';

    // Включаем статус код в сообщение для правильной обработки 401
    const errorMessage = status ? `${status}: ${message}` : message;

    return Promise.reject(new Error(errorMessage));
  }
);
