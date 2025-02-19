"use client";
import LeftSide from "@/components/LeftSide/LeftSide";
import Navbar from "@/components/Navbar/Navbar";
import ProtectedRoute from "@/components/PrivateRoute/PrivateRoute";
import RightSide from "@/components/RightSide/RightSide";
import { SessionProvider, useSession } from "next-auth/react";
import React, { ReactNode } from "react";

const NavbarSkeleton = () => {
  return (
    <nav className="animate-pulse fixed top-0 left-0 right-0 h-20 bg-gray-800 border-b border-gray-800 z-50">
      <div className="max-w-screen-xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo Section */}
        <div className="h-8 w-28 rounded-full bg-gray-700"></div>

        {/* Search Bar */}
        <div className="hidden md:block h-10 w-80 rounded-full bg-gray-700"></div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Add Post Button */}
          <div className="h-10 w-36 rounded-full bg-gray-700"></div>

          {/* Notification Icon */}
          <div className="h-10 w-10 rounded-full bg-gray-700"></div>

          {/* Messages Icon */}
          <div className="h-10 w-10 rounded-full bg-gray-700"></div>

          {/* Profile Picture */}
          <div className="h-10 w-10 rounded-full bg-gray-700"></div>
        </div>
      </div>
    </nav>
  );
};

const SidebarSkeleton = () => {
  return (
    <aside className="animate-pulse  relative flex flex-col h-[86vh] w-96 bg-gray-800 text-white p-4 top-[6rem] rounded-xl">
      {/* Profile Section */}
      <div className="flex items-center gap-3 w-full mb-8">
        <div className="h-16 w-16 rounded-full bg-gray-700"></div>
        <div className="flex-1 h-6 rounded-full bg-gray-700"></div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-4">
        <div className="h-10 w-[70%] rounded-full bg-gray-700"></div>
        <div className="h-10 w-[70%] rounded-full bg-gray-700"></div>
        <div className="h-10 w-[70%] rounded-full bg-gray-700"></div>
        <div className="h-10 w-[70%] rounded-full bg-gray-700"></div>
        <div className="h-10 w-[70%] rounded-full bg-gray-700"></div>
      </div>

      {/* Video Call Button */}
      <div className="h-12 w-full rounded-full mb-10 bg-gray-700"></div>

      {/* Logout Button */}
      <div className="h-12 w-full rounded-full bg-gray-700"></div>
    </aside>
  );
};

const SkeletonLoader = () => {
  return (
    <div className="space-y-4 absolute top-20 left-96 right-0 p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-800 animate-pulse p-4 rounded-xl shadow-lg"
        >
          {/* Header Skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-32"></div>
              <div className="h-3 bg-gray-600 rounded w-24 mt-2"></div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="mt-4">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mt-2"></div>
          </div>

          {/* Media Skeleton */}
          <div className="mt-4 h-40 bg-gray-700 rounded-xl"></div>

          {/* Poll Skeleton */}
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>

          {/* Interaction Buttons Skeleton */}
          <div className="flex gap-6 mt-4">
            <div className="h-5 w-16 bg-gray-700 rounded"></div>
            <div className="h-5 w-16 bg-gray-700 rounded"></div>
            <div className="h-5 w-16 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const layout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  if (!session && status === "unauthenticated") {
    return (
      <div className="bg-gray-900 h-screen w-screen">
        <NavbarSkeleton />
        <SidebarSkeleton />
        <SkeletonLoader />
      </div>
    );
  }
  return (
    <ProtectedRoute>
      <SessionProvider>
        <div className="bg-gray-900 w-full  h-[100vh] overflow-hidden">
          <Navbar />
          <div className="grid grid-cols-4 top-20 absolute ">
            <LeftSide />
            <div className="col-span-2 min-w-[23.5rem] min-h-[37rem]">
              {children}
            </div>
            <RightSide />
          </div>
        </div>
      </SessionProvider>
    </ProtectedRoute>
  );
};

export default layout;
