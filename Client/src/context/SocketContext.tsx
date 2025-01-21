"use client";
import { HOST } from "@/lib/constant";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { addMessage } from "@/Slice/chatSlice";

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

interface Message {
  sender: { _id: string };
  recipient: { _id: string };
  channelId?: string;
}

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useRef<Socket | null>(null);
  const { data: session } = useSession();
  const selectedChatData = useSelector(
    (state: RootState) => state.chat.selectedChatData
  );
  const selectedChatType = useSelector(
    (state: RootState) => state.chat.selectedChatType
  );

  useEffect(() => {
    if (session) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: session.user?.id },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket server from client side");
      });

      const handleReceiveMessage = (message: any) => {
        if (selectedChatData._id !== session.user?.id)
          if (
            (selectedChatType !== undefined &&
              selectedChatData._id === message.sender._id) ||
            selectedChatData._id === message.recipient._id
          ) {
            addMessage(message);
          }
      };
      const handleReceiveChannelMessage = (message: Message) => {
        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.channelId) ||
          selectedChatData._id === message.recipient._id
        ) {
          // addMessage(message);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receiveChannelMessage", handleReceiveChannelMessage);

      return () => {
        if (socket.current) {
          socket.current.off("receiveMessage", handleReceiveMessage);
          socket.current.off(
            "receiveChannelMessage",
            handleReceiveChannelMessage
          );
        }
      };
    }
  }, [session?.user, selectedChatData, selectedChatType]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
