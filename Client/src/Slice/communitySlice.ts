import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICommunity, IMembers } from "../types";
import { Types } from "mongoose";

interface Community {
  _id: Types.ObjectId;
  name: string;
  bio: string;
  admin: Types.ObjectId;
  members: IMembers[];
  banner: string;
  category: string;
  profilePic: string;
}

interface CommunityState {
  communitySuggestion: Community[] | undefined;
  communities: Community[] | undefined;
  selectedCommunity: Community | undefined;
}

const initialState: CommunityState = {
  communitySuggestion: undefined,
  communities: undefined,
  selectedCommunity: undefined,
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    setCommunitySuggestion(state, action: PayloadAction<Community[]>) {
      state.communitySuggestion = action.payload;
    },
    setCommunities(state, action: PayloadAction<Community[]>) {
      state.communities = action.payload;
    },
    setSelectedCommunity(state, action: PayloadAction<Community>) {
      state.selectedCommunity = action.payload;
    },
  },
});

export const { setCommunitySuggestion, setCommunities, setSelectedCommunity } =
  communitySlice.actions;

export default communitySlice.reducer;
