"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { IWorkshop } from "@/types";
import { Types } from "mongoose";
import { generateCallID } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface WorkshopCardProps {
  workshop: IWorkshop & { host: { _id: Types.ObjectId; name: string } };
  isHost?: boolean;
  isPast?: boolean;
  showStartButton?: boolean;
  onStartWorkshop?: (id: string) => void;
}

export default function WorkshopCard({
  workshop,
  isHost = false,
  isPast = false,
  showStartButton = false,
  onStartWorkshop,
}: WorkshopCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  const callID = generateCallID(
    workshop._id.toString(),
    workshop.host._id.toString()
  );

  const handleJoinWorkshop = () => {
    setIsJoining(true);
    router.push(`/call/${callID}`);
    // Simulate API call
    // setTimeout(() => {
    //   setIsJoining(false);
    //   alert(`Joined workshop: ${workshop.title}`);
    // }, 1000);
  };

  const handleStartWorkshop = () => {
    if (onStartWorkshop) {
      onStartWorkshop(workshop._id.toString());
    }
    router.push(`/call/${callID}`);
  };

  const getTimeLeft = (meetingTime: string) => {
    const currentDate = new Date();

    const diffMs = new Date(meetingTime).getTime() - currentDate.getTime(); // Difference in milliseconds

    if (diffMs <= 0) {
      return "Meeting has started!";
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Convert to hours
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes

    if (diffHours > 1) {
      return `Starts in ${diffHours} hours`;
    } else {
      return `Starts in ${diffMinutes} min`;
    }
  };

  // Example usage
  const meetingTime = "2025-03-06T14:30:00.000Z";

  const hasStarted = new Date() >= new Date(workshop.startTime);

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow min-w-[300px]  rounded-xl bg-white text-center">
      <div className="relative h-48 w-full">
        <Image
          src={workshop.bannerImage}
          alt={workshop.title}
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant={
              isPast ? "secondary" : hasStarted ? "destructive" : "default"
            }
            className="bg-white rounded-full"
          >
            {isPast ? "Completed" : hasStarted ? "In Progress" : "Upcoming"}
          </Badge>
        </div>
        {isHost && (
          <div className="absolute top-2 left-2">
            <Badge variant="outline" className="bg-background/80">
              Host
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-semibold line-clamp-2">{workshop.title}</h3>
        <p className="text-sm text-muted-foreground font-semibold">
          Hosted by{" "}
          <span className="text-theme">
            {" "}
            {workshop?.host?.name.toUpperCase()}{" "}
          </span>
        </p>
      </CardHeader>

      <CardContent className="flex-grow ">
        <p className="text-sm line-clamp-3 mb-4">{workshop.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 justify-center">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(workshop.startTime).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(workshop.startTime).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "numeric",
              })}
            </span>
            {!isPast && (
              <span className="text-muted-foreground">
                {getTimeLeft(workshop.startTime.toString())}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 justify-center">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {workshop.participants?.length || 0} /
              {workshop.maxParticipants ? workshop.maxParticipants : "∞"}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <Badge
              variant="outline"
              className=" border-theme rounded-full border-2"
            >
              {workshop.category}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {isPast ? (
          <Button
            variant="outline"
            className="w-full bg-theme rounded-full"
            disabled
          >
            Completed
          </Button>
        ) : isHost && showStartButton ? (
          <Button
            className="w-full bg-theme rounded-full"
            onClick={handleStartWorkshop}
          >
            <Video className="mr-2 h-4 w-4" />
            Start Now
          </Button>
        ) : (
          <Button
            variant={isHost ? "outline" : "default"}
            className="w-full bg-theme text-white rounded-full"
            disabled={isJoining || isHost || !workshop.isStarted}
            onClick={handleJoinWorkshop}
          >
            {isJoining ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent " />
                Joining...
              </>
            ) : isHost ? (
              "You're the host"
            ) : (
              "Join Workshop"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
