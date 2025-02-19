"use client";

import React, { FC, useEffect, useState } from "react";
import { X, Image, Video, Smile, BarChart2, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";

import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const PostModal: FC<PostModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [poll, setPoll] = useState<{
    question: string;
    options: { optionValue: string; votes: string[] }[]; // Change votes to an array of strings
  }>({
    question: "",
    options: [{ optionValue: "", votes: [] }], // Initialize votes as an empty array
  });

  const [IsPollOpen, setIsPollOpen] = useState(false);
  const [pollLength, setPollLength] = useState(2);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const { toast } = useToast();
  const user_id = session?.user?.id;
  const username = session?.user?.username;
  const profile = session?.user?.image;
  const name = session?.user?.name;

  const [profileImage, setProfileImage] = useState("");
  const [cloudinaryImage, setCloudinaryImage] = useState("");
  const [newUsername, setnewUsername] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUnameInterest = async () => {
      const response = await fetch("/api/getUnameInterest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      const data = await response.json();
      if (data) {
        setnewUsername(data.username);

        setProfileImage(data.image);
      }
    };
    fetchUnameInterest();
  }, [session, pathname]);

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
    updatedOptions[index] = { ...updatedOptions[index], optionValue: value };
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
    };

    try {
      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        toast({
          title: "Post Uploaded Successfully",
          description: "Post Uploaded Successfully",
          variant: "success",
        });
        setContent("");
        setImage(null);
        setPoll({ question: "", options: [{ optionValue: "", votes: [] }] });
        setIsSuccessVisible(true);
        setnewUsername("");
        setProfileImage("");

        onClose();
      } else {
        const error = await response.json();
        toast({
          title: "Post Uploading Failed",
          description: error.message,
          variant: "warning",
        });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error });
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all duration-300"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition transform hover:scale-110"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold text-white mb-4">Create Post</h2>

        {/* Post Content Input */}
        <textarea
          className="w-full h-32 p-3 rounded-lg bg-gray-800 text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {/* Preview Image */}
        {image && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <img
              src={image}
              alt="Preview"
              className="w-full max-h-96 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-3">
            <label className="p-2 rounded-full hover:bg-gray-700 transition cursor-pointer">
              <Image className="h-6 w-6 text-gray-400 hover:text-white" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-700 transition"
                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              >
                <Smile className="h-6 w-6 text-gray-400 hover:text-white" />
              </button>
              {isEmojiPickerOpen && (
                <div className="absolute top-10 left-0 z-50">
                  <Picker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-700 transition"
              onClick={
                () => setIsPollOpen(!IsPollOpen)
                // setPoll({
                //   question: "",
                //   options: new Array(pollLength).fill(""),
                // })
              }
            >
              <BarChart2 className="h-6 w-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          <button
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition transform hover:scale-105"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>

        {/* Poll Section */}
        {IsPollOpen && (
          <div className="mt-4 bg-gray-800 p-4 rounded-lg">
            <input
              type="text"
              value={poll.question}
              onChange={(e) => setPoll({ ...poll, question: e.target.value })}
              className="w-full p-2 mb-2 bg-gray-900 text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Poll question"
            />
            {poll.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option.optionValue}
                onChange={(e) => handlePollChange(index, e.target.value)}
                className="w-full p-2 mb-2 bg-gray-900 text-gray-200 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder={`Option ${index + 1}`}
              />
            ))}
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() =>
                  setPoll({
                    ...poll,
                    options: [...poll.options, { optionValue: "", votes: [] }],
                  })
                }
                className="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Add Option
              </button>
              <button
                onClick={() => {
                  const updatedOptions = [...poll.options];
                  updatedOptions.pop();
                  setPoll({ ...poll, options: updatedOptions });
                }}
                className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              >
                Remove Option
              </button>
              <button
                onClick={() =>
                  setPoll({
                    question: "",
                    options: [{ optionValue: "", votes: [] }],
                  })
                }
                className="px-3 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
              >
                Cancel Poll
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PostModal;
