"use client"
import { UserProps } from "@/types";
import {
    Home,
    Compass,
    Users,
    MessageSquare,
    User,
    Video,
    LogOut,
  } from "lucide-react";
import { set } from "mongoose";
import { signOut, useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { useRouter, usePathname } from "next/navigation";
 
  import React, { FC, useEffect, useState } from "react";
  const LeftSide:FC = () => {
    const [activeLink, setActiveLink] = useState("home");
    const { data: session } = useSession();
    const [username, setUsername] = useState("");
    console.log("session answer: ",session)
    const [signInMethod, setSignInMethod] = useState("");
    const router = useRouter();
    const [profileImage, setProfileImage] = useState("data:image/png;base64,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");
    const [cloudinaryImage, setCloudinaryImage] = useState("");

    
    const pathname = usePathname();
  
    useEffect(() => {
      // Automatically set the active link based on the current pathname
      if (pathname === "/profile") {
        setActiveLink("profile");
      }
      if (pathname === "/messages") {
        setActiveLink("messages");
      }
      if (pathname === "/communities") {
        setActiveLink("communities");
      }
      if (pathname === "/explore") {
        setActiveLink("explore");
      }
      if (pathname === "/main") {
        setActiveLink("home");
      }
    }, [pathname,activeLink]);
  
    useEffect(() => {
      // Determine sign-in method from session
      if (session && session.user && session.user.provider) {
        setSignInMethod(session.user.provider === "google" ? "google" : "normal");
      }
    }, [session]);
    console.log("signin method: ",signInMethod)

    useEffect(() => {
      if (!session?.user?.email) return;
      console.log("useEffect called")
      const fetchUnameInterest = async () => {
        const response = await fetch("/api/getUnameInterest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session?.user?.email }),
        })
        const data = await response.json();
        if (data) {
          setUsername(data.username);
          //setInterest(data.interest);
          if (data.image && data.image.includes("https://lh3.googleusercontent.com")) {
            setProfileImage(data.image);
            setCloudinaryImage("");

          } else {
            setCloudinaryImage(data.image)
          
            //setProfileImage("");
          }
        }
  
  
       
      }
      fetchUnameInterest();
    }, [session, pathname]);

    console.log("cloudinary image: ",cloudinaryImage)
    console.log("profile image: ",profileImage)

    // const { name, email, image, username } = session?.user;
    // const handleLogout = async () => {
    //   console.log("handlelogout called")
    //   if (signInMethod == "google") {
    //     console.log("Logging out Google user");
    //     signOut({ callbackUrl: "/auth/signup" });
    //   } 
    //   // else if (signInMethod === "github") {
    //   //   console.log("Logging out GitHub user");
    //   //   signOut({ callbackUrl: "/auth/signup" });
    //   // }
    //    else {
    //     console.log("Logging out normal user");
    //     await fetch('/api/logout', { method: 'POST' });
    //   }
    // };

    return (
      <aside className=" flex flex-col h-[89vh] w-96 bg-gray-900 text-white p-4">
        {/* Profile Section */}
        <div className="flex items-center gap-3 w-20 h-16 mb-8 px-2 rounded-full">
          {cloudinaryImage ? (
            <CldImage
            src={cloudinaryImage}
            alt="Profile Image"
            width={80}
            height={60}
             className="w-full h-full object-cover rounded-full"
          />
          ):(profileImage &&
<img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          )
          
          }
          
          <span className="font-medium">{username || session?.user?.name}</span>
        </div>
  
        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            <li onClick={() => setActiveLink("home")}>
              <button
                onClick={() => router.push("/main")}
                className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeLink === "home" ? "bg-[#3b82f6] text-white" : "hover:bg-white/10"}`}
              >
                <Home size={20} />
                <span>Home</span>
              </button>
            </li>
  
            <li onClick={() => setActiveLink("explore")}>
              <button
                onClick={() => router.push("/explore")}
                className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeLink === "explore" ? "bg-[#3b82f6] text-white" : "hover:bg-white/10"}`}
              >
                <Compass size={20} />
                <span>Explore</span>
              </button>
            </li>
  
            <li onClick={() => setActiveLink("communities")}>
              <button
                onClick={() => router.push("/communities")}
                className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeLink === "communities" ? "bg-[#3b82f6] text-white" : "hover:bg-white/10"}`}
              >
                <Users size={20} />
                <span>Communities</span>
              </button>
            </li>
  
            <li onClick={() => setActiveLink("messages")}>
              <button
                onClick={() => router.push("/messages")}
                className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeLink === "messages" ? "bg-[#3b82f6] text-white" : "hover:bg-white/10"}`}
              >
                <MessageSquare size={20} />
                <span>Messages</span>
              </button>
            </li>
  
            <li onClick={() => setActiveLink("profile")}>
              <button
                onClick={() => router.push(`/profile/?userId=${session?.user?.id}`)}
                className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeLink === "profile" ? "bg-[#3b82f6] text-white" : "hover:bg-white/10"}`}
              >
                <User size={20} />
                <span>Profile</span>
              </button>
            </li>
          </ul>
        </nav>
  
        {/* Video Call Button */}
        <button className="flex items-center justify-center gap-2 w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2 px-4 rounded-lg mb-4 transition-colors">
          <Video size={20} />
          <span>Start Video Call</span>
        </button>
  
        {/* Logout Button */}
        <button onClick={()=> signOut({ callbackUrl: "/auth/signup" })} className="flex items-center gap-3 px-3 py-2 w-full hover:bg-white/10 rounded-lg transition-colors">
          <LogOut size={20} />
          <span >Logout</span>
        </button>
      </aside>
    );
  }

  export default LeftSide
  
  