"use client"
import Navbar from "@/components/Navbar/Navbar";
import { FC, useEffect, useState } from "react";
import LeftSide from "@/components/LeftSide/LeftSide";
import Middle from "@/components/middle/Middle"
import RightSide from "@/components/RightSide/RightSide";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/PrivateRoute/PrivateRoute";
import { useSession } from "next-auth/react";
import User from "@/models/user";
import { SessionUser, UserProps } from "@/types";
import { SessionProvider } from "next-auth/react";


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
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch(`/api/getToken`, {
          method: 'GET',
          headers: { "Content-Type": "application/json" },
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          const errorData = await response.json();
          router.push("/auth/signin")
          console.log('Error:', errorData.error);
          return;
        }

        const data = await response.json();
        console.log("Token data:", data);

        setToken(data.token); // Store the token in state
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };

    getToken();
  }, []); 

  // const { data: session } = useSession();

  // if (!session) return <p>Loading...</p>;

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
      
    return(
      <ProtectedRoute>
        <SessionProvider>
        <div className="">
        <Navbar/>
        <div className="grid grid-cols-4 top-20 absolute ">
        <LeftSide />
        <div className="col-span-2 overflow-hidden">
        <Middle />
        </div>
        <RightSide/>
        </div>
        </div>
        </SessionProvider>
        </ProtectedRoute>
    )
}

export default MainPage