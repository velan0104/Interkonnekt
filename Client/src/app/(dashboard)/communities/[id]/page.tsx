"use client";
import PostCard from "@/components/Communities/PostCard";
import apiClient from "@/lib/api-client";
import { GET_COMMUNITY_INFO } from "@/lib/constant";
import { CommunityPost } from "@/seeders/seeders";
import { ICommunity } from "@/types";
import { CldImage } from "next-cloudinary";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Members {
  image: string;
  username: string;
  _id: string;
}

interface Community {
  name: string;
  bio: string;
  admin: string;
  members: Members[];
  banner: string;
  category: string;
  profilePic: string;
}

const page = () => {
  const { id } = useParams();
  let count = 0;
  const [communityInfo, setCommunityInfo] = useState<Community>();
  const getCommunityInfo = async () => {
    try {
      const response = await apiClient.get(`${GET_COMMUNITY_INFO}/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data) {
        setCommunityInfo(response.data.community);
        console.log("COMMUNITY INFO: ", response.data.community);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCommunityInfo();
  }, []);

  if (!communityInfo) return <h1> Loading... </h1>;
  return (
    <div className=" h-[89vh] overflow-y-scroll">
      <header className="h-auto bg-gray-800 relative">
        <CldImage
          src={communityInfo?.banner}
          alt={communityInfo?.name}
          width={400}
          height={200}
          className="h-[180px] w-full rounded-t-2xl"
        />
        <div className="absolute top-20 right-5">
          <CldImage
            src={communityInfo?.profilePic}
            alt={communityInfo?.name}
            width={400}
            height={200}
            className="size-32 rounded-full bg-white"
          />
        </div>
        <div className=" bg-slate-700 px-5 py-3">
          <h1 className="text-xl font-bold"> {communityInfo.name} </h1>
          <h3 className="text-lg font-light"> {communityInfo.bio}</h3>
          <div className="flex relative items-center bg-black">
            {communityInfo.members.map((member, idx) => {
              if (member?.image && count > 5) {
                count++;
                return (
                  <CldImage
                    src={member.image}
                    alt={idx.toString()}
                    width={50}
                    height={50}
                    className="size-8 bg-white"
                  />
                );
              }
            })}
          </div>
        </div>
      </header>
      <button className=" fixed bottom-10 bg-purple-700 text-white rounded-3xl px-5 py-3 flex items-center gap-2">
        <span className="font-bold text-2xl"> + </span> Post
      </button>
      <section className=" my-3">
        {CommunityPost.map((post, index) => (
          <PostCard post={post} key={index} />
        ))}
      </section>
    </div>
  );
};

export default page;
