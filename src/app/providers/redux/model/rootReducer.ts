import { userSlice } from '@/entities/User';
import sidebarSlice from '@/widgets/Sidebar/model/slice/sidebarSlice';

export const rootReducer = {
  sidebar: sidebarSlice,
  user: userSlice,
};
