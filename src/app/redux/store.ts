import sidebarSlice from '@/widgets/Sidebar/model/slice/sidebarSlice';
import { configureStore } from '@reduxjs/toolkit';

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const rootReducer = {
  sidebar: sidebarSlice,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type { AppDispatch, RootState };
