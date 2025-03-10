import WorkshopList from "@/components/Workshop/WorkshopList";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Workshops</h1>
      <WorkshopList />
    </div>
  );
};

export default page;
