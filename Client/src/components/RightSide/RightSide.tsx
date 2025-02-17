"use client";
import { UserPlus2, Bell, Heart, MessageSquare, User2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Store/store";
import { fetchActivities } from "@/Slice/activitiesSlice";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import NewDM from "../ChatComponent/NewDM";
import ContactList from "../ChatComponent/ContactList";
import { contact } from "@/seeders/seeders";
import { CldImage } from "next-cloudinary";
import FollowButton from "../FollowButton/FollowButton";
import apiClient from "@/lib/api-client";
import { GET_CONTACT } from "@/lib/constant";
import ExploreCommunity from "../Communities/ExploreCommunity";

const RightSide: FC = () => {
  interface user {
    name: string;
    avatar: string;
  }

  interface Details {
    id: string;
    image: string;
    name: string;
    username: string;
    interest: string;
  }

  interface Activity {
    id: number;
    type: "like" | "comment" | "follow" | "unfollow";
    user: user;
    text?: string;
    timestamp: string;
  }
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { activities, loading, error } = useSelector(
    (state: RootState) => state.activities
  );
  const params = usePathname();
  const [contacts, setContacts] = useState<any[]>([]);
  const router = useRouter();
  const [userData, setUserData] = useState<Details[]>([
    {
      id: "",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU",
      name: "Default User",
      username: "defaultuser",
      interest: "default interest",
    },
  ]);
  // console.log("Params: " + params);

  // console.log("activity at rightSide: ", activities);

  useEffect(() => {
    if (params === "/messages") {
      console.log(session?.user);
      return;
    }

    const userId = session?.user?.id;
    // console.log("userid at rightside: ", userId);

    const intervalId = setInterval(() => {
      if (userId) {
        dispatch(fetchActivities({ userId }));
        // console.log("Fetched activities for user:", userId);
      }
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup the interval on unmount
  }, [dispatch, session]);

  useEffect(() => {
    if (params === "/messages") {
      const getContact = async () => {
        try {
          const response = await apiClient.get(GET_CONTACT, {
            withCredentials: true,
          });
          if (response.status === 200 && response.data) {
            setContacts(response.data.contacts);
          }
        } catch (error) {
          console.log(error);
        }
      };

      getContact();

      return;
    }
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await fetch("/api/allUserData", {
        method: "POST",

        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      // console.log("data.users at rightside: ", data.users);
      setUserData(data.users);
      // console.log("user details at rightside: ", userData);
    };

    fetchAllUsers();
  }, [params, session]);

  if (params === "/messages") {
    return (
      <div className="w-full md:w-96 h-[89vh] gap-6 p-4 border-l overflow-hidden border-gray-800 bg-gray-900">
        <ContactList contacts={contacts} isChannel={false} />;
      </div>
    );
  }

  if (params === "/communities" || params.startsWith("/communities")) {
    return (
      <div className="w-full md:w-96 h-[89vh] gap-6 p-4 border-l overflow-hidden border-gray-800 bg-gray-900">
        <ExploreCommunity />
      </div>
    );
  }

  return (
    <aside className="w-full md:w-96 h-[89vh] grid grid-rows-2 gap-6 p-4 border-l overflow-hidden border-gray-800 bg-gray-900">
      {/* Activities Section */}
      <section className="space-y-4 overflow-x-hidden">
        <h2 className="text-lg font-semibold text-[#3b82f6]">
          Recent Activities
        </h2>
        <div className="bg-gray-800 rounded-lg p-4 space-y-4 max-h-[400px] overflow-y-auto shadow-lg">
          {activities.length > 0 ? (
            activities
              .filter((activity) => activity.id === session?.user?.id) // Filter activities by user ID
              .map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-2 rounded-md hover:bg-[#3b82f6]/10 transition"
                >
                  {activity.user.avatar.includes(
                    "https://lh3.googleusercontent.com"
                  ) ? (
                    <img
                      src={activity.user.avatar}
                      alt={activity.user.name}
                      className="w-10 h-10 rounded-full border border-gray-700"
                    />
                  ) : (
                    <CldImage
                      src={activity.user.avatar}
                      width={50}
                      height={80}
                      alt={activity.user.name}
                      className="rounded-full w-14 h-14"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white mt-2">
                      <span className="font-medium">{activity.user.name}</span>{" "}
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                  {activity.type === "like" && (
                    <Heart className="w-4 h-4 text-red-500 mt-3" />
                  )}
                  {activity.type === "follow" && (
                    <UserPlus2 className="w-4 h-4 text-green-500 mt-3" />
                  )}
                  {activity.type === "comment" && (
                    <MessageSquare className="w-4 h-4 text-purple-500 mt-3" />
                  )}
                </div>
              ))
          ) : (
            <p className="text-gray-400 text-sm">No recent activities</p>
          )}
        </div>
      </section>

      {/* Suggested Users Section */}
      <section className="space-y-4 overflow-x-hidden">
        <h2 className="text-lg font-semibold text-[#3b82f6]">
          Suggested Users
        </h2>
        <div className="bg-gray-900 rounded-lg p-4 space-y-4 max-h-[400px] overflow-y-auto shadow-lg">
          {userData
            .filter((data) => data.id !== session?.user?.id)
            .map((user) => (
              <div
                onClick={() => {
                  router.push(`/profile/?userId=${user.id}`);
                }}
                key={user.id}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#3b82f6]/10 transition"
              >
                {/* <img
                src={user.image}
                alt={user.username}
                className="w-10 h-10 rounded-full border border-gray-700"
              /> */}
                {!user.image ? (
                  <img
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-gray-700"
                  />
                ) : user.image &&
                  user.image.includes("https://lh3.googleusercontent.com") ? (
                  <img
                    src={
                      user.image ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full border border-gray-700"
                  />
                ) : (
                  <CldImage
                    src={
                      user.image ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                    }
                    alt={user.name}
                    width={50}
                    height={50}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-400">@{user?.username}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.interest}
                  </p>
                </div>
                <div className="px-3 py-1 text-sm font-semibold text-[#3b82f6] border border-[#3b82f6] rounded-full hover:bg-[#3b82f6]/10 transition">
                  <FollowButton
                    currentUserId={session?.user?.id}
                    targetUserId={user.id}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>
    </aside>
  );
};

export default RightSide;
