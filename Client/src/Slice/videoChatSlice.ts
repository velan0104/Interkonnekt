import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CallerState, callStatus, MatchedUserState } from "../types";

interface VideoChatState {
  openVideoChatModal: boolean;
  openCallModal: boolean;
  matchedUser: MatchedUserState | null;
  isSearching: boolean;
  callStatus: callStatus;
  caller: CallerState | null;
}

const initialState: VideoChatState = {
  openVideoChatModal: false,
  openCallModal: false,
  matchedUser: null,
  isSearching: false,
  caller: null,
  callStatus: "idle",
};

const videoChatSlice = createSlice({
  name: "videoChat",
  initialState,
  reducers: {
    setOpenVideoChatModal(state, action: PayloadAction<boolean>) {
      state.openVideoChatModal = action.payload;
    },
    setOpenCallModal(state, action: PayloadAction<boolean>) {
      state.openCallModal = action.payload;
    },
    setMatchedUser(state, action: PayloadAction<MatchedUserState | null>) {
      state.matchedUser = action.payload;
    },
    setIsSearching(state, action: PayloadAction<boolean>) {
      state.isSearching = action.payload;
    },
    setCallStatus(state, action: PayloadAction<callStatus>) {
      state.callStatus = action.payload;
    },
    setCaller(state, action: PayloadAction<CallerState | null>) {
      state.caller = action.payload;
    },
  },
});

export const {
  setOpenVideoChatModal,
  setMatchedUser,
  setIsSearching,
  setOpenCallModal,
  setCaller,
  setCallStatus,
} = videoChatSlice.actions;

export default videoChatSlice.reducer;
