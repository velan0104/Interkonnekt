"use client";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Explore from "@/components/Explore/Explore";

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
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          router.push("/auth/signin");
          console.log("Error:", errorData.error);
          return;
        }

        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    getToken();
  }, []);

  return <Explore />;
};

export default MainPage;
