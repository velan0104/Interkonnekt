import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "@/Slice/postsSlice";
import followReducer from "@/Slice/FolllowSlice";
import activitiesReducer from "@/Slice/activitiesSlice";
import chatReducer from "@/Slice/chatSlice";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    follow: followReducer,
    activities: activitiesReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
