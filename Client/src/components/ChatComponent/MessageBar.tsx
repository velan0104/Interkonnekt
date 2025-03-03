"use client";
import { RootState } from "@/app/Store/store";
import { useSocket } from "@/context/SocketContext";
import { setFileUploadProgress, setIsUploading } from "@/Slice/chatSlice";
import axios, { AxiosProgressEvent } from "axios";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Paperclip, Send, Smile } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const MessageBar = () => {
  const [message, setMessage] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const selectedChatType = useSelector(
    (state: RootState) => state.chat.selectedChatType
  );
  const selectedChatData = useSelector(
    (state: RootState) => state.chat.selectedChatData
  );
  const socket = useSocket();
  const { data: session } = useSession();

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

  const handleAttachmentChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
        ); // Replace with your Cloudinary upload preset

        setIsUploading(true);

        // Upload file to Cloudinary
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, // Replace with your Cloudinary cloud name
          formData,
          {
            onUploadProgress: (data: AxiosProgressEvent) => {
              setFileUploadProgress(
                Math.round((100 * data.loaded) / data?.total!)
              );
            },
          }
        );

        if (response.status === 200 && response.data) {
          setIsUploading(false);

          // Cloudinary returns the file URL in `secure_url`
          const cloudinaryFileUrl = response.data.secure_url;

          // Emit message with Cloudinary file URL
          if (selectedChatType === "contact") {
            socket?.emit("sendMessage", {
              sender: session?.user?.id,
              content: undefined,
              recipient: selectedChatData?._id,
              messageType: "file",
              fileUrl: cloudinaryFileUrl, // Use Cloudinary URL
            });
          } else if (selectedChatType === "channel") {
            socket?.emit("sendChannelMessage", {
              sender: session?.user?.id,
              content: undefined,
              messageType: "file",
              fileUrl: cloudinaryFileUrl, // Use Cloudinary URL
              channelId: selectedChatData?._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Upload failed:", error);
    }
  };

  const handleAddEmoji = (emoji: EmojiClickData) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selectedChatType === "contact" && message.length > 0) {
      console.log(socket);
      console.log("HANDLE SEND MESSAGE");
      socket?.emit("sendMessage", {
        sender: session?.user?.id,
        content: message,
        recipient: selectedChatData?._id,
        messageType: "text",
        fileUrl: undefined,
      });

      // socket?.emit("findMatch", {
      //   sender: session?.user.id,
      //   selectedInterest: "technology",
      // });
    } else if (selectedChatType === "channel" && message.length > 0) {
      socket?.emit("sendChannelMessage", {
        sender: session?.user?.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData?._id,
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
              theme={Theme.DARK}
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
