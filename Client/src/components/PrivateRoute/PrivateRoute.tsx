"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession(); // useSession provides both session and status
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signup"); // Redirect to login if the user is not authenticated
    }
  }, [status, router]);

  // if (status === "loading") {
  //   return <p>Loading...</p>; // Show a loading indicator while checking the session
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
