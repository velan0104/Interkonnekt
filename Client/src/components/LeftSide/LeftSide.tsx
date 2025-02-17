"use client";
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
const LeftSide: FC = () => {
  const [activeLink, setActiveLink] = useState("home");
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  console.log("session answer: ", session);
  const [signInMethod, setSignInMethod] = useState("");
  const router = useRouter();
  const [profileImage, setProfileImage] = useState("");
  const [cloudinaryImage, setCloudinaryImage] = useState("");
  const [IscloudinaryImage, setIsCloudinaryImage] = useState(false);
  const [interest, setInterest] = useState("");

  const pathname = usePathname();
  console.log("SESSION USER: ", session?.user);

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
  }, [pathname, activeLink]);

  useEffect(() => {
    // Determine sign-in method from session
    if (session && session.user && session.user.provider) {
      setSignInMethod(session.user.provider === "google" ? "google" : "normal");
    }
  }, [session]);
  console.log("signin method: ", signInMethod);

  useEffect(() => {
    if (!session?.user?.id) return;
    //console.log("useEffect called")
    const fetchUnameInterest = async () => {
      const response = await fetch("/api/getUnameInterest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      const data = await response.json();
      console.log("data at LeftSide: ", data);
      if (data) {
        setUsername(data.username);
        setInterest(data.interest);
        if (!data.image) {
          setIsCloudinaryImage(false);
          setCloudinaryImage("");
          setProfileImage(
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
          );
        } else if (
          data.image &&
          data.image.includes("https://lh3.googleusercontent.com")
        ) {
          setIsCloudinaryImage(false);
          setProfileImage(data.image);

          setCloudinaryImage("");
        } else {
          setIsCloudinaryImage(true);
          setCloudinaryImage(data.image);

          setProfileImage("");
        }
      }
    };
    fetchUnameInterest();
  }, [session, pathname]);

  // console.log("cloudinary image: ", cloudinaryImage);
  // console.log("profile image: ", profileImage);

  return (
    <aside className=" flex flex-col h-[89vh] w-96 bg-gray-900 text-white p-4 ">
      {/* Profile Section */}
      <div className="flex items-center gap-3 w-20 h-16 mb-8 px-2 rounded-full ">
        {IscloudinaryImage ? (
          <CldImage
            src={cloudinaryImage}
            alt="Profile Image"
            width={80}
            height={60}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        )}

        <span className="font-medium">{username || session?.user?.name}</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li onClick={() => setActiveLink("home")}>
            <button
              onClick={() => router.push("/main")}
              className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                activeLink === "home"
                  ? "bg-[#3b82f6] text-white"
                  : "hover:bg-white/10"
              }`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
          </li>

          <li onClick={() => setActiveLink("explore")}>
            <button
              onClick={() => router.push("/explore")}
              className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                activeLink === "explore"
                  ? "bg-[#3b82f6] text-white"
                  : "hover:bg-white/10"
              }`}
            >
              <Compass size={20} />
              <span>Explore</span>
            </button>
          </li>

          <li onClick={() => setActiveLink("communities")}>
            <button
              onClick={() => router.push("/communities")}
              className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                activeLink === "communities"
                  ? "bg-[#3b82f6] text-white"
                  : "hover:bg-white/10"
              }`}
            >
              <Users size={20} />
              <span>Communities</span>
            </button>
          </li>

          <li onClick={() => setActiveLink("messages")}>
            <button
              onClick={() => router.push("/messages")}
              className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                activeLink === "messages"
                  ? "bg-[#3b82f6] text-white"
                  : "hover:bg-white/10"
              }`}
            >
              <MessageSquare size={20} />
              <span>Messages</span>
            </button>
          </li>

          <li onClick={() => setActiveLink("profile")}>
            <button
              onClick={() =>
                router.push(`/profile/?userId=${session?.user?.id}`)
              }
              className={`w-[70%] flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                activeLink === "profile"
                  ? "bg-[#3b82f6] text-white"
                  : "hover:bg-white/10"
              }`}
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
      <button
        onClick={() => signOut({ callbackUrl: "/auth/signup" })}
        className="flex items-center gap-3 px-3 py-2 w-full hover:bg-white/10 rounded-lg transition-colors"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default LeftSide;
