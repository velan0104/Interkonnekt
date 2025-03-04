"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api-client";
import { CREATE_COMMUNITY } from "@/lib/constant";

const CreateWorkshopForm = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    category: "",
    bannerImage: "",
    maxParticipants: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await apiClient.post(
      `${CREATE_COMMUNITY}`,
      {
        ...formData,
        host: session?.user?.id,
      },
      {
        withCredentials: true,
      }
    );

    const result = await response.data();

    if (response.status === 201) {
      alert("Workshop created successfully!");
    } else {
      setError(result.message || "Failed to create workshop.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <input
        type="datetime-local"
        value={formData.startTime}
        onChange={(e) =>
          setFormData({ ...formData, startTime: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />
      <input
        type="text"
        placeholder="Banner Image URL"
        value={formData.bannerImage}
        onChange={(e) =>
          setFormData({ ...formData, bannerImage: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Max Participants"
        value={formData.maxParticipants}
        onChange={(e) =>
          setFormData({
            ...formData,
            maxParticipants: parseInt(e.target.value),
          })
        }
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Create Workshop</button>
    </form>
  );
};

export default CreateWorkshopForm;
