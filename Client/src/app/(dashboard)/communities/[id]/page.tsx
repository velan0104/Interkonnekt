"use client";
import { RootState } from "@/app/Store/store";
import { CreatePostModal } from "@/components/Communities/CreatePostModal";
import { PostCard } from "@/components/Communities/Post/PostCard";
import { Button } from "@/components/ui/button";
import CreateWorkshopForm from "@/components/Workshop/CreateWorkshop";
import CreateWorkshopModal from "@/components/Workshop/CreateWorkshopModal";
import WorkshopPost from "@/components/Workshop/WorkshopPost";
import apiClient from "@/lib/api-client";
import { GET_COMMUNITY_INFO, GET_COMMUNITY_POSTS } from "@/lib/constant";
import { ICommunityPost } from "@/models/CommunityPost.model";
import { CommunityPost } from "@/seeders/seeders";
import { setSelectedCommunity } from "@/Slice/communitySlice";
import { CommunityPostProps, ExtendedSession, IMembers } from "@/types";
import { EllipsisVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { boolean } from "zod";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

const page = () => {
  const { id } = useParams<{ id: string }>();
  let count = 0;
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedCommunity = useSelector(
    (state: RootState) => state.community.selectedCommunity
  );
  const [communityPosts, setCommunityPosts] = useState<CommunityPostProps[]>(
    []
  );
  const [isMember, setIsMember] = useState<boolean>(false);

  const { data: session } = useSession() as { data: ExtendedSession | null };

  const getCommunityInfo = async () => {
    try {
      const response = await apiClient.get(`${GET_COMMUNITY_INFO}/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data) {
        dispatch(setSelectedCommunity(response.data.community));
        // console.log("COMMUNITY INFO: ", response.data.community);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCommunityPosts = async () => {
    try {
      const response = await apiClient.get(`${GET_COMMUNITY_POSTS}?id=${id}`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data) {
        setCommunityPosts(response.data.posts);
        // console.log(response.data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommunityInfo();
    getCommunityPosts();
  }, []);

  useEffect(() => {
    const userIdToCheck = session?.user?._id;

    if (!userIdToCheck || !selectedCommunity) return;

    const isAdmin = selectedCommunity.admin?._id.toString() === userIdToCheck; // Fixed .id to ._id

    const isUserMember =
      isAdmin ||
      selectedCommunity.members.some(
        (member) => member._id.toString() === userIdToCheck
      );

    setIsMember(isUserMember);
  }, [selectedCommunity]);

  const Options = () => (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger
          className="bg-gray-800 text-white border-none"
          style={{ borderRadius: "5px" }}
        >
          <EllipsisVertical size={24} className="text-white" />
        </MenubarTrigger>
        <MenubarContent
          className="text-white bg-gray-800"
          style={{ borderRadius: "5px" }}
        >
          <MenubarItem onSelect={() => router.push(`${id}/community-info`)}>
            Profile
          </MenubarItem>
          <MenubarItem onSelect={() => router.push(`${id}/workshops`)}>
            {" "}
            Workshops{" "}
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );

  if (!selectedCommunity) return <h1> Loading... </h1>;
  return (
    <div className=" h-[89vh] overflow-y-scroll">
      <header
        className="h-auto bg-gray-800 relative cursor-pointer"
        // onClick={() => router.push(`${id}/community-info`)}
      >
        <CldImage
          src={selectedCommunity.banner}
          alt={selectedCommunity?.name}
          width={400}
          height={200}
          className="h-[180px] w-full rounded-t-2xl"
        />
        <div className="absolute top-20 right-5">
          <CldImage
            src={selectedCommunity?.profilePic}
            alt={selectedCommunity?.name}
            width={400}
            height={200}
            className="size-32 rounded-full bg-white"
          />
        </div>
        <div className=" bg-slate-700 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div>
                <h1 className="text-xl font-bold">
                  {" "}
                  {selectedCommunity.name}{" "}
                </h1>
                <h3 className="text-lg font-light"> {selectedCommunity.bio}</h3>
              </div>
              <Button
                variant={"ghost"}
                className={`bg-theme rounded-xl text-white ${
                  isMember ? "hidden" : "block"
                }`}
              >
                {" "}
                Join{" "}
              </Button>
            </div>
            <div>
              <Options />
            </div>
          </div>
          <div className="flex relative items-center bg-black">
            {selectedCommunity.members.map((member, idx) => {
              if (member?.image && count > 5) {
                count++;
                return (
                  <Image
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
      <button className=" fixed bottom-10 bg-green-500 text-white rounded-xl">
        <CreatePostModal id={id} />
      </button>
      <button className=" fixed bottom-10 right-10 bg-green-500 text-white rounded-xl">
        <CreateWorkshopModal id={id} />
      </button>
      <section className=" my-3">
        {communityPosts?.map((post, index) => (
          <PostCard post={post} key={index} />
        ))}
      </section>
    </div>
  );
};

export default page;
