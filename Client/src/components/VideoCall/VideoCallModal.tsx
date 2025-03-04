"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import {
  setCallStatus,
  setIsSearching,
  setMatchedUser,
} from "@/Slice/videoChatSlice";
import { disableInstantTransitions } from "framer-motion";

// Mock categories
const categories = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Design" },
  { id: "3", name: "Business" },
  { id: "4", name: "Health" },
  { id: "5", name: "Education" },
  { id: "6", name: "music" },
];

// Mock function to simulate API call
const searchUser = async (categoryId: string): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "user2",
        name: "Jane Smith",
        username: "@janesmith",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      });
    }, 3000); // Simulate 3 second delay
  });
};

type VideoCallModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function VideoCallModal({ open, onOpenChange }: VideoCallModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const isSearching = useSelector(
    (state: RootState) => state.videoChat.isSearching
  );
  const matchedUser = useSelector(
    (state: RootState) => state.videoChat.matchedUser
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const callStatus = useSelector(
    (state: RootState) => state.videoChat.callStatus
  );
  const { toast } = useToast();
  const socket = useSocket();
  const dispatch = useDispatch();

  const handleSearch = async () => {
    dispatch(setIsSearching(true));
    console.log("Building connection...");
    console.log("SELECTED CATEGORY: ", selectedCategory);
    console.log("SOCKET: ", socket);
    socket?.emit("findMatch", {
      sender: session?.user?.id,
      selectedInterest: selectedCategory,
    });
    console.log("Hello world");
  };

  const { data: session } = useSession();
  console.log("SESSION: ", session);

  const handleConnect = () => {
    dispatch(setIsSearching(false));
    dispatch(setCallStatus("connecting"));
    setIsConnecting(true);
    socket?.emit("connectCall", {
      senderId: session?.user?.id,
      receiverId: matchedUser?._id,
      category: selectedCategory,
    });
  };

  const resetModal = () => {
    setSelectedCategory("");
    setIsSearching(false);
    dispatch(setMatchedUser(null));
    setIsConnecting(false);
    dispatch(setCallStatus("idle"));
  };

  const handleClose = () => {
    resetModal();
    onOpenChange(false);
    dispatch(setIsSearching(false));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md bg-gray-950 border-theme text-white"
        style={{ borderRadius: "10px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-theme">
            Build Network
          </DialogTitle>
          <DialogDescription className="text-center">
            Connect with like minded people and grow your network
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {/* User profiles section */}
          <div className="flex items-center justify-center space-x-8 w-full">
            {/* Current user */}
            <div className="flex flex-col items-center">
              <Avatar className="h-20 w-20 bg-theme text-black text-3xl font-bold">
                <AvatarImage
                  src={session?.user?.image!}
                  alt={session?.user?.name!}
                />
                <AvatarFallback>
                  {session?.user?.name!.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <p className="mt-2 font-medium">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                {session?.user?.username}
              </p>
            </div>

            {/* Connection indicator */}
            {(isSearching || matchedUser) && (
              <div className="flex flex-col items-center">
                <div className="h-0.5 w-10 bg-gray-300"></div>
              </div>
            )}

            {/* Matched user or searching placeholder */}
            {(isSearching || matchedUser) && (
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 bg-theme text-black text-3xl font-bold">
                  {matchedUser?.image ? (
                    <AvatarImage
                      src={matchedUser.image}
                      alt={matchedUser.name}
                    />
                  ) : (
                    <AvatarFallback>
                      {matchedUser?.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                {matchedUser ? (
                  <>
                    <p className="mt-2 font-medium">{matchedUser.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {matchedUser.username}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Searching...
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Category selection and search button */}
          {!matchedUser && (
            <>
              <div className="w-full space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Select Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={isSearching}
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-theme rounded-full text-black"
                disabled={!selectedCategory || isSearching}
                onClick={handleSearch}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Start Searching"
                )}
              </Button>
            </>
          )}

          {/* Connect call button */}
          {matchedUser && callStatus === "idle" && (
            <Button className="w-full bg-theme" onClick={handleConnect}>
              Connect Call
            </Button>
          )}

          {/* Connecting state */}
          {callStatus === "connecting" && (
            <Button className="w-full bg-theme" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </Button>
          )}

          {/* Call declined message */}
          {callStatus === "declined" && (
            <div className="text-center space-y-4">
              <p className="text-destructive font-medium">Call Declined</p>
              <Button onClick={resetModal} className="bg-red-500">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
