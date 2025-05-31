import {
  hasRole,
  selectIsAdmin,
  selectIsGuest,
  selectIsUser,
  selectUserRole,
  type UserRole,
} from '@/entities/User';
import { useAppSelector } from './redux';

export const useRole = () => {
  const userRole = useAppSelector(selectUserRole);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isUser = useAppSelector(selectIsUser);
  const isGuest = useAppSelector(selectIsGuest);

  const checkRole = (requiredRole: UserRole): boolean => {
    return hasRole(userRole, requiredRole);
  };

  return {
    userRole,
    isAdmin,
    isUser,
    isGuest,
    checkRole,
  };
};
