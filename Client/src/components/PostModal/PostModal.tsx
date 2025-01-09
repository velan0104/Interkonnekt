"use client";

import React, { FC, useEffect, useState } from "react";
import { X, Image, Video, Smile, BarChart2, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";
import DraggableModal from "../DragableModal/DragableModal";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {gsap} from "gsap";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";


interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const PostModal:FC<PostModalProps> = ({ isOpen, onClose }) => {
 
  const { data: session } = useSession();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [poll, setPoll] = useState<{ question: string; options: string[] }>({
    question: "",
    options: [],
  });
  const [pollLength, setPollLength] = useState(2);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const { toast } = useToast();
  const user_id = session?.user?.id;
  const username = session?.user?.username;
  const profile = session?.user?.image;
  const name = session?.user?.name;
  console.log("id at postmodal: ",user_id)
  console.log("username at postmodal: ",username)
  console.log("profile at postmodal: ",profile)
  const [profileImage, setProfileImage] = useState("");
      const [cloudinaryImage, setCloudinaryImage] = useState("");
       const [newUsername, setnewUsername] = useState("");
  
      
      const pathname = usePathname();
      const router = useRouter();

  

   useEffect(() => {
        if (!session?.user?.email) return;
        console.log("useEffect called")
        const fetchUnameInterest = async () => {
          const response = await fetch("/api/getUnameInterest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: session?.user?.id }),
          })
          const data = await response.json();
          if (data) {
            setnewUsername(data.username);
            //setInterest(data.interest);
            setProfileImage(data.image);
            // if (data.image.includes("https://lh3.googleusercontent.com")) {
            //   setProfileImage(data.image);
            //   setCloudinaryImage("");
  
            // } else {
            //   setCloudinaryImage(data.image)
            
            //   setProfileImage("");
            // }
          }
    
    
         
        }
        fetchUnameInterest();
      }, [session, pathname]);
console.log("ProfileImage at postmodal: ",profileImage)  
console.log("newUsername at postmodal: ",newUsername)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setContent((prev) => prev + emojiObject.emoji);
    setIsEmojiPickerOpen(false);
  };

  const handlePollChange = (index: number, value: string) => {
    const updatedOptions = [...poll.options];
    updatedOptions[index] = value;
    setPoll({ ...poll, options: updatedOptions });
  };

  

  const handleSubmit = async () => {
    const postData = {
      user_id,
      newUsername,
      name,
      profileImage,
      content,
      image,
      poll: poll.question ? poll : null,
    }

    try{
      const response = await fetch("/api/createPost",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData)
      })
      
      if(response.ok){
        // gsap.fromTo(
        //   ".success-message",
        //   { scale: 0.5, opacity: 0 },
        //   { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        // );
        // setTimeout(() => setIsSuccessVisible(false), 3000);
        toast({title: "Post Uploaded Successfully",description:"Post Uploaded Successfully", variant: "success"})
        setContent(""); 
        setImage(null);
        setPoll({ question: "", options: [] });
        setIsSuccessVisible(true);
        setnewUsername("");
        setProfileImage("");
       
        onClose();
       
      }else{
        const error = await response.json();
        toast({title: "Post Uploading Failed", description: error.message, variant: "warning"})
      }
    }catch(error:any){
      toast({title: "Error", description:error})
    }
  }
  if (!isOpen) return null;

  return (
    <DraggableModal>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-200 mb-4"></h2>

        {/* Post Content Input */}
        <textarea
          className="w-full h-32 p-3 rounded-md bg-gray-800 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

         {/* Preview Image */}
         {image && (
          <div className="mt-4">
            <img
              src={image}
              alt="Preview"
              className="w-full max-h-96 object-contain rounded-md"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
          <label className="p-2 rounded-full hover:bg-gray-800 transition cursor-pointer">
              <Image className="h-5 w-5 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
           
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-800 transition"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              >
                <Smile className="h-5 w-5 text-gray-400" />
              </button>
              {isEmojiPickerOpen && (
                <div className="absolute top-10 left-0">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-800 transition"
              onClick={() =>
                setPoll({
                  question: "Type your poll question here...",
                  options: new Array(pollLength).fill(""),
                })
              }
            >
              <BarChart2 className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition" onClick={handleSubmit}>
            Post
          </button>
        </div>
        {poll.question && (
          <div className="mt-4 bg-gray-800 p-4 rounded-md">
            <input
              type="text"
              value={poll.question}
              onChange={(e) =>
                setPoll({ ...poll, question: e.target.value })
              }
              className="w-full p-2 mb-2 bg-gray-900 text-gray-200 rounded-md"
              placeholder="Poll question"
            />
            {poll.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => handlePollChange(index, e.target.value)}
                className="w-full p-2 mb-2 bg-gray-900 text-gray-200 rounded-md"
                placeholder={`Option ${index + 1}`}
              />
            ))}
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() =>
                  setPoll({ ...poll, options: [...poll.options, ""] })
                }
                className="px-3 py-1 bg-blue-600 text-white rounded-full"
              >
                Add Option
              </button>
              <button
                onClick={() => {
                  const updatedOptions = [...poll.options];
                  updatedOptions.pop();
                  setPoll({ ...poll, options: updatedOptions });
                }}
                className="px-3 py-1 bg-red-600 text-white rounded-full"
              >
                Remove Option
              </button>
              <button
                  onClick={() => setPoll({ question: "", options: [] })}
                  className="px-3 py-1 bg-gray-600 text-white rounded-full"
                >
                  Cancel Poll
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
    {/* <AnimatePresence>
  {isSuccessVisible && (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => {
        gsap.fromTo(
          ".success-message",
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }}
    >
      <div className="success-message bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
        <CheckCircle className="h-6 w-6" />
        <span>Post Uploaded Successfully!</span>
      </div>
    </motion.div>
  )}
</AnimatePresence> */}

    </DraggableModal>
  );
};

export default PostModal;
