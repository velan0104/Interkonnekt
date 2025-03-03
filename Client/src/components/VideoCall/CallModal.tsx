"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneOff, User } from "lucide-react";
import { CallerState } from "@/types";
import { useSocket } from "@/context/SocketContext";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { setOpenCallModal } from "@/Slice/videoChatSlice";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  caller: CallerState;
}

export function CallModal({
  isOpen,
  onClose,
  onAccept,
  onDecline,
  caller,
}: CallModalProps) {
  // Get the primary interest (the one the user was searching for)
  const primaryInterest = caller.interests;
  const socket = useSocket();
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const handleDeclineCall = () => {
    console.log("CALLER: " + caller._id);
    const senderId = caller._id;
    const receiverId = session?.user?.id;
    socket?.emit("declineCall", { senderId, receiverId });
    dispatch(setOpenCallModal(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDeclineCall}>
      <DialogContent
        className="sm:max-w-md bg-gray-950 border-theme text-white"
        style={{ borderRadius: "10px" }}
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-center text-theme">
            Incoming Call
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            {caller.name} wants to connect with you
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <Avatar className="h-24 w-24 border-4 border-primary/10">
            <AvatarImage src={caller.image} alt={caller.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h3 className="text-lg font-semibold">{caller.name}</h3>
            <p className="text-sm text-muted-foreground">@{caller.username}</p>
          </div>

          {primaryInterest && (
            <div className="mt-2">
              <Badge
                variant="secondary"
                className="text-sm px-3 py-1 bg-primary/10"
              >
                Interested in{" "}
                <span className="font-semibold">{primaryInterest}</span>
              </Badge>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <Button
            variant="destructive"
            size="lg"
            className="decline-btn rounded-full w-16 h-16 p-0 shadow-lg bg-red-600 hover:bg-red-500 hover:shadow-red-500/30"
            onClick={handleDeclineCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          <Button
            variant="default"
            size="lg"
            className="accept-btn rounded-full w-16 h-16 p-0 bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-green-500/30"
            onClick={onAccept}
          >
            <Phone className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
