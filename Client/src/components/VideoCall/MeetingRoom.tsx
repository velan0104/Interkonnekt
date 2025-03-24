import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CallControls,
  SpeakerLayout,
  CallStatsButton,
  CallParticipantsList,
  PaginatedGridLayout,
  useCall,
} from "@stream-io/video-react-sdk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api-client";
import { ON_WORKSHOP_COMPLETION } from "@/lib/constant";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const [showParticipants, setShowParticipants] = useState<boolean>(false);
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");

  const { callId } = useParams();
  const router = useRouter();
  const call = useCall();
  const { data: session } = useSession();
  const url = callId?.toString().split("-");
  const hostId = url![2];
  const workshopId = url![1];
  // console.log("SESSION ID: " + session?.user?.id + " host: " + hostId);

  const isHost = session?.user?.id === hostId;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="left" />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="right" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  const handleEndCall = async () => {
    await call?.endCall();
    const res = await apiClient.post(
      `${ON_WORKSHOP_COMPLETION}`,
      {
        workshopId,
      },
      {
        withCredentials: true,
      }
    );
    router.push("/main");
  };
  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        {/* For showing participants list  */}
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2 ", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls onLeave={() => router.push("/main")} />
        <DropdownMenu>
          <div className="flex items-center ">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-left", "Speaker-right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setLayout(item.toLowerCase() as CallLayoutType);
                  }}
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users />
          </div>
        </button>
        {isHost && (
          <Button
            onClick={() => handleEndCall()}
            className="bg-yellow-500 rounded-xl"
          >
            {" "}
            End Call for everyone{" "}
          </Button>
        )}
      </div>
    </section>
  );
};

export default MeetingRoom;
