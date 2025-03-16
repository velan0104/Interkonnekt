"use server";

import { authOptions } from "@/lib/authOptions";
import { StreamClient } from "@stream-io/node-sdk";
import { getServerSession } from "next-auth";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) throw new Error("User is not logged in");
  if (!apiKey) throw new Error("No API key");
  if (!apiSecret) throw new Error("No API secret");

  const client = new StreamClient(apiKey, apiSecret);

  const validity = 60 * 60;
  const token = client.generateUserToken({
    user_id: session.user.id,
    validity_in_seconds: validity,
  });
  return token;
};
