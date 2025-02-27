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
  Heart,
  UserPlus2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import PostModal from "../PostModal/PostModal";
import { usePathname } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Store/store";

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
  const [isRecentActivitiesOpen, setIsRecentActivitiesOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { activities, loading, error } = useSelector(
    (state: RootState) => state.activities
  );
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
      <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 z-30">
        <div className="max-w-full mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <h1 className="sm:text-2xl ml-4 font-bold bg-gradient-to-r from-[#42E695] via-[#3BB2B8] to-[#42E695] bg-clip-text text-transparent tracking-wide">
            Interkonnekt
          </h1>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-1 px-3 py-2 sm:px-4 sm:py-2 bg-[#53c97d] text-white rounded-full hover:bg-green-600 shadow-md transition"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:block">Add Post</span>
            </button>

            {/* Notifications (Hidden on large screens) */}
            <button className="p-2 sm:hidden relative rounded-full hover:bg-gray-700 transition"
              onClick={() => setIsRecentActivitiesOpen((prev) => !prev)}>
              <Bell className="h-5 w-5 text-gray-200" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">{activities.length}</span>
            </button>



            {/* Messages */}
            {/* <button className="p-2 sm:hidden relative rounded-full hover:bg-gray-700 transition-colors">
                <MessageSquare className="sm:h-6 sm:w-6 h-4 w-4 text-gray-200" />
                <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-full px-1 sm:px-1.5 sm:py-0.5">
                  5
                </span>
              </button> */}

            {/* Profile Dropdown */}
            <div className="relative sm:block hidden">
              <button
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="sm:w-10 sm:h-10 w-8 h-8 rounded-full overflow-hidden border-1 border-[#53c97d] shadow-md shadow-[#53c97d]/50">
                  {!profileImage ? (
                    <img
                      src={
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                      }
                      alt={username}
                      className="w-full h-full object-cover"
                    />
                  ) : profileImage.includes(
                    "https://lh3.googleusercontent.com"
                  ) ? (
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

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-700"
                  >
                    <button className="flex items-center space-x-3 px-4 py-2 text-gray-200 hover:bg-gray-700 w-full">
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </button>
                    <button className="flex items-center space-x-3 px-4 py-2 text-gray-200 hover:bg-gray-700 w-full">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={() => signOut({ callbackUrl: "/auth/signup" })}
                      className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        <section
          className={`space-y-4 overflow-hidden h-full flex flex-col flex-grow transition-all duration-300  ${isRecentActivitiesOpen ? "max-h-[400px] opacity-100 " : "max-h-0 opacity-0 pointer-events-none"
            }`}
        >
          <h2 className="bg-gray-900 w-full h-[2rem] text-lg font-semibold text-[#53c97d] sticky top-0 z-10">
            Recent Activities
          </h2>
          <div className="bg-gray-800 rounded-xl p-3 max-h-[400px] z-10 flex-grow overflow-y-auto shadow-lg">
            {activities.length > 0 ? (
              activities
                .filter((activity) => activity.id === session?.user?.id)
                .map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 mt-2 rounded-md hover:bg-gray-700 transition ease-in-out duration-300"
                  >
                    {activity.user.avatar.includes("https://lh3.googleusercontent.com") ? (
                      <img src={activity.user.avatar} alt={activity.user.name} className="w-10 h-10 rounded-full border border-gray-700" />
                    ) : (
                      <CldImage src={activity.user.avatar} width={50} height={50} alt={activity.user.name} className="rounded-full w-12 h-12" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        <span className="font-medium">{activity.user.name}</span> {activity.text}
                      </p>
                      <p className="text-xs text-gray-400">{activity.timestamp}</p>
                    </div>
                    {activity.type === "like" && <Heart className="w-5 h-5 text-red-500" />}
                    {activity.type === "follow" && <UserPlus2 className="w-5 h-5 text-green-500" />}
                    {activity.type === "comment" && <MessageSquare className="w-5 h-5 text-purple-500" />}
                  </motion.div>
                ))
            ) : (
              <p className="text-gray-400 mt-8 text-sm text-center">No recent activities</p>
            )}
          </div>
        </section>
      </AnimatePresence>

      {/* Post Modal */}
      <div className="flex items-center justify-center">
        <PostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
);
}
