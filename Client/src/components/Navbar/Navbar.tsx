"use client"
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
  
  export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { data: session } = useSession();
    const [username, setUsername] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileImage, setProfileImage] = useState("");
        const [cloudinaryImage, setCloudinaryImage] = useState("");
     const [IscloudinaryImage,setIsCloudinaryImage] = useState(false)
        
        const pathname = usePathname();

    useEffect(() => {
          if (!session?.user?.id) return;
          console.log("useEffect called")
          const fetchUnameInterest = async () => {
            const response = await fetch("/api/getUnameInterest", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: session?.user?.id }),
            })
            const data = await response.json();
            if (data) {
              setUsername(data.username);
              //setInterest(data.interest);
              if(!data.image){
                setIsCloudinaryImage(false)
               setCloudinaryImage("")
                setProfileImage("data:image/png;base64,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")
              }
              else if (data.image && data.image.includes("https://lh3.googleusercontent.com")) {
                setProfileImage(data.image);
               setIsCloudinaryImage(false)
               setCloudinaryImage("")
    
              } else {
                setIsCloudinaryImage(true)
                setCloudinaryImage(data.image)
              
                setProfileImage("");
              }
            }
      
      
           
          }
          fetchUnameInterest();
        }, [session, pathname]);

        console.log("cloudinary image at navbar: ",cloudinaryImage)
        console.log("profile image at navbar: ",profileImage)

    return (
      <>
      <nav className="fixed top-0 left-0 right-0 h-20 bg-gray-900 border-b border-gray-800 z-50">
        <div className="max-w-full mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center ">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Interkonnekt
              </h1>
            </div>
  
            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
  
            {/* Right Elements */}
            <div className="flex items-center space-x-4">
              <button className="hidden md:flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-5 w-5" />
                <span>Add Post</span>
              </button>
  
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative">
                <Bell className="h-6 w-6 text-gray-400" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
  
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative">
                <MessageSquare className="h-6 w-6 text-gray-400" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  5
                </span>
              </button>
  
              <div className="relative">
                <button
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-800 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                 <div className=" w-12 h-12  rounded-full">
          {IscloudinaryImage ? (
            <CldImage
            src={cloudinaryImage}
            alt="Profile Image"
            width={80}
            height={60}
             className="w-full h-full object-cover rounded-full"
          />
          ):(profileImage &&
<img
            src={profileImage }
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          )
          
          }
          
          
        </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
  
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-1 z-10 border border-gray-800">
                    <button className="flex items-center space-x-3 px-4 py-2 text-gray-200 hover:bg-gray-800 w-full text-left">
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </button>
                    <button className="flex items-center space-x-3 px-4 py-2 text-gray-200 hover:bg-gray-800 w-full text-left">
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-1 border-gray-800" />
                    <button className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-800 w-full text-left">
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
  
        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>
      <div className="flex items-center justify-center ">
      <PostModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)}/>
      </div>
      </>
    );
  }
 
  