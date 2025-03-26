"use client";

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useParams, useSearchParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import { ADD_PARTICIPANT_WORKSHOP, START_WORKSHOP } from "@/lib/constant";
import { useSession } from "next-auth/react";

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const call = useCall();

  const { callId } = useParams();
  const isWorkshop = callId?.toString().startsWith("workshop");
  const { data: session } = useSession();

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  const handleJoinMeeting = async () => {
    if (!call || isJoining) return;

    if (isWorkshop) {
      const url = callId?.toString().split("-");
      const workshopId = url![1];
      const hostId = url![2];
      const isHost = session?.user?.id === hostId;

      if (isHost) {
        const res = await apiClient.put(
          `${START_WORKSHOP}`,
          {
            workshopId,
            meetingLink: window.location.href,
          },
          {
            withCredentials: true,
          }
        );
        if (res.status !== 200) {
          return;
        }
      } else {
        const res = await apiClient.put(
          `${ADD_PARTICIPANT_WORKSHOP}`,
          {
            workshopId,
          },
          {
            withCredentials: true,
          }
        );
        if (res.status !== 200) {
          return;
        }
      }
    }

    setIsJoining(true);

    try {
      await call.join();
      setIsSetupComplete(true);
    } catch (err) {
      console.error("Failed to join the call:", err);
      alert(`Failed to join the call: ${err.message || "Unknown error"}`);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold"> Setup </h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-xl bg-green-500 px-4 py-2.5"
        onClick={handleJoinMeeting}
        disabled={isJoining}
      >
        {isJoining ? "Joining..." : "Join Meeting"}
      </Button>
    </div>
  );
};

export default MeetingSetup;
