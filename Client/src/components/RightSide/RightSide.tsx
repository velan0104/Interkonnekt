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
import { motion } from "framer-motion";
import apiClient from "@/lib/api-client";
import { GET_CONTACT } from "@/lib/constant";
import ExploreCommunity from "../Communities/ExploreCommunity";
import Image from "next/image";

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

  useEffect(() => {
    if (params === "/messages") {
      return;
    }

    const userId = session?.user?.id;

    const intervalId = setInterval(() => {
      if (userId) {
        dispatch(fetchActivities({ userId }));
      }
    }, 5000);

    return () => clearInterval(intervalId);
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
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/allUserData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!data.users) return;

        const sessionUserId = session.user.id;

        // Fetch session user details with interests
        const sessionUser = data.users.find((u) => u.id === sessionUserId);
        const sessionUserInterests = sessionUser?.interest || [];

        // Separate users with similar interests first
        const usersWithSameInterests = data.users.filter(
          (user) =>
            user.id !== sessionUserId &&
            user.interest &&
            sessionUserInterests.some((interest) =>
              user.interest.includes(interest)
            )
        );

        // Get remaining users without shared interests
        const otherUsers = data.users.filter(
          (user) =>
            user.id !== sessionUserId &&
            !usersWithSameInterests.some((u) => u.id === user.id)
        );

        // Merge lists: prioritized interest-based users first
        setUserData([...usersWithSameInterests, ...otherUsers]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
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
    <aside
      className="hidden fixed top-22 right-0 w-full h-[89%] md:w-[24rem] lg:h-[42rem] custom:h-[37rem] 2xl:h-[41rem] 
  md:grid grid-rows-2 gap-6 p-4 border-l border-gray-800 bg-gray-900 shadow-xl overflow-y-hidden 
  sm:flex flex-col md:flex-row lg:flex-col"
    >
      {/* Recent Activities */}
      <section className="space-y-4 overflow-hidden flex flex-col flex-grow">
        <h2 className="bg-gray-900 w-full h-[2rem] text-lg font-semibold text-[#53c97d] sticky top-0 z-10">
          Recent Activities
        </h2>
        <div className="bg-gray-800 rounded-xl p-3 max-h-[400px] flex-grow overflow-y-auto shadow-lg">
          {activities.length > 0 ? (
            activities
              .filter((activity) => activity.id === session?.user?.id)
              .map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-2 mt-5 rounded-md hover:bg-[#3b82f6]/10 transition duration-300"
                >
                  {/* {!activity.user.avatar ? (
                                        <img
                                          src={
                                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                                          }
                                          alt={activity.user.name}
                                          className="w-10 h-10 rounded-full border border-gray-700 "
                                        />
                                      ) : activity.user.avatar.includes("https://lh3.googleusercontent.com") ? (
                                        <img
                                          src={activity.user.avatar}
                                          alt={activity.user.name}
                                          className="w-10 h-10 rounded-full border border-gray-700"
                                        />
                                      ) : (
                                        <CldImage
                                          src={
                                            activity.user.avatar ||
                                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                                          }
                                          alt={activity.user.name}
                                          width={40}
                                          height={40}
                                          className="rounded-full w-12 h-12"
                                        />
                                      )} */}
                  <Image
                    src={
                      activity.user.avatar ||
                      session?.user?.image ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                    }
                    alt="Profile Image"
                    width={80}
                    height={60}
                    className="w-14 h-14 object-cover rounded-full border-2 border-blue-500 shadow-lg shadow-blue-600/50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.user.name}</span>{" "}
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                  {activity.type === "like" && (
                    <Heart className="w-5 h-5 text-red-500" />
                  )}
                  {activity.type === "follow" && (
                    <UserPlus2 className="w-5 h-5 text-green-500" />
                  )}
                  {activity.type === "comment" && (
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                  )}
                </motion.div>
              ))
          ) : (
            <p className="text-gray-400 mt-8 text-sm text-center">
              No recent activities
            </p>
          )}
        </div>
      </section>

      {/* Suggested Users */}
      <section className="space-y-6 overflow-hidden flex flex-col flex-grow">
        <h2 className="bg-gray-900 w-full h-[3rem] text-2xl font-semibold text-[#53c97d] shadow-lg sticky top-0 z-10">
          Suggested Users
        </h2>
        <div className="bg-gray-800 rounded-xl p-5 max-h-[400px] flex-grow overflow-y-auto shadow-2xl">
          {userData &&
            userData
              .filter((user) => user.id !== session?.user?.id)
              .map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between space-x-4 p-4 rounded-xl cursor-pointer hover:bg-[#3b82f6]/10 transition duration-300"
                >
                  {/* User Info */}
                  <div
                    className="flex items-center space-x-4 flex-1"
                    onClick={() => router.push(`/profile/?userId=${user.id}`)}
                  >
                    <Image
                      src={
                        user.image ||
                        session?.user?.image ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                      }
                      alt="Profile Image"
                      width={80}
                      height={60}
                      className="w-14 h-14 object-cover rounded-full border-2 border-blue-500 shadow-lg shadow-blue-600/50"
                    />

                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-lg">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400">@{user?.username}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.interest}
                      </p>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className=" text-sm font-semibold text-white bg-[#3b82f6] rounded-xl hover:bg-[#2563eb] transition-all duration-300"
                  >
                    <FollowButton
                      currentUserId={session?.user?.id}
                      targetUserId={user.id}
                    />
                  </motion.button>
                </motion.div>
              ))}
        </div>
      </section>
    </aside>
  );
};

export default RightSide;
