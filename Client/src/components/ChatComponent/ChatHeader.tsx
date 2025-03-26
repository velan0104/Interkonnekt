import { X, EllipsisVertical } from "lucide-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { closeChat } from "@/Slice/chatSlice";

const ChatHeader = () => {
  const dispatch = useDispatch();
  const selectedChatData = useSelector(
    (state: RootState) => state.chat.selectedChatData
  );
  const selectedChatType = useSelector(
    (state: RootState) => state.chat.selectedChatType
  );

  const editGroupDetails = () => {
    console.log("Edit");
  };

  if (selectedChatData === undefined) {
    return <h1> Hello world</h1>;
  }
  return (
    <div className="h-[10vh] border-b-2 bg-gray-900 text-white border-[#2f303b] flex items-center justify-between w-full">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center ">
          <div className=" w-12 h-12 relative ml-5">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData?.image ? (
                  <AvatarImage
                    src={selectedChatData.image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                    height={100}
                    width={100}
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full `}
                  >
                    {selectedChatData.name
                      ? selectedChatData.name.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full">
                <Avatar>
                  {/* {selectedChatData.image.includes(".svg") ? (
                    <AvatarImage src={selectedChatData.image} />
                  ) : (
                    <AvatarImage src={`${HOST}/${selectedChatData.image}`} />
                  )} */}
                  <AvatarImage src="/images/profilePic2.jpeg" />
                  <AvatarFallback> Profile</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <div>
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.username
              ? `${selectedChatData.username}`
              : selectedChatData.name}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 absolute right-5 text-white">
          {selectedChatType == "channel" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {/* <EllipsisVertical
                    className=" text-neutral-400 font-light text-opacity-90 text-start cursor-pointer hover:text-neutral-100 transition-all duration-300"
                    onClick={editGroupDetails}
                  /> */}
                </TooltipTrigger>
                <TooltipContent>
                  <p> Edit </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <button
            className=" hover:bg-slate-600 p-2 rounded-full focus:border-none focus:outline-none foucs:text-white duration-300 transition-all"
            onClick={() => dispatch(closeChat())}
          >
            {/* <X className="text-3xl text-white" /> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
