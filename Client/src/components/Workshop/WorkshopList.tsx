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

  const startWorkshop = (workshopId: Types.ObjectId | string) => {
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
