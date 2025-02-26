"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CldImage } from "next-cloudinary";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import apiClient from "@/lib/api-client";
import { GET_COMMUNITY } from "@/lib/constant";
import { setCommunitySuggestion } from "@/Slice/communitySlice";
import axios from "axios";
import { Types } from "mongoose";
import { IMembers } from "@/types";

interface Community {
  name: string;
  bio: string;
  admin: Types.ObjectId;
  members: IMembers[];
  banner: string;
  category: string;
  profilePic: string;
}

const CommunityCard = ({ item }: { item: Community }) => {
  let count = 0;
  return (
    <div className="rounded-2xl bg-gray-800 m-4 relative">
      <div className="h-32 rounded-2xl ">
        <CldImage
          src={item.banner}
          alt="hello"
          width={200}
          height={200}
          className="w-full h-full bg-center aspect-video rounded-t-2xl"
        />
      </div>
      <div className="absolute top-24 right-5 ">
        <CldImage
          src={item.profilePic}
          alt="hello"
          width={200}
          height={200}
          className="size-20 bg-cover aspect-video rounded-full bg-white"
        />
      </div>
      <div className="flex justify-between items-center text-white px-5 py-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tighter">
            {item.name}
          </h2>
          <h3 className="text-lg font-light max-w-[50%] line-clamp-2">
            {" "}
            {item.bio}{" "}
          </h3>
        </div>
        <div className="flex relative items-center ">
          {item.members.map((member, idx) => {
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
          {item.members.length > 5 && (
            <div className="p-2">{item.members.length - 5}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExploreCommunity = () => {
  const category = [
    "Technology",
    "Music",
    "Communication",
    "Dancing",
    "Arts",
    "Coding",
  ];
  const colors = [
    "bg-[#f27329]",
    "bg-[#171ee6]",
    "bg-[#de09a5]",
    "bg-[#f7c80c]",
    "bg-[#06a132]",
    "bg-[#c41b08]",
  ];
  let count = 0;

  const communities = useSelector(
    (state: RootState) => state.community.communitySuggestion
  );
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (searchTerm: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/community/search?query=${searchTerm}`,
        {
          withCredentials: true,
        }
      );
      setSearchResults(response.data.communities);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const getCommunity = async () => {
    try {
      const response = await apiClient.get(GET_COMMUNITY, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data) {
        dispatch(setCommunitySuggestion(response.data.communities));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!communities) {
      getCommunity();
    }
  }, []);

  return (
    <div className="h-[89vh] overflow-y-scroll">
      <h1 className="text-2xl mt-5 text-center mb-3 text-theme font-semibold">
        Explore
      </h1>
      <hr />
      <div className="mt-3 px-5 ">
        <Input
          placeholder="Search..."
          className="outline-none border-none bg-white rounded-3xl h-12 px-3"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="mt-7 text-center text-xl text-white border-b-2 border-b-gray-500 pb-5 w-auto overflow-scroll cursor-pointer">
        <div className="flex gap-3 ">
          {category.map((item, index) => (
            <div
              key={item}
              className={`${colors[index]} p-2 rounded-xl text-base font-light`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      {searchResults && searchResults.length > 0 ? (
        <div>
          {searchResults.map((item, index) => (
            <CommunityCard item={item} key={index} />
          ))}
        </div>
      ) : (
        <div className=" h-auto ">
          {communities?.map((item, index) => (
            <CommunityCard item={item} key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreCommunity;
