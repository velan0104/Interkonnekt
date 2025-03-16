"use client";
import { RootState } from "@/app/Store/store";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

const page = () => {
  const { id } = useParams();
  const [hovered, setHovered] = useState<boolean>(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [saveChanges, setSaveChanges] = useState<boolean>(false);
  const { data: session } = useSession();
  // const selectedCommunity = useSelector(
  //   (state: RootState) => state.community.selectedCommunity
  // );

  const handleProfilePicChange = () => {};

  const handleProfilePic = () => {
    console.log("Hello");
    if (profilePicRef.current) {
      profilePicRef.current.click();
    }
  };

  const selectedCommunity = {
    _id: "67bb39a4395a5032a5815997",
    name: "Codecthon",
    bio: "hello world",
    admin: "679e37fa004065a0a602f560",
    members: [
      {
        _id: "6797069d2fcf17765ac76bb4",
        name: "sahil mahadik",
        image:
          "http://res.cloudinary.com/drjkcwu5x/image/upload/v1740680179/xcfvwukkbqlkwi1zhpks.png",
        username: "sahil",
      },
      {
        _id: "6797137162eee52894d9e95a",
        name: "Velan",
        username: "velan",
      },
      {
        _id: "679783e463818ca31e834246",
        name: "Raman",
        username: "raman01",
      },
    ],
    profilePic:
      "https://res.cloudinary.com/drjkcwu5x/image/upload/v1740323234/vn0ay8zwkxorqegovbkr.jpg",
    banner:
      "https://res.cloudinary.com/drjkcwu5x/image/upload/v1740323235/q90ow9abqledxdnahfv3.jpg",
    category: "technology",
    createdAt: "2025-02-23T15:07:16.817Z",
    updatedAt: "2025-02-23T15:07:16.817Z",
    __v: 0,
  };
  function getRelativeTime(dateString: string) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    // Get difference in milliseconds
    const diffInMs = currentDate.getTime() - givenDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate month length

    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
    }
  }

  if (session?.user?.id === selectedCommunity.admin) {
    setIsAdmin(true);
  }

  return (
    <div className="h-full bg-gray-800 rounded-xl">
      <header className="pt-5 flex flex-col gap-5 relative">
        {selectedCommunity?.banner ? (
          <Image
            src={selectedCommunity?.banner}
            alt={selectedCommunity?.name}
            height={300}
            width={300}
            className="h-48 w-[90%] rounded-xl mx-auto cursor-pointer"
          />
        ) : null}
        <div className="relative">
          <Image
            src={selectedCommunity.profilePic}
            alt={selectedCommunity._id}
            height={200}
            width={200}
            className="size-32 rounded-full cursor-pointer mx-auto"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          />
          <input
            type="file"
            ref={profilePicRef}
            className="hidden"
            onChange={handleProfilePicChange}
            name="profile-image"
            accept=".png, .jpg, .jpeg, .svg, .webp"
          />

          {hovered && (
            <div
              className=" absolute size-32 inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full mx-auto text-white text-3xl z-1"
              onClick={() => handleProfilePic}
            >
              <Plus size={32} />
            </div>
          )}
        </div>
        <p className="text-center text-gray-400">
          {" "}
          Created {getRelativeTime(selectedCommunity.createdAt)}
        </p>
      </header>
      <div>
        <div className="flex justify-center items-center">
          <input
            type="text"
            disabled={!isAdmin || !isEditable}
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="bg-inherit rounded-md p-3 text-center text-3xl focus:none outline-none"
          />
          {/* {!saveChanges && (
            <Button
              content={<FaPen />}
              disabled={!isAdmin}
              event={handleEdit}
            />
          )}
          {saveChanges && (
            <>
              <button>
                {" "}
                <Check />{" "}
              </button>
            </>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default page;
