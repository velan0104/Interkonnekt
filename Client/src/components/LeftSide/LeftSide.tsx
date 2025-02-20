// "use client";
// import { UserProps } from "@/types";
// import {
//   Home,
//   Compass,
//   Users,
//   MessageSquare,
//   User,
//   Video,
//   LogOut,
// } from "lucide-react";
// import { set } from "mongoose";
// import { signOut, useSession } from "next-auth/react";
// import { CldImage } from "next-cloudinary";
// import { useRouter, usePathname } from "next/navigation";
// import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
// import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import Image from "next/image"
// import { cn } from "@/lib/utils"
// import React, { FC, useEffect, useState } from "react";
// const LeftSide: FC = () => {
//   const [activeLink, setActiveLink] = useState("home");
//   const { data: session } = useSession();
//   const [username, setUsername] = useState("");
  
//   const [signInMethod, setSignInMethod] = useState("");
//   const router = useRouter();
//   const [profileImage, setProfileImage] = useState("");
//   const [cloudinaryImage, setCloudinaryImage] = useState("");
//   const [IscloudinaryImage, setIsCloudinaryImage] = useState(false);
//   const [interest, setInterest] = useState("");

//   const pathname = usePathname();
 

//   useEffect(() => {
//     // Automatically set the active link based on the current pathname
//     if (pathname === "/profile") {
//       setActiveLink("profile");
//     }
//     if (pathname === "/messages") {
//       setActiveLink("messages");
//     }
//     if (pathname === "/communities") {
//       setActiveLink("communities");
//     }
//     if (pathname === "/explore") {
//       setActiveLink("explore");
//     }
//     if (pathname === "/main") {
//       setActiveLink("home");
//     }
//   }, [pathname, activeLink]);

//   useEffect(() => {
//     // Determine sign-in method from session
//     if (session && session.user && session.user.provider) {
//       setSignInMethod(session.user.provider === "google" ? "google" : "normal");
//     }
//   }, [session]);
  

//   useEffect(() => {
//     if (!session?.user?.id) return;
   
//     const fetchUnameInterest = async () => {
//       const response = await fetch("/api/getUnameInterest", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: session?.user?.id }),
//       });
//       const data = await response.json();
     
//       if (data) {
//         setUsername(data.username);
//         setInterest(data.interest);
//         if (!data.image) {
//           setIsCloudinaryImage(false);
//           setCloudinaryImage("");
//           setProfileImage(
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
//           );
//         } else if (
//           data.image &&
//           data.image.includes("https://lh3.googleusercontent.com")
//         ) {
//           setIsCloudinaryImage(false);
//           setProfileImage(data.image);
          
//           setCloudinaryImage("");
//         } else {
//           setIsCloudinaryImage(true);
//           setCloudinaryImage(data.image);

//           setProfileImage("");
//         }
//       }
//     };
//     fetchUnameInterest();
//   }, [session, pathname]);

 

  

//   return (
//     <aside className="hidden md:flex flex-col h-[89vh] w-96 bg-gray-900 text-white p-5 shadow-lg  backdrop-blur-sm">
//       {/* Profile Section */}
//       <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 shadow-md mb-8">
//         {IscloudinaryImage ? (
//           <CldImage
//             src={cloudinaryImage}
//             alt="Profile Image"
//             width={80}
//             height={60}
//             className="w-14 h-14 object-cover rounded-full border-2 border-blue-500 shadow-lg shadow-blue-600/50"
//           />
//         ) : (
//           <img
//             src={profileImage}
//             alt="Profile"
//             className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-lg shadow-blue-600/50"
//           />
//         )}
  
//         <span className="text-lg font-semibold tracking-wide">{username || session?.user?.name}</span>
//       </div>
  
//       {/* Navigation Links */}
//       <nav className="flex-1">
//         <ul className="space-y-2">
//           {[
//             { label: "Home", icon: <Home size={20} />, route: "/main", id: "home" },
//             { label: "Explore", icon: <Compass size={20} />, route: "/explore", id: "explore" },
//             { label: "Communities", icon: <Users size={20} />, route: "/communities", id: "communities" },
//             { label: "Messages", icon: <MessageSquare size={20} />, route: "/messages", id: "messages" },
//             { label: "Profile", icon: <User size={20} />, route: `/profile/?userId=${session?.user?.id}`, id: "profile" },
//           ].map(({ label, icon, route, id }) => (
//             <li key={id} onClick={() => setActiveLink(id)}>
//               <button
//                 onClick={() => router.push(route)}
//                 className={`w-full flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 
//                   ${
//                     activeLink === id
//                       ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50 border-l-4 border-blue-500"
//                       : "hover:bg-white/10"
//                   }`}
//               >
//                 {icon}
//                 <span className="font-medium text-[16px] tracking-wide">{label}</span>
//               </button>
//             </li>
//           ))}
//         </ul>
//       </nav>
  
//       {/* Video Call Button */}
//       <button className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-5 rounded-lg mb-4 shadow-lg transition-all transform hover:scale-105">
//         <Video size={22} />
//         <span>Start Video Call</span>
//       </button>
  
