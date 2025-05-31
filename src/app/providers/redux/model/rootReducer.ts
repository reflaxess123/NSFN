import chatSlice from '@/entities/Chat/model/slice';
import { contentBlockSlice } from '@/entities/ContentBlock';
import { userSlice } from '@/entities/User';
import sidebarSlice from '@/widgets/Sidebar/model/slice/sidebarSlice';

export const rootReducer = {
  sidebar: sidebarSlice,
  user: userSlice,
  chat: chatSlice,
  contentBlock: contentBlockSlice,
};
