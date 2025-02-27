import { Types } from "mongoose";
import { IPoll } from "./models/CommunityPost.model";

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
  members: IMembers[];
  banner: string;
  category: string;
  profilePic: string;
}

export interface IMembers {
  image: string;
  _id: Types.ObjectId;
  username: string;
  name: string;
}

export interface IComment {
  user: string;
  text: string;
  createdAt: Date;
}

export interface Author {
  _id: Types.ObjectId;
  name: string;
  image: string;
  username: string;
}

export interface ICommunityPost {
  _id: Types.ObjectId | string;
  title: string;
  content: string;
  media: string[];
  author: Author;
  community: string;
  category: string;
  likes: string[];
  comments: IComment[];
  isPinned: boolean;
  isWorkshop: boolean;
  workshopId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  endDate?: Date;
}

export interface CommunityPostProps {
  _id: Types.ObjectId | string;
  author: {
    _id: Types.ObjectId | string;
    name: string;
    image: string;
  };
  comments?: IComment[];
  community: {
    _id: Types.ObjectId | string;
    name: string;
  };
  content?: string;
  createdAt: Date;
  isPinned: boolean;
  isWorkshop: boolean;
  likes: Types.ObjectId[];
  media?: string[];
  title?: string;
  poll?: IPoll;
}

export interface ExtendedSession {
  user: {
    _id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const POST_CATEGORIES = [
  "Technology",
  "Dancing",
  "Communication",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
