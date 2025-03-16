"use client";
import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import { ArrowDown, ArrowDownToLine, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { GET_CHAT_MESSAGES, HOST } from "@/lib/constant";
import { setSelectedChatMessages } from "@/Slice/chatSlice";
import apiClient from "@/lib/api-client";
import { IMessage } from "@/types";
import { Types } from "mongoose";
import { CldImage } from "next-cloudinary";
import axios, { AxiosProgressEvent } from "axios";

interface MessageType {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  messageType: "text" | "file";
  content: string;
  fileUrl?: string;
  timestamp?: Date;
}

const MessageContainer = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedChatData = useSelector(
    (state: RootState) => state.chat.selectedChatData
  );
  const selectedChatType = useSelector(
    (state: RootState) => state.chat.selectedChatType
  );
  const selectedChatMessages = useSelector(
    (state: RootState) => state.chat.selectedChatMessages
  );
  const [isDownloading, setIsDownloading] = useState<Boolean>(false);
  const [fileDownloadProgress, setFileDownloadProgress] = useState<Number>(0);
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<String | null>("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_CHAT_MESSAGES,
          {
            id: selectedChatData?._id,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.messages) {
          dispatch(setSelectedChatMessages(response.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };

    // const getChannelMessages = async () => {
    //   try {
    //     const response = await apiClient.get(
    //       `${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
    //       {
    //         withCredentials: true,
    //       }
    //     );

    //     if (response.data.messages) {
    //       dispatch(setSelectedChatMessages(response.data.messages));
    //     }

    //     // console.log("Channel Messages: ", selectChatMessages)
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    if (selectedChatData?._id) {
      if (selectedChatType === "contact") {
        getMessages();
      }
      // else if (selectedChatType === "channel") {
      //   getChannelMessages();
      // }
    }
  }, [selectedChatData, selectedChatType]);

  const checkImage = (filePath: string) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const RenderMessages = () => {
    let lastDate: string | null = null;
    // console.log(selectChatMessages[selectChatMessages.length - 1]);
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      // console.log("Selected Chat Messages: ", selectedChatMessages);
      return (
        <div key={index}>
          {showDate && (
            <div className=" text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {/* // {selectedChatType === "channel" && renderChannelMessages(message)} */}
        </div>
      );
    });
  };

  const downloadFile = async (cloudinaryUrl: string) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);

      // Fetch the file using Axios with responseType: 'blob'
      const response = await axios.get(cloudinaryUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          const { loaded, total } = progressEvent;
          if (total) {
            const percentCompleted = Math.round((loaded * 100) / total);
            setFileDownloadProgress(percentCompleted);
          }
        },
      });
      // console.log("DOWNLOAD FILE: ", response);

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      // Extract the file name from the Cloudinary URL
      const fileName = cloudinaryUrl?.split("/")?.pop()?.split("?")[0];

      link.href = urlBlob;
      fileName
        ? link.setAttribute("download", fileName)
        : link.setAttribute("download", Date.now().toLocaleString());

      console.log("Filename: ", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Cleanup
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
      setFileDownloadProgress(100); // Final progress
    } catch (error) {
      setIsDownloading(false);
      console.error("Download failed:", error);
    }
  };

  const renderDMMessages = (message: MessageType) => (
    <div
      className={`${
        message.sender === selectedChatData?._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender._id !== selectedChatData?._id
              ? "bg-[#8417ff]/5 text-theme/90 border-theme/50"
              : "bg-[#2a2b33]/5 text-white/80 border-theme/50"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && message.fileUrl && (
        <div
          className={`${
            message.sender !== selectedChatData?._id
              ? "bg-[#8417ff]/5 text-theme/90 border-theme/50"
              : "bg-[#2a2b33]/5 text-white/80 border-theme/50"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkImage(message?.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message?.fileUrl || "");
              }}
            >
              <CldImage
                src={message?.fileUrl}
                alt={`${message.timestamp}`}
                width={200}
                height={200}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className=" text-white/80 text-3xl bg-black/20 rounded-full p-3">
                {/* <MdFolderZip/> */}
              </span>
              <span>{`FILE-${Date.now()}`}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={() => downloadFile(message?.fileUrl!)}
              >
                <ArrowDownToLine />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = ({ message }: { message: string }) => {
    return (
      <div> Message </div>
      //   <div
      //     className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right"}`}
      //   >
      //     {
      //       message.messageType === "text" && (
      //         <div className={`${
      //           message.sender._id === userInfo.id
      //             ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
      //             : "bg-[#2a2b33]/5 text-white/80 border-white/20"
      //             } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
      //         >
      //           { message.content }
      //         </div>
      //       )
      //     }
      //     {
      //     message.messageType === 'file' && (
      //       <div className={`${
      //         message.sender !== userInfo.id
      //           ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
      //           : "bg-[#2a2b33]/5 text-white/80 border-white/20"
      //           } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
      //       >
      //         { checkImage(message.fileUrl) ? (
      //             <div
      //               className='cursor-pointer'
      //               onClick = {() => {
      //                 setShowImage(true);
      //                 setImageUrl(message.fileUrl)
      //               }}
      //             >
      //               <img src ={`${HOST}/${message.fileUrl}`} alt= {message.fileUrl} height={300} width={300}/>
      //             </div>
      //           ): (
      //             <div className='flex items-center justify-center gap-4'>
      //               <span className=" text-white/80 text-3xl bg-black/20 rounded-full p-3">
      //                 <MdFolderZip/>
      //               </span>
      //               <span>
      //                 {message.fileUrl.split('/').pop()}
      //               </span>
      //               <span

      //                 className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
      //                 onClick={() => downloadFile(message.fileUrl)}
      //               >
      //                 <IoMdArrowDown/>
      //               </span>
      //             </div>
      //           )
      //         }
      //       </div>
      //     )
      //   }

      //     {
      //       message.sender._id !== userInfo.id ? (
      //         <div className='flex items-center justify-start gap-3'>
      //           <Avatar className = "h-8 w-8 rounded-full overflow-hidden">
      //           {
      //             message.sender.image && (
      //                 <AvatarImage
      //                   src={`${HOST}/${message.sender.image}`}
      //                   alt="profile"
      //                   className ="object-cover w-full h-full bg-black"
      //                 />
      //           )}
      //             <AvatarFallback
      //               className={`uppercase h-8 w-8 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(message.sender.color)}`}
      //             >
      //               {
      //                 message.sender.firstName ? message.sender.firstName.split("").shift() : message.sender.email.split("").shift()
      //               }
      //             </AvatarFallback>
      //         </Avatar>
      //         <span className='text-sm text-white/60'>
      //           { `${message.sender.firstName} ${message.sender.lastName}`}
      //         </span>
      //         <span className='text-xs text-white/60'>
      //           {moment(message.timestamp).format("LT")}
      //         </span>
      //         </div>
      //       ): (
      //         <div className='text-xs text-white/60 mt-1'>
      //           {moment(message.timestamp).format("LT")}
      //         </div>
      //       )
      //     }
      //   </div>
    );
  };

  return (
    <div className="scroll-bar flex-1 overflow-y-auto p-4 px-8  w-full h-[69vh] bg-gray-800">
      <RenderMessages />

      {/* <h1 className="text-9xl text-white"> HELLO WORLD </h1> */}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <CldImage
              src={`${imageUrl ? imageUrl : ""}`}
              alt={"imageUrl"}
              width={200}
              height={200}
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}
            >
              <ArrowDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <X />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
