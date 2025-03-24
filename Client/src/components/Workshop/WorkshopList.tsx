"use client";

import { useState, useEffect } from "react";
import WorkshopCard from "./WorkshopCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { GET_WORKSHOP_FOR_COMMUNITY } from "@/lib/constant";
import apiClient from "@/lib/api-client";
import { IWorkshop } from "@/types";
import { Types } from "mongoose";

// Mock workshop data - replace with actual API calls
const mockWorkshops = [
  {
    _id: "1",
    title: "Introduction to React",
    description: "Learn the basics of React and build your first component.",
    host: { _id: "user1", name: "John Doe" },
    participants: [],
    startTime: new Date(Date.now() + 10 * 60000), // 10 minutes from now
    category: "Programming",
    bannerImage:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    maxParticipants: 20,
    isCompleted: false,
  },
  {
    _id: "2",
    title: "Advanced TypeScript",
    description: "Deep dive into TypeScript features and best practices.",
    host: { _id: "user1", name: "John Doe" },
    participants: [],
    startTime: new Date(Date.now() + 24 * 60 * 60000), // 1 day from now
    category: "Programming",
    bannerImage:
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    maxParticipants: 15,
    isCompleted: false,
  },
  {
    _id: "3",
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of UI/UX design.",
    host: { _id: "user2", name: "Jane Smith" },
    participants: [],
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60000), // 3 days from now
    category: "Design",
    bannerImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    maxParticipants: 25,
    isCompleted: false,
  },
  {
    _id: "4",
    title: "Node.js Fundamentals",
    description: "Introduction to server-side JavaScript with Node.js.",
    host: { _id: "user3", name: "Alex Johnson" },
    participants: [],
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 2 * 60 * 60000), // 2 hours duration
    category: "Programming",
    bannerImage:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    maxParticipants: 30,
    isCompleted: true,
  },
];

export default function WorkshopList() {
  const [currentUserWorkshops, setCurrentUserWorkshops] = useState<IWorkshop[]>(
    []
  );
  const [futureWorkshops, setFutureWorkshops] = useState<IWorkshop[]>([]);
  const [pastWorkshops, setPastWorkshops] = useState<IWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // Mock current user ID - replace with actual auth
  const currentUserId = "user1";

  useEffect(() => {
    const getWorkshops = async () => {
      const response = await apiClient.get(
        `${GET_WORKSHOP_FOR_COMMUNITY}/${id}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200 && response.data) {
        // console.log("WORKSHOPS DATA: ", response.data);
        setCurrentUserWorkshops(response.data.hostedUpcomingWorkshops);
        setFutureWorkshops(response.data.communityUpcomingWorkshops);
        setPastWorkshops(response.data.completedWorkshops);
        setLoading(false);
      } else {
        alert("Unable to get info");
      }
    };
    getWorkshops();
  }, []);

  // useEffect(() => {
  //   // Simulate API call
  //   const fetchWorkshops = () => {
  //     setLoading(true);

  //     // In a real app, you would fetch from your API
  //     setTimeout(() => {
  //       const now = new Date();

  //       // Filter workshops hosted by current user that are happening now or soon
  //       const userWorkshops = mockWorkshops.filter(
  //         (workshop) =>
  //           workshop.host._id === currentUserId &&
  //           workshop.startTime > now &&
  //           workshop.startTime <= new Date(now.getTime() + 24 * 60 * 60000) && // Next 24 hours
  //           !workshop.isCompleted
  //       );

  //       // Filter future workshops not hosted by current user
  //       const future = mockWorkshops.filter(
  //         (workshop) =>
  //           workshop.startTime > now &&
  //           !workshop.isCompleted &&
  //           !userWorkshops.includes(workshop)
  //       );

  //       // Filter past workshops
  //       const past = mockWorkshops.filter(
  //         (workshop) => workshop.isCompleted || workshop.startTime < now
  //       );

  //       setCurrentUserWorkshops(userWorkshops);
  //       setFutureWorkshops(future);
  //       setPastWorkshops(past);
  //       setLoading(false);
  //     }, 1000);
  //   };

  //   fetchWorkshops();
  // }, []);

  const startWorkshop = (workshopId: Types.ObjectId | string) => {
    // console.log(`Starting workshop: ${workshopId}`);
    // In a real app, you would navigate to the meeting or update the workshop status

    alert(`Workshop ${workshopId} started! `);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // For larger screens, we'll still use tabs
  const renderTabView = () => (
    <Tabs defaultValue="your-workshops" className="w-full hidden md:block">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-white text-black rounded-full border-theme border-2">
        <TabsTrigger value="your-workshops">Your Workshops</TabsTrigger>
        <TabsTrigger value="community">Community Workshops</TabsTrigger>
        <TabsTrigger value="past">Past Workshops</TabsTrigger>
      </TabsList>

      <TabsContent value="your-workshops">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">
            Your Upcoming Workshops
          </h2>
          {currentUserWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentUserWorkshops.map((workshop) => (
                <WorkshopCard
                  key={workshop?._id.toString()}
                  workshop={workshop}
                  isHost={true}
                  showStartButton={
                    new Date() >= new Date(workshop?.startTime) // Only after start time
                  }
                  onStartWorkshop={startWorkshop}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              You don't have any upcoming workshops.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="community">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">
            Community Workshops
          </h2>
          {futureWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {futureWorkshops.map((workshop) => (
                <WorkshopCard
                  key={workshop._id.toString()}
                  workshop={workshop}
                  isHost={workshop.host._id.toString() === currentUserId}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No upcoming community workshops.
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="past">
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-white">Past Workshops</h2>
          {pastWorkshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastWorkshops.map((workshop) => (
                <WorkshopCard
                  key={workshop._id.toString()}
                  workshop={workshop}
                  isPast={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No past workshops.</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );

  // For mobile, we'll stack sections vertically
  const renderMobileView = () => (
    <div className="space-y-12 md:hidden">
      {/* Your Workshops Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">
          Your Upcoming Workshops
        </h2>
        {currentUserWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {currentUserWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop._id.toString()}
                workshop={workshop}
                isHost={true}
                showStartButton={
                  new Date() >= new Date(workshop.startTime) // Only after start time
                }
                onStartWorkshop={startWorkshop}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            You don't have any upcoming workshops.
          </p>
        )}
      </div>

      {/* Community Workshops Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">
          Community Workshops
        </h2>
        {futureWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {futureWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop._id.toString()}
                workshop={workshop}
                isHost={workshop.host._id.toString() === currentUserId}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No upcoming community workshops.
          </p>
        )}
      </div>

      {/* Past Workshops Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold border-b pb-2">Past Workshops</h2>
        {pastWorkshops.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {pastWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop._id.toString()}
                workshop={workshop}
                isPast={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No past workshops.</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {renderTabView()}
      {renderMobileView()}
    </>
  );
}
