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
import Lottie from "react-lottie-player";
import communityJson from "../animation/lottie-community.json";

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

const CommunityAnimation = () => (
  <Lottie
    loop
    animationData={communityJson}
    play
    style={{ width: 250, height: 250, borderRadius: "100%" }}
  />
);

const MiddleSection = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [communityPosts, setCommunityPosts] = useState<CommunityPostProps[]>(
    []
  );
  const communities = useSelector(
    (state: RootState) => state.community.communities
  );
  const dispatch = useDispatch();

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
        console.log("COMMUNITIES POST: ", response.data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!communities) {
      getCommunity();
      getAllPosts();
    }
  }, []);

  return (
    <div className=" relative h-[89vh] overflow-y-auto">
      <h1 className="text-theme text-center text-2xl py-5 font-semibold border-b-2 border-b-white/20">
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
              <CommunityAnimation />
            </div>
          )}
          <button
            className=" fixed bottom-10 bg-purple-700 text-white rounded-3xl px-5 py-3 flex items-center gap-2"
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
