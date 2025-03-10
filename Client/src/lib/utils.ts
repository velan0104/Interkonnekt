import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCallID(workshopId: string, hostId: string) {
  const id = `workshop-${workshopId}-${hostId}`;

  return id;
}
