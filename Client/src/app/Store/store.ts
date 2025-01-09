import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '@/Slice/postsSlice';
import followReducer from '@/Slice/FolllowSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    follow: followReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
