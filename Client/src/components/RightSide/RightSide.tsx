"use client"
import { UserPlus2, Bell, Heart, MessageSquare, User2 } from "lucide-react";
import { render } from "react-dom";
import React, { useState } from "react";
export default function RightSide() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (loading) {
    return (
      <aside className="w-full md:w-80 h-screen p-4 border-l border-gray-200 bg-gray-900">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
          <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
          <div className="h-20 bg-gray-800 rounded"></div>
        </div>
      </aside>
    );
  }
  if (error) {
    return (
      <aside className="w-full md:w-80 h-screen p-4 border-l  bg-gray-900">
        <div className="text-red-500">Error loading sidebar content</div>
      </aside>
    );
  }
  return (
    <aside className="w-full md:w-96 h-[89vh] grid grid-rows-2 gap-6 p-4 border-l overflow-hidden border-gray-800 bg-gray-900">
      {/* Activities Section */}
      <section className="space-y-4 overflow-x-hidden">
        <h2 className="text-lg font-semibold text-[#3b82f6]">Recent Activities</h2>
        <div className="bg-gray-800 rounded-lg p-4 space-y-4 max-h-[400px] overflow-y-auto shadow-lg">
          {[
            {
              id: 1,
              type: "mention",
              user: {
                name: "Sarah Wilson",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg",
              },
              text: "mentioned you in a comment",
              timestamp: "2m ago",
            },
            {
              id: 2,
              type: "like",
              user: {
                name: "John Cooper",
                avatar: "https://randomuser.me/api/portraits/men/2.jpg",
              },
              text: "liked your post",
              timestamp: "5m ago",
            },
            {
              id: 3,
              type: "follow",
              user: {
                name: "Emma Thompson",
                avatar: "https://randomuser.me/api/portraits/women/3.jpg",
              },
              text: "started following you",
              timestamp: "10m ago",
            },
            {
              id: 4,
              type: "comment",
              user: {
                name: "Michael Scott",
                avatar: "https://randomuser.me/api/portraits/men/4.jpg",
              },
              text: "commented on your post",
              timestamp: "15m ago",
            },
          ].map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-2 rounded-md hover:bg-[#3b82f6]/10 transition"
            >
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-10 h-10 rounded-full border border-gray-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">
                  <span className="font-medium ">{activity.user.name}</span>{" "}
                  {activity.text}
                </p>
                <p className="text-xs text-gray-400">{activity.timestamp}</p>
              </div>
              {activity.type === "mention" && (
                <Bell className="w-4 h-4 text-[#3b82f6]" />
              )}
              {activity.type === "like" && (
                <Heart className="w-4 h-4 text-red-500" />
              )}
              {activity.type === "follow" && (
                <UserPlus2 className="w-4 h-4 text-green-500" />
              )}
              {activity.type === "comment" && (
                <MessageSquare className="w-4 h-4 text-purple-500" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Users Section */}
      <section className="space-y-4 overflow-x-hidden">
        <h2 className="text-lg font-semibold text-[#3b82f6]">Suggested Users</h2>
        <div className="bg-gray-900 rounded-lg p-4 space-y-4 max-h-[400px] overflow-y-auto shadow-lg">
          {[
            {
              id: 1,
              name: "David Chen",
              username: "@davidchen",
              avatar: "https://randomuser.me/api/portraits/men/5.jpg",
              bio: "Software Engineer | Coffee Lover",
            },
            {
              id: 2,
              name: "Lisa Anderson",
              username: "@lisaanderson",
              avatar: "https://randomuser.me/api/portraits/women/6.jpg",
              bio: "Digital Artist | Travel Enthusiast",
            },
            {
              id: 3,
              name: "James Wilson",
              username: "@jameswilson",
              avatar: "https://randomuser.me/api/portraits/men/7.jpg",
              bio: "Product Designer | Tech Blogger",
            },
            {
              id: 4,
              name: "Maria Garcia",
              username: "@mariagarcia",
              avatar: "https://randomuser.me/api/portraits/women/8.jpg",
              bio: "Marketing Specialist | Foodie",
            },
          ].map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#3b82f6]/10 transition"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-gray-700"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{user.name}</p>
                <p className="text-xs text-gray-400">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.bio}</p>
              </div>
              <button className="px-3 py-1 text-sm font-semibold text-[#3b82f6] border border-[#3b82f6] rounded-full hover:bg-[#3b82f6]/10 transition">
                Follow
              </button>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

