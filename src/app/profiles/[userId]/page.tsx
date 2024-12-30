"use client"
import Navbar from "@/components/Navbar/Navbar";
import { FC, useEffect, useState } from "react";
import LeftSide from "@/components/LeftSide/LeftSide";
import Middle from "@/components/middle/Middle"
import RightSide from "@/components/RightSide/RightSide";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/PrivateRoute/PrivateRoute";
import { useSession } from "next-auth/react";
import User from "@/models/user";
import { SessionUser, UserProps } from "@/types";
import { SessionProvider } from "next-auth/react";
import Profile from "@/components/Profile/Profile";
//import { useRouter } from "next/router";


interface user {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  image?: string;
  provider?: string;
}

const MainPage:FC = () => {
  const [token, setToken] = useState<string | null>(null);
//   const [userId, setUserId] = useState<string>("");

//   useEffect(() => {
//     const path = window.location.pathname; // e.g., /profile/[userId]
//     const id = path.split("/").pop(); // Extracts the userId
//     setUserId(id || '');
//   }, []);
// console.log("userId at profile: ",userId)

// const router = useRouter();
// const { userId } = router.useSearchParams as { userId: string };

const params = useSearchParams();
const userId = params.get("userId");
console.log("userId at profile: ",userId)

      
    return(
      <ProtectedRoute>
        <SessionProvider>
        <div className="">
        <Navbar/>
        <div className="grid grid-cols-4 top-20 absolute">
        <LeftSide />
        <div className="col-span-2">
       <Profile userId={userId}/>
        </div>
        <RightSide/>
        </div>
        </div>
        </SessionProvider>
        </ProtectedRoute>
    )
}

export default MainPage