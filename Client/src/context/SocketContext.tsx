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
import { CallerState, IMessage, MatchedUserState, SessionUser } from "@/types";
import { Session } from "next-auth";
import {
  setCaller,
  setCallStatus,
  setIsSearching,
  setMatchedUser,
  setOpenCallModal,
  setOpenVideoChatModal,
} from "@/Slice/videoChatSlice";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
  const [incomingCall, setIncomingCall] = useState<{
    from: string;
    callId: string;
  } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // if (!session || socket.current) return;
    if (session) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: session.user?.id, interests: session.user?.interest },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket server from client side", socket);
      });

      const handleReceiveMessage = (
        message: IMessage & { sender: { _id: string } }
      ) => {
        if (selectedChatData?._id !== session.user?.id) {
          if (
            selectedChatType !== undefined &&
            (selectedChatData?._id === message.sender._id ||
              selectedChatData?._id === message.recipient?._id)
          ) {
            dispatch(addMessage(message));
            dispatch(addContactsInDMContacts(message));
          }
        }
      };
      const handleReceiveChannelMessage = (message: IMessage) => {
        if (
          (selectedChatType !== undefined &&
            selectedChatData?._id === message.channelId) ||
          selectedChatData?._id === message.recipient?._id
        ) {
          addMessage(message);
        }
      };

      const handleIncomingCall = ({
        from,
        callId,
      }: {
        from: CallerState;
        callId: string;
      }) => {
        dispatch(setCaller(from));
        dispatch(setOpenCallModal(true));
      };
      2;

      const handleMatchedUser = (matchedUser: MatchedUserState) => {
        dispatch(setMatchedUser(matchedUser));
        dispatch(setIsSearching(false));
      };

      const acceptedCall = (callId: string) => {
        console.log("CALL ACCEPTED");
        setIncomingCall(null);
        router.push(`/call/${callId}`);
        dispatch(setOpenCallModal(false));
        dispatch(setOpenVideoChatModal(false));
        dispatch(setCallStatus("idle"));
        dispatch(setMatchedUser(null));
      };

      // const declineCall = () => {
      //   socket.emit("declineCall", { callId: incomingCall.callId });
      //   setIncomingCall(null);
      // };

      const handleNoMatchFound = () => {
        dispatch(setIsSearching(false));
        toast({
          title: "Try again later",
          description: "Currently no user is online with your interest",
        });
        dispatch(setOpenVideoChatModal(false));
      };

      const handleCallDeclined = () => {
        dispatch(setIsSearching(false));
        dispatch(setCallStatus("declined"));
        dispatch(setMatchedUser(null));
        toast({
          title: "Call Declined",
          description: "User do not want to connect",
        });
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receiveChannelMessage", handleReceiveChannelMessage);
      socket.current.on("incomingCall", handleIncomingCall);
      socket.current.on("callDeclined", () => {
        alert("User declined the call. Searching for a new match...");
        // findNewMatch(); // Function to search again
      });
      socket.current.on("matchedUser", handleMatchedUser);
      socket.current.on("acceptedCall", acceptedCall);
      socket.current.on("noMatchFound", handleNoMatchFound);
      socket.current.on("callDeclined", handleCallDeclined);

      return () => {
        if (socket.current) {
          socket.current.disconnect();
          socket.current = null;
        }
      };
    }
  }, [session?.user?.id, selectedChatData, selectedChatType]);

  if (!socket) return null;

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
