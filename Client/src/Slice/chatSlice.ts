import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  recipent: string | undefined;
  recipient?: { _id: string };
  sender: string | undefined;
  _id?: string;
  userId?: string;
}

interface Contact {
  _id: string;
  [key: string]: any;
}

interface Channel {
  _id: string;
  [key: string]: any;
}

interface ChatState {
  selectedChatType: string | undefined;
  selectedChatData: any;
  selectedChatMessages: Message[];
  directMessagesContacts: Contact[];
  isUploading: boolean;
  isDownloading: boolean;
  isChatDetails: boolean;
  fileUploadProgress: number;
  fileDownloadProgress: number;
  channels: Channel[];
  allChannelMembers: any[];
  openAddMemberModal: boolean;
  openNewContactModal: boolean;
}

const initialState: ChatState = {
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  isChatDetails: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],
  allChannelMembers: [],
  openAddMemberModal: false,
  openNewContactModal: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setOpenAddMemberModal(state, action: PayloadAction<boolean>) {
      state.openAddMemberModal = action.payload;
    },
    setAllChannelMembers(state, action: PayloadAction<any[]>) {
      state.allChannelMembers = action.payload;
    },
    setChannels(state, action: PayloadAction<Channel[]>) {
      state.channels = action.payload;
    },
    setIsUploading(state, action: PayloadAction<boolean>) {
      state.isUploading = action.payload;
    },
    setIsDownloading(state, action: PayloadAction<boolean>) {
      state.isDownloading = action.payload;
    },
    setIsChatDetails(state, action: PayloadAction<boolean>) {
      state.isChatDetails = action.payload;
    },
    setFileUploadProgress(state, action: PayloadAction<number>) {
      state.fileUploadProgress = action.payload;
    },
    setFileDownloadProgress(state, action: PayloadAction<number>) {
      state.fileDownloadProgress = action.payload;
    },
    setSelectedChatType(state, action: PayloadAction<string | undefined>) {
      state.selectedChatType = action.payload;
    },
    setSelectedChatData(state, action: PayloadAction<any>) {
      state.selectedChatData = action.payload;
    },
    setSelectedChatMessages(state, action: PayloadAction<Message[]>) {
      state.selectedChatMessages = action.payload;
    },
    setDirectMessagesContacts(state, action: PayloadAction<Contact[]>) {
      state.directMessagesContacts = action.payload;
    },
    setOpenNewContactModal(state, action: PayloadAction<boolean>) {
      state.openNewContactModal = action.payload;
    },
    addChannel(state, action: PayloadAction<Channel>) {
      state.channels.unshift(action.payload);
    },
    closeChat(state) {
      state.selectedChatData = undefined;
      state.selectedChatType = undefined;
      state.selectedChatMessages = [];
    },
    addMessage(state, action: PayloadAction<Message>) {
      const message = action.payload;
      const { selectedChatType } = state;

      state.selectedChatMessages.push({
        ...message,
        recipent:
          selectedChatType === "channel"
            ? message.recipent
            : message.recipient?._id,
        sender:
          selectedChatType === "channel" ? message.sender : message.sender,
      });
    },
    addChannelInChannelList(state, action: PayloadAction<Message>) {
      const message = action.payload;
      const index = state.channels.findIndex(
        (channel) => channel._id === message.recipient?._id
      );

      if (index !== -1) {
        const [data] = state.channels.splice(index, 1);
        state.channels.unshift(data);
      }
    },
    addContactsInDMContacts(state, action: PayloadAction<Message>) {
      const message = action.payload;
      const userId = action.payload.userId as string;
      const fromId =
        message.sender === userId ? message.recipent : message.sender;

      const fromData =
        message.sender === userId ? message.recipent : message.sender;

      const index = state.directMessagesContacts.findIndex(
        (contact) => contact._id === fromId
      );

      if (index !== -1) {
        const [data] = state.directMessagesContacts.splice(index, 1);
        state.directMessagesContacts.unshift(data);
      } else {
        state.directMessagesContacts.unshift(fromData);
      }
    },
  },
});

export const {
  setOpenAddMemberModal,
  setAllChannelMembers,
  setChannels,
  setIsUploading,
  setIsDownloading,
  setIsChatDetails,
  setFileUploadProgress,
  setFileDownloadProgress,
  setSelectedChatType,
  setSelectedChatData,
  setSelectedChatMessages,
  setOpenNewContactModal,
  setDirectMessagesContacts,
  addChannel,
  closeChat,
  addMessage,
  addChannelInChannelList,
  addContactsInDMContacts,
} = chatSlice.actions;

export default chatSlice.reducer;
