"use client";
import CreateWorkshopModal from "@/components/Workshop/CreateWorkshopModal";
import WorkshopList from "@/components/Workshop/WorkshopList";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8 text-white">Workshops</h1>
        <CreateWorkshopModal id={id} />
      </div>
      <WorkshopList />
    </div>
  );
};

export default page;
