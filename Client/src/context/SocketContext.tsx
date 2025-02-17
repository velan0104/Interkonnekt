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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { addContactsInDMContacts, addMessage } from "@/Slice/chatSlice";
import { IMessage, SessionUser } from "@/types";
import { Session } from "next-auth";

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const { data: session }: { data: Session | null } = useSession();
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

      const handleReceiveMessage = (message: IMessage) => {
        console.log("ADDING MESSAGES...", message);
        console.log("SELECTED CHATS receiving: ", selectedChatData);
        if (selectedChatData?._id !== session.user?.id) {
          console.log("HELLO COMPLETED FIRST STEP: ", selectedChatType);
          console.log(`SENDER: ${session.user?.id === message.sender._id}`);
          console.log(
            `RECEIVER: ${selectedChatData._id === message.recipient?._id}`
          );
          if (
            selectedChatType !== undefined &&
            (selectedChatData._id === message.sender._id ||
              selectedChatData._id === message.recipient?._id)
          ) {
            console.log("Hello calling add messages");
            dispatch(addMessage(message));
            dispatch(addContactsInDMContacts(message));
          } else {
            console.log("Nhi... chal rha vroo...");
          }
        }
      };
      const handleReceiveChannelMessage = (message: IMessage) => {
        if (
          (selectedChatType !== undefined &&
            selectedChatData._id === message.channelId) ||
          selectedChatData._id === message.recipient?._id
        ) {
          addMessage(message);
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
