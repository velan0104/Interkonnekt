"use client";
import { CommunityPost } from "@/seeders/seeders";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import apiClient from "@/lib/api-client";
import { GET_ALL_COMMUNITY_POSTS, GET_USER_COMMUNITY } from "@/lib/constant";
import { setCommunities } from "@/Slice/communitySlice";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";
import CreateForm from "./CreateForm";
import { Types } from "mongoose";
import { CommunityPostProps } from "@/types";
import { PostCard } from "./Post/PostCard";

interface CardProps {
  _id: Types.ObjectId;
  title: string;
  image: string;
  bio: string;
}

const Card = ({ title, image, bio, _id }: CardProps) => {
  const router = useRouter();
  return (
    <div
      className="flex justify-start items-center gap-3 bg-gray-900 p-5 w-64 h-24 cursor-pointer rounded-xl text-white border-2 border-theme"
      onClick={() => router.push(`communities/${_id}`)}
    >
      <CldImage
        src={image}
        alt={"hello"}
        width={200}
        height={200}
        className="size-16 bg-white rounded-full"
      />
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-nowrap">
          {" "}
          {title}{" "}
        </h1>
        <h3 className="text-base line-clamp-1"> {bio} </h3>
      </div>
    </div>
  );
};

const MiddleSection = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [communityPosts, setCommunityPosts] = useState<CommunityPostProps[]>(
    []
  );
  const communities = useSelector(
    (state: RootState) => state.community.communities
  );
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const getCommunity = async () => {
    try {
      const response = await apiClient.get(GET_USER_COMMUNITY, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data) {
        dispatch(setCommunities(response.data.communities));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllPosts = async () => {
    try {
      const response = await apiClient.get(GET_ALL_COMMUNITY_POSTS, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data) {
        setCommunityPosts(response.data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!communities) {
      getCommunity();
      getAllPosts();
      setIsLoading(false);
    }
  }, []);

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

  // if (isLoading) {
  //   return <SkeletonLoader />;
  // }

  return (
    <div className=" relative h-[89vh] overflow-y-auto">
      <h1 className="text-theme text-center text-2xl bg-gray-900 py-5 font-semibold border-b-2 border-b-white/20">
        {" "}
        Communities
      </h1>
      <div className="overflow-y-auto">
        <div className="flex overflow-x-scroll gap-3 mt-4 border-b-2 border-b-white/20 pb-5">
          {communities?.map((community, index) => (
            <Card
              _id={community._id}
              title={community.name}
              image={community.profilePic}
              bio={community.bio}
              key={community.name}
            />
          ))}
        </div>
        <div className=" my-3">
          {communityPosts.length > 0 ? (
            communityPosts.map((post, index) => (
              <PostCard post={post} key={post.createdAt.toLocaleString()} />
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              Joined Community
            </div>
          )}
          <button
            className=" fixed bottom-10 bg-theme text-white rounded-3xl px-5 py-3 flex items-center gap-2"
            onClick={() => setOpenModal(true)}
          >
            <span className="font-bold text-2xl"> + </span> Create
          </button>
        </div>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="bg-gray-900 border-none w-fit text-white h-fit">
            <DialogHeader>
              <DialogTitle className="text-center font-semibold"></DialogTitle>
              <DialogDescription className="">
                <CreateForm />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MiddleSection;
