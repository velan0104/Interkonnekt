import apiClient from "@/lib/api-client";
import { GET_WORKSHOP_BY_ID } from "@/lib/constant";
import { useEffect, useState } from "react";

const WorkshopPost = ({ post }: { post: any }) => {
  const [workshop, setWorkshop] = useState<any | null>(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      const res = await apiClient.get(
        `${GET_WORKSHOP_BY_ID}/${post.workshopId}`,
        {
          withCredentials: true,
        }
      );
      const data = res.data();
      setWorkshop(data);
    };

    fetchWorkshop();
  }, [post.workshopId]);

  if (!workshop) {
    return <div>Loading workshop details...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">{post.title}</h2>
      <p>{post.content}</p>
      <div className="mt-2">
        <p>Workshop Host: {workshop.host}</p>
        <p>Start Time: {new Date(workshop.startTime).toLocaleString()}</p>
        <p>Category: {workshop.category}</p>
        <a href={`/call/${workshop.meetingLink}`} className="text-blue-500">
          Join Workshop
        </a>
      </div>
    </div>
  );
};

export default WorkshopPost;
