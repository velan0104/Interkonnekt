import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface FollowState {
  following: string[];
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

const getInitialFollowing = (): string[] => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("followingList") || "[]");
  }
  return [];
};

const initialState: FollowState = {
  following: getInitialFollowing(), // Load from localStorage
  status: "idle",
  error: null,
};

// Sync following state to localStorage
const syncFollowingToLocalStorage = (followingList: string[]) => {
  localStorage.setItem("followingList", JSON.stringify(followingList));
};

export const followUser = createAsyncThunk(
  "follow/followUser",
  async (
    {
      currentUserId,
      targetUserId,
    }: { currentUserId: string; targetUserId: string },
    { rejectWithValue }: { rejectWithValue: any }
  ) => {
    try {
      await axios.post("/api/follow", { currentUserId, targetUserId });
      return targetUserId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to follow user"
      );
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (
    {
      currentUserId,
      targetUserId,
    }: { currentUserId: string; targetUserId: string },
    { rejectWithValue }: { rejectWithValue: any }
  ) => {
    try {
      await axios.post("/api/Unfollow", { currentUserId, targetUserId });
      return targetUserId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unfollow user"
      );
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "success";
        if (!state.following.includes(action.payload)) {
          state.following.push(action.payload); // Add targetUserId to following
          syncFollowingToLocalStorage(state.following); // Sync to localStorage
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        unfollowUser.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "success";
          state.following = state.following.filter(
            (id) => id !== action.payload
          );
          syncFollowingToLocalStorage(state.following); // Sync to localStorage
        }
      )
      .addCase(unfollowUser.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      });
  },
});

export default followSlice.reducer;
