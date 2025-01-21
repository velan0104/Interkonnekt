"use client";
import Navbar from "@/components/Navbar/Navbar";
import { FC, useEffect, useState } from "react";
import LeftSide from "@/components/LeftSide/LeftSide";
import Middle from "@/components/middle/Middle";
import RightSide from "@/components/RightSide/RightSide";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/PrivateRoute/PrivateRoute";
import { useSession } from "next-auth/react";
import User from "@/models/user";
import { SessionUser, UserProps } from "@/types";
import { SessionProvider } from "next-auth/react";
import jwt from "jsonwebtoken";
import { generateToken } from "@/lib/utils";


interface user {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  image?: string;
  provider?: string;
}

const MainPage: FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(`/api/getToken`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include cookies in the request
        });

        if (!response.ok) {
          const errorData = await response.json();
          router.push("/auth/signin");
          console.log("Error:", errorData.error);
          return;
        }

        const data = await response.json();
        console.log("Token data:", data);

        setToken(data.token); // Store the token in state
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    getToken();
  }, []);

  const { data: session } = useSession();

  useEffect(() => {
    // Ensure code runs only in the client-side environment
    if (typeof window !== "undefined") {
      if (session) {
        localStorage.setItem("auth_token", JSON.stringify(session.user?.id));
      } else {
        localStorage.setItem("auth_token", "");
      }
    }
  }, [session]);

   if(!session){
    return (
      <div className="bg-gray-900 h-screen w-screen">
       <NavbarSkeleton />
       <SidebarSkeleton />
       <SkeletonLoader />
       
      </div>
    );
   }

  // // Safely destructure session.user with a check
  // const user = session.user as SessionUser | undefined;

  // if (!user) return <p>User not found</p>;

  // const { name, email, image, username } = user;
  // console.log("token at frontend: ",token)
  // const session = await auth();
  // console.log("values: ",image)

  // const userProps:UserProps = {
  //   username,
  //   image,
  // };

  return <Middle userId={session?.user?.id} />;
};

export default MainPage;
