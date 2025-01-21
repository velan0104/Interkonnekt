"use client";
import LeftSide from "@/components/LeftSide/LeftSide";
import Navbar from "@/components/Navbar/Navbar";
import ProtectedRoute from "@/components/PrivateRoute/PrivateRoute";
import RightSide from "@/components/RightSide/RightSide";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute>
      <SessionProvider>
        <div className="bg-gray-900">
          <Navbar />
          <div className="grid grid-cols-4 top-20 absolute">
            <LeftSide />
            <div className="col-span-2 ">{children}</div>
            <RightSide />
          </div>
        </div>
      </SessionProvider>
    </ProtectedRoute>
  );
};

export default layout;
