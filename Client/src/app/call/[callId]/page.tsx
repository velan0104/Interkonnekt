"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useStreamVideoClient,
  Call,
  StreamCall,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import MeetingSetup from "@/components/VideoCall/MeetingSetup";
import MeetingRoom from "@/components/VideoCall/MeetingRoom";

const CallRoom = () => {
  const { callId } = useParams<{ callId: string }>();
  const router = useRouter();
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  useEffect(() => {
    if (!client || !callId) return;

    const newCall = client.call("default", callId);

    // Create the call if it doesn't exist
    newCall
      .getOrCreate()
      .then(() => {
        setCall(newCall); // Set the call object after creation
      })
      .catch((err) => {
        console.error("Failed to create or fetch the call:", err);
        setError("Failed to create or fetch the call. Please try again.");
      });

    return () => {
      newCall.leave();
    };
  }, [client, callId]);

  if (error) {
    return <p className="text-white">{error}</p>;
  }

  if (!call) {
    return <div className="loader"> Loading Call Page... </div>;
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
      </StreamTheme>
    </StreamCall>
  );
};

export default CallRoom;
