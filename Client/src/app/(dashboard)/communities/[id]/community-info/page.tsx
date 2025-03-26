"use client";
import { RootState } from "@/app/Store/store";
import { toast, useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import { COMMUNITY_ROUTE } from "@/lib/constant";
import { Check, Trash2, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";

// const selectedCommunity = {
//   _id: "67bb39a4395a5032a5815997",
//   name: "Codecthon",
//   bio: "hello world",
//   admin: {
//     _id: "679e37fa004065a0a602f560",
//     name: "velan",
//     username: "velan01",
//     image:
//       "http://res.cloudinary.com/drjkcwu5x/image/upload/v1740680179/xcfvwukkbqlkwi1zhpks.png",
//   },
//   members: [
//     {
//       _id: "6797069d2fcf17765ac76bb4",
//       name: "sahil mahadik",
//       image:
//         "http://res.cloudinary.com/drjkcwu5x/image/upload/v1740680179/xcfvwukkbqlkwi1zhpks.png",
//       username: "sahil",
//     },
//     {
//       _id: "6797137162eee52894d9e95a",
//       name: "Velan",
//       username: "velan",
//     },
//     {
//       _id: "679783e463818ca31e834246",
//       name: "Raman",
//       username: "raman01",
//     },
//   ],
//   profilePic:
//     "https://res.cloudinary.com/drjkcwu5x/image/upload/v1740323234/vn0ay8zwkxorqegovbkr.jpg",
//   banner:
//     "https://res.cloudinary.com/drjkcwu5x/image/upload/v1740323235/q90ow9abqledxdnahfv3.jpg",
//   category: "technology",
//   createdAt: "2025-02-23T15:07:16.817Z",
//   updatedAt: "2025-02-23T15:07:16.817Z",
//   __v: 0,
// };

const page = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [hovered, setHovered] = useState<boolean>(false);
  const profilePicRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [saveChanges, setSaveChanges] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const { data: session } = useSession();
  const selectedCommunity = useSelector(
    (state: RootState) => state.community.selectedCommunity
  );
  const [name, setName] = useState<string>(selectedCommunity?.name!);

  const handleProfilePicChange = () => {};

  const handleProfilePic = () => {
    if (profilePicRef.current) {
      profilePicRef.current.click();
    }
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

  const handleEdit = () => {
    setSaveChanges(!saveChanges);
    setIsEditable(true);
  };

  const created = getRelativeTime(selectedCommunity.createdAt);

  const deleteMember = async (memberId: string) => {
    try {
      const res = await apiClient.delete(
        `${COMMUNITY_ROUTE}/${selectedCommunity._id}/member/${memberId}`
      );

      if (res.status === 201) {
        toast({ title: "Member removed Successfully" });
      }
    } catch (error) {
      console.log(error);
      toast({ tile: "Failed to remove " });
    }
  };

  return (
    <div className="h-[89vh] bg-gray-800 overflow-y-auto">
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
        <p className="text-center text-gray-400"> Created {created} </p>
      </header>
      <div>
        <div className="flex justify-center items-center gap-2">
          <input
            type="text"
            disabled={!isEditable}
            onChange={(e) => setName(e.target.value)}
            value={name}
            autoFocus={!isEditable}
            className="bg-inherit rounded-md p-3 text-center text-xl text-white font-bold  focus:none outline-none"
          />

          <button
            // disabled={!isAdmin}
            onClick={handleEdit}
            className="cursor-pointer bg-gray-900 rounded-full p-3 text-white "
          >
            <FaPen />
          </button>

          <button
            className={`${
              saveChanges ? "block" : "hidden"
            } p-3 text-white bg-gray-900 rounded-full`}
            onClick={() => setSaveChanges(false)}
          >
            <Check />
          </button>
        </div>
      </div>
      <div className="bg-gray-900 h-fit w-[80%] rounded-xl p-5 mx-auto flex flex-col gap-3 mb-3 border-2 border-theme cursor-pointer">
        <h1 className="text-gray-200 font-semibold"> Admin </h1>

        <div className=" w-full flex gap-5 justify-between rounded-xl ">
          <div className="flex gap-5">
            {selectedCommunity.admin.image ? (
              <Image
                src={selectedCommunity.admin?.image}
                alt={selectedCommunity.admin.name}
                width={100}
                height={100}
                className="rounded-full h-10 w-10"
              />
            ) : (
              <div className="text-xl flex items-center justify-center rounded-full h-10 w-10 p-3 bg-gray-800 text-white border-theme border-2 ">
                {selectedCommunity.admin.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-semibold text-lg text-white">
                {" "}
                {selectedCommunity.admin.username}{" "}
              </h1>
              <h2 className="text-base font-medium text-gray-100">
                {" "}
                {selectedCommunity.admin.name}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-gray-900 h-fit w-[80%] rounded-xl p-5 mx-auto flex flex-col gap-3 mb-3 border-2 border-theme cursor-pointer"
        onMouseLeave={() => setHoverIndex(-1)}
      >
        <h1 className="text-gray-200 font-semibold text-xl"> Members </h1>
        {selectedCommunity?.members.map((member, index) => (
          <div
            key={index}
            className=" w-full flex gap-5 justify-between p-4 rounded-xl hover:bg-gray-800"
            onMouseEnter={() => setHoverIndex(index)}
          >
            <div className="flex gap-5">
              {member.image ? (
                <Image
                  src={member?.image}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="rounded-full h-10 w-10"
                />
              ) : (
                <div className="text-xl flex items-center justify-center rounded-full h-10 w-10 p-3 bg-gray-800 text-white border-theme border-2 ">
                  {member.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="font-semibold text-lg text-white">
                  {" "}
                  {member.username}{" "}
                </h1>
                <h2 className="text-base font-medium text-gray-100">
                  {" "}
                  {member.name}
                </h2>
              </div>
            </div>
            {isAdmin && (
              <button
                className={`py-2 px-4 rounded-full bg-red-400 text-white font-bold ${
                  hoverIndex === index ? "block" : "hidden"
                }`}
                onClick={() => deleteMember(member._id.toString())}
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto w-[80%] mb-5">
        <button
          onClick={() => deleteMember(session?.user?.id.toString())}
          className="bg-red-500 font-bold text-white w-full py-3 text-center mx-auto rounded-xl"
        >
          Exit Community
        </button>
      </div>
    </div>
  );
};

export default page;
