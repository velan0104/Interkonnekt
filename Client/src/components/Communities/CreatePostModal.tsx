"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Image as ImageIcon, X, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICommunityPost, Poll, POST_CATEGORIES } from "@/types";
import axios from "axios";
import apiClient from "@/lib/api-client";
import { CREATE_POST } from "@/lib/constant";
import { useToast } from "@/hooks/use-toast";

export function CreatePostModal({ id }: { id: string }) {
  const [postData, setPostData] = useState<Partial<ICommunityPost>>({
    title: "",
    content: "",
    media: [],
    category: "",
    community: id,
  });
  console.log("POSTDATA: ", postData);

  const [pollData, setPollData] = useState<Poll>({
    question: "",
    options: [
      { text: "", votes: 0 },
      { text: "", votes: 0 },
    ],
    endDate: new Date(),
  });

  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("post");
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedMediaUrls: string[] = [];
    console.log("1. Files: ", files);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
      );
      formData.append(
        "cloud_name",
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string
      );
      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          formData
        );

        const data = await response.data;
        uploadedMediaUrls.push(data.secure_url);
      } catch (error) {
        console.log("Upload failed:", error);
      }
    }

    setPostData((prev) => ({
      ...prev,
      media: [...(prev.media || []), ...uploadedMediaUrls],
    }));

    setMediaPreview((prev) => [...prev, ...uploadedMediaUrls]);
  };

  const removeMedia = (index: number) => {
    setMediaPreview((prev) => prev.filter((_, i) => i !== index));
    setPostData((prev) => ({
      ...prev,
      media: prev.media?.filter((_, i) => i !== index),
    }));
  };

  const addPollOption = () => {
    setPollData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", votes: 0 }],
    }));
  };

  const removePollOption = (index: number) => {
    setPollData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    setPostData((prev) => ({
      ...prev,
      community: id,
    }));

    const finalData =
      selectedTab === "post"
        ? { media: postData.media, ...postData }
        : {
            media: postData.media,
            poll: pollData,
            ...postData,
          };

    console.log(finalData);

    try {
      const response = await apiClient.post(`${CREATE_POST}`, finalData, {
        withCredentials: true,
      });

      console.log("RESPONSE: ", response);

      if (response.status === 201) {
        setIsOpen(false);
        console.log("Post created successfully!");
        toast({ title: "Post created successfully!" });
      } else {
        console.log("Failed to create post");
        toast({ title: "Failed to create post" });
      }
    } catch (error) {
      console.log("Error submitting post:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gray-100">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="post">Regular Post</TabsTrigger>
            <TabsTrigger value="poll">Poll</TabsTrigger>
          </TabsList>
          <TabsContent value="post" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={postData.title}
                  onChange={(e) =>
                    setPostData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter your post title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={postData.content}
                  onChange={(e) =>
                    setPostData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="What's on your mind?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={postData.category}
                  onValueChange={(value) =>
                    setPostData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Media</Label>
                <div className="grid grid-cols-2 gap-4">
                  {mediaPreview.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  <label
                    className={cn(
                      "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer",
                      "hover:bg-gray-50 transition-colors",
                      mediaPreview.length >= 4 && "hidden"
                    )}
                  >
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      Add Media
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleMediaUpload}
                      disabled={mediaPreview.length >= 4}
                    />
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="poll" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="poll-question">Poll Question</Label>
                <Input
                  id="poll-question"
                  value={pollData.question}
                  onChange={(e) =>
                    setPollData((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  placeholder="Ask a question"
                />
              </div>

              <div className="space-y-2">
                <Label>Options</Label>
                {pollData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...pollData.options];
                        newOptions[index].text = e.target.value;
                        setPollData((prev) => ({
                          ...prev,
                          options: newOptions,
                        }));
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    {index > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePollOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {pollData.options.length < 5 && (
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={addPollOption}
                  >
                    <PlusSquare className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={postData.category}
                  onValueChange={(value) =>
                    setPostData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="poll-end-date">Poll End Date</Label>
                <Input
                  id="poll-end-date"
                  type="datetime-local"
                  value={pollData.endDate.toISOString().slice(0, 16)}
                  onChange={(e) =>
                    setPollData((prev) => ({
                      ...prev,
                      endDate: new Date(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button onClick={handleSubmit}>Create Post</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
