import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICommunity } from "../types";

interface Members {
  image: string;
  _id: string;
}

interface Community {
  name: string;
  bio: string;
  admin: string;
  members: Members[];
  banner: string;
  category: string;
  profilePic: string;
}

interface CommunityState {
  communitySuggestion: Community[] | undefined;
  communities: ICommunity[] | undefined;
}

const initialState: CommunityState = {
  communitySuggestion: undefined,
  communities: undefined,
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setCommunitySuggestion(state, action: PayloadAction<ICommunity[]>) {
      state.communitySuggestion = action.payload;
    },
    setCommunities(state, action: PayloadAction<ICommunity[]>) {
      state.communities = action.payload;
    },
  },
});

export const { setCommunitySuggestion, setCommunities } =
  communitySlice.actions;

export default communitySlice.reducer;
