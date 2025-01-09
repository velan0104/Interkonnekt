import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FollowState {
  following: string[];
}

const initialState: FollowState = {
  following: [],
};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    toggleFollow(state, action: PayloadAction<string>) {
      const userId = action.payload;
      if (state.following.includes(userId)) {
        state.following = state.following.filter((id) => id !== userId);
      } else {
        state.following.push(userId);
      }
    },
  },
});

export const { toggleFollow } = followSlice.actions;

export default followSlice.reducer;
