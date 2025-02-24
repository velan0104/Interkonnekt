"use client";
import { RootState } from "@/app/Store/store";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const page = () => {
  const { id } = useParams();
  const selectedCommunity = useSelector(
    (state: RootState) => state.community.selectedCommunity
  );
  return (
    <div className="h-full bg-gray-800 rounded-xl">
      <header>
        {selectedCommunity?.banner ? (
          <Image
            src={selectedCommunity?.banner}
            alt={selectedCommunity?.name}
            height={300}
            width={300}
            className="h-44 w-full rounded-t-xl"
          />
        ) : null}
      </header>
    </div>
  );
};

export default page;
