import chatSlice from '@/entities/Chat/model/slice';
import { contentBlockSlice } from '@/entities/ContentBlock';
import theorySlice from '@/entities/TheoryCard/model/slice';
import { userSlice } from '@/entities/User';
import sidebarSlice from '@/widgets/Sidebar/model/slice/sidebarSlice';

export const rootReducer = {
  sidebar: sidebarSlice,
  user: userSlice,
  chat: chatSlice,
  contentBlock: contentBlockSlice,
  theory: theorySlice,
};
