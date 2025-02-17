"use client";
import { RootState } from "@/app/Store/store";
import { useSocket } from "@/context/SocketContext";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Paperclip, Send, Smile } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const MessageBar = () => {
  const [message, setMessage] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>();
  const emojiRef = useRef<HTMLDivElement>();
  const selectedChatType = useSelector(
    (state: RootState) => state.chat.selectedChatType
  );
  const selectedChatData = useSelector(
    (state: RootState) => state.chat.selectedChatData
  );
  const socket = useSocket();
  const { data: session } = useSession();
  console.log("SOCKET: ", socket);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = () => {};

  const handleAddEmoji = (emoji: EmojiClickData) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    console.log("Chat Type: ", selectedChatType);
    console.log("Chat Data: ", selectedChatData);
    if (selectedChatType === "contact" && message.length > 0) {
      // console.log(socket)
      socket?.emit("sendMessage", {
        sender: session?.user?.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel" && message.length > 0) {
      socket?.emit("sendChannelMessage", {
        sender: session?.user?.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className=" flex-1 p-5 text-white bg-transparent rounded-md focus:border-none focus:outline-none text-lg"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className=" text-neutral-500 hover:text-white focus:border-none focus:outline-none foucs:text-white focus:rounded-full p-1 duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <Paperclip className=" text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange} 
        />
        <div className="relative">
          <button
            className=" text-neutral-500 hover:text-white focus:border-none focus:outline-none foucs:text-white focus:rounded-full p-1 duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <Smile className=" text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className=" bg-[#8417ff] rounded-full flex items-center justify-center p-5 focus:border-none focus:outline-none foucs:text-white  hover:bg-[#741bda] hover:text-white duration-100 transition-all"
        onClick={handleSendMessage}
      >
        <Send className=" text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