//       {/* Logout Button */}
//       {/* Logout Button */}
// <button
//   onClick={() => signOut({ callbackUrl: "/auth/signup" })}
//   className="flex items-center justify-center gap-4 px-5 py-3 w-full bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 
//              shadow-md hover:bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/50 
//              transform hover:scale-105 border border-transparent hover:border-white"
// >
//   <LogOut size={22} />
//   <span className="text-lg">Logout</span>
// </button>

//     </aside>
//   );
  
// };

// export default LeftSide;

"use client"
import { useEffect, useState } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { CldImage } from "next-cloudinary"


import {signOut } from "next-auth/react";
import { Home, Compass, Users, MessageSquare, User, Video, LogOut } from "lucide-react";


export default function SidebarDemo() {
  const { data: session } = useSession();
  const [activeLink, setActiveLink] = useState("home");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [cloudinaryImage, setCloudinaryImage] = useState("");
  const [IscloudinaryImage, setIsCloudinaryImage] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchUnameInterest = async () => {
      const response = await fetch("/api/getUnameInterest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      const data = await response.json();
      if (data) {
        setUsername(data.username);
        if (!data.image) {
          setIsCloudinaryImage(false);
          setProfileImage(
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
          );
        } else if (data.image.includes("https://lh3.googleusercontent.com")) {
          setIsCloudinaryImage(false);
          setProfileImage(data.image);
        } else {
          setIsCloudinaryImage(true);
          setCloudinaryImage(data.image);
        }
      }
    };
    fetchUnameInterest();
  }, [session]);

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

  const links = [
    { label: "Home", href: "/main", icon: <Home size={20} /> },
    { label: "Explore", href: "/explore", icon: <Compass size={20} /> },
    { label: "Communities", href: "/communities", icon: <Users size={20} /> },
    { label: "Messages", href: "/messages", icon: <MessageSquare size={20} /> },
    { label: "Profile", href: `/profile/?userId=${session?.user?.id}`, icon: <User size={20} /> },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="md:flex contents h-screen bg-gray-900">
      {/* Sidebar for Large Screens */}
      <aside className="hidden md:flex flex-col w-80 xl:w-96 h-[89%]  bg-gray-900 text-white p-5 shadow-lg fixed left-0  z-40">
        {/* Profile Section */}
        <div className="flex items-center gap-4 p-4  bg-gradient-to-r from-gray-800 to-gray-700 shadow-md mb-8 rounded-xl">
          {IscloudinaryImage ? (
            <CldImage
              src={cloudinaryImage}
              alt="Profile Image"
              width={80}
              height={60}
              className="w-14 h-14 object-cover rounded-full border-2 border-blue-500 shadow-lg shadow-blue-600/50"
            />
          ) : (
            <img
              src={profileImage}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-lg shadow-blue-600/50"
            />
          )}
          <span className="text-lg font-semibold tracking-wide">{username || session?.user?.name}</span>
        </div>
  
        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {[
              { label: "Home", icon: <Home size={20} />, route: "/main", id: "home" },
              { label: "Explore", icon: <Compass size={20} />, route: "/explore", id: "explore" },
              { label: "Communities", icon: <Users size={20} />, route: "/communities", id: "communities" },
              { label: "Messages", icon: <MessageSquare size={20} />, route: "/messages", id: "messages" },
              { label: "Profile", icon: <User size={20} />, route: `/profile/?userId=${session?.user?.id}`, id: "profile" },
            ].map(({ label, icon, route, id }) => (
              <li key={id} onClick={() => setActiveLink(id)}>
                <button
                  onClick={() => router.push(route)}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 
                    ${
                      activeLink === id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50 border-l-4 border-blue-500"
                        : "hover:bg-white/10"
                    }`}
                >
                  {icon}
                  <span className="font-medium text-[16px] tracking-wide">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
  
        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/auth/signup" })}
          className="flex items-center justify-center gap-4 px-5 py-3 w-full bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 
                     shadow-md hover:bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/50 
                     transform hover:scale-105 border border-transparent hover:border-white"
        >
          <LogOut size={22} />
          <span className="text-lg">Logout</span>
        </button>
      </aside>
  
      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-80 xl:ml-96 p-6 bg-gray-900">
        <div className="container mx-auto space-y-6">
          {/* Dynamic Content Here */}
        </div>
      </main>
  
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 shadow-lg flex justify-around py-3 border-t border-gray-700 z-50">
        {links.map(({ label, href, icon }, idx) => (
          <Link key={idx} href={href}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex flex-col items-center text-gray-300 transition-all duration-300 px-3 py-2 rounded-md",
                activeLink === label.toLowerCase() && "text-blue-600"
              )}
            >
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 shadow-md shadow-blue-600/30">
                {icon}
              </span>
              <span className="text-xs mt-1">{label}</span>
            </motion.button>
          </Link>
        ))}
      </div>
    </div>
  );
  
}



const Dashboard = () => (
  <div className="flex flex-1 p-10 bg-white dark:bg-neutral-900">
    <div className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse" />
  </div>
);
