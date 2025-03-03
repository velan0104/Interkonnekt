"use client";
import { tokenProvider } from "@/components/VideoCall/action";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useRef } from "react";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const videoClient = useRef<StreamVideoClient | null>(null); // Use useRef instead of useState
  const { data: session } = useSession();
  const sessionUser = session?.user;
  console.log("Stream Video Provider initialized.");

  useEffect(() => {
    if (!session?.user || !apiKey) return;

    console.log("Initializing StreamVideo client...");
    videoClient.current = new StreamVideoClient({
      apiKey,
      user: {
        id: sessionUser?.id,
        name: sessionUser?.name || sessionUser?.id,
        image: sessionUser?.image || undefined,
      },
      tokenProvider: tokenProvider,
    });

    console.log("VIDEO CALL: ", videoClient.current);

    // Cleanup function
    return () => {
      if (videoClient.current) {
        console.log("Disconnecting StreamVideo client...");
        videoClient.current.disconnectUser();
        videoClient.current = null;
      }
    };
  }, [sessionUser?.id]); // Only re-initialize when sessionUser.id changes

  // if (!videoClient.current) {
  //   return <div>Loading Stream Client...</div>;
  // }

  return <StreamVideo client={videoClient.current}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
