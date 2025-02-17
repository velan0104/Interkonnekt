import { Types } from "mongoose";

// types.ts (or inline in your component file)
export interface SessionUser {
  id: string | Types.ObjectId;
  name: string | undefined;
  email: string | undefined;
  username: string | undefined;
  image: string | undefined;
  provider?: string;
}

// types.ts
export interface UserProps {
  username?: string;
  image?: string;
}

export interface IMessage {
  recipent: string | undefined;
  recipient?: { _id: string };
  sender: { _id: string } | string;
  _id?: string;
  userId?: string;
  channelId: string;
  timestamp: string;
  messageType: string;
  content: string;
  fileUrl?: string | undefined;
  __v: number;
}

export interface IContact {
  _id: Types.ObjectId | string;
  name: string;
  username: string;
  email: string;
  lastMessageTime: string | Date;
  image?: string;
}

export interface ICommunity {
  name: string;
  bio: string;
  admin: Types.ObjectId;
  members: Types.ObjectId[];
  banner: string;
  category: string;
  profilePic: string;
}
