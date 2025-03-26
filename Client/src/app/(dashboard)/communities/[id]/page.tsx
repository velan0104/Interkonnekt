"use client";
import { RootState } from "@/app/Store/store";
import { CreatePostModal } from "@/components/Communities/CreatePostModal";
import { PostCard } from "@/components/Communities/Post/PostCard";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import {
  ADD_COMMUNITY_MEMBER,
  GET_COMMUNITY_INFO,
  GET_COMMUNITY_POSTS,
} from "@/lib/constant";
import { setSelectedCommunity } from "@/Slice/communitySlice";
import { CommunityPostProps, ExtendedSession, IMembers } from "@/types";
import { EllipsisVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const { id } = useParams<{ id: string }>();
  let count = 0;
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const selectedCommunity = useSelector(
    (state: RootState) => state.community.selectedCommunity
  );
  const [communityPosts, setCommunityPosts] = useState<CommunityPostProps[]>(
    []
  );
  const [isMember, setIsMember] = useState<boolean>(false);
  const [open, setIsOpen] = useState<boolean>(false);

  const { data: session } = useSession() as { data: ExtendedSession | null };

  const getCommunityInfo = async () => {
    try {
      const response = await apiClient.get(`${GET_COMMUNITY_INFO}/${id}`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data) {
        dispatch(setSelectedCommunity(response.data.community));
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
    const userIdToCheck = session?.user?.id;

    if (!userIdToCheck || !selectedCommunity) return;

    const isAdmin = selectedCommunity.admin.toString() === userIdToCheck;

    const isUserMember =
      isAdmin ||
      selectedCommunity.members.some(
        (member) => member._id.toString() === userIdToCheck
      );

    setIsMember(isUserMember);
  }, [session?.user, selectedCommunity]);

  const addMember = async () => {
    try {
      console.log("Function called;.");
      const res = await apiClient.post(
        ADD_COMMUNITY_MEMBER,
        { communityId: id },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data) {
        console.log("Member added successfully!!");
        toast({
          title: "Joined Successfully!!",
          description: `Welcome to ${selectedCommunity?.name}`,
        });
        setIsMember(true);
        setIsOpen(false);
      } else {
        console.log("Unable to add member in the community.");
        toast({ title: "Try again", description: "Action Failed" });
      }
    } catch (error) {
      console.log("Unable to add member in the community. ", error);
    }
  };

  const Options = () => (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger
          className="bg-transparent text-white border-none"
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

  if (!selectedCommunity)
    return <h1 className="bg-gray-900 text-white h-[89vh]"> Loading... </h1>;
  return (
    <div className=" h-[89vh] overflow-y-scroll bg-gray-800">
      <header
        className="h-auto bg-gray-800 relative cursor-pointer border-b-2 border-gray-500"
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
        <div className=" bg-slate-800 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
              <div>
                <h1 className="text-xl font-bold text-white">
                  {" "}
                  {selectedCommunity.name}{" "}
                </h1>
                <h3 className="text-lg font-light text-gray-100 ">
                  {" "}
                  {selectedCommunity.bio}
                </h3>
              </div>

              {!isMember && (
                <Dialog open={open} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => setIsOpen(true)}
                      className="bg-theme rounded-full px-5 py-2 hover:bg-theme/80 text-white"
                    >
                      Join
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    style={{ borderRadius: "10px" }}
                    className="bg-gray-900 text-white border-2 border-theme "
                  >
                    <DialogHeader>
                      <DialogTitle>
                        Would you want to join Community?
                      </DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-start gap-4 ">
                      <button
                        onClick={addMember}
                        className="bg-theme text-white rounded-xl px-4 py-1"
                      >
                        {" "}
                        Yes{" "}
                      </button>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="bg-white text-black rounded-xl px-4 py-1"
                      >
                        {" "}
                        No{" "}
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
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
      <section className=" my-3 bg-gray-800">
        {communityPosts?.map((post, index) => (
          <PostCard post={post} key={index} />
        ))}
      </section>
    </div>
  );
};

export default page;
