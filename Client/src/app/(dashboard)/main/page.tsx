"use client";
import { FC, useEffect, useState } from "react";
import Middle from "@/components/middle/Middle";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

  if (session?.user !== undefined) return <Middle userId={session?.user?.id} />;
  else <h1> Loading Main Page.... </h1>;
};

export default MainPage;
