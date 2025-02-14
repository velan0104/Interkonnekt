"use client";
import {
  Bell,
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import PostModal from "../PostModal/PostModal";
import { usePathname } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [cloudinaryImage, setCloudinaryImage] = useState("");
  const [IscloudinaryImage, setIsCloudinaryImage] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchUnameInterest = async () => {
      try {
        const response = await fetch("/api/getUnameInterest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session?.user?.id }),
        });
        const data = await response.json();
        console.log("data in navbar: ", data);
        if (data) {
          setUsername(data.username);
          setProfileImage(data.image);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUnameInterest();
  }, [session, pathname]);

  console.log("profile image at navbar: ", profileImage);

  return (
    <>
      <nav className=" fixed top-0 left-0  right-0 h-20 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 z-30">
        <div className="max-w-full mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="sm:text-2xl ml-16  font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Interkonnekt
              </h1>
            </div>

            {/* Search Bar */}
            

            {/* Right Elements */}
            <div className="flex items-center space-x-4">
              {/* Add Post Button */}
              <button
                className="flex items-center space-x-1 px-2 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-5 w-5" />
                <span className="sm:block hidden">Add Post</span>
              </button>

              {/* Notifications */}
              <button className="p-2 sm:hidden relative rounded-full hover:bg-gray-700 transition-colors">
                <Bell className="h-4 w-4 sm:h-6 sm:w-6 text-gray-200" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs sm:text-xs rounded-full px-1  sm:px-1.5 sm:py-0.5">
                  3
                </span>
              </button>

              {/* Messages */}
              <button className="p-2 sm:hidden relative rounded-full hover:bg-gray-700 transition-colors">
                <MessageSquare className="sm:h-6 sm:w-6 h-4 w-4 text-gray-200" />
                <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-1 sm:px-1.5 sm:py-0.5">
                  5
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative sm:block hidden">
                <button
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="sm:w-10 sm:h-10 w-8 h-8 rounded-full overflow-hidden">
                    {!profileImage ? (
                      <img
                        src={
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                        }
                        alt={username}
                        className="w-full h-full object-cover"
                      />
                    ) : profileImage.includes("https://lh3.googleusercontent.com") ? (
                      <img
                        src={profileImage}
                        alt={username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CldImage
                        src={
                          profileImage ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                        }
                        alt={username}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-700"
                    >
                      <button className="flex items-center space-x-3 px-4 py-2 text-gray-200 hover:bg-gray-700 w-full text-left">
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </button>
                      <button className="flex items-center space-x-3 px-4 py-2 text-gray-200 hover:bg-gray-700 w-full text-left">
                        <Settings className="h-5 w-5" />
                        <span>Settings</span>
                      </button>
                      <hr className="my-1 border-gray-700" />
                      <button className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 w-full text-left">
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Post Modal */}
      <div className="flex items-center justify-center">
        <PostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
}