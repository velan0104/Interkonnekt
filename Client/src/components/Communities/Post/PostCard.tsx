"use client";

import { CommunityPostProps, IWorkshop, Poll } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Smile } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { PollCard } from "./Poll";
import apiClient from "@/lib/api-client";
import {
  ADD_COMMUNITY_POST_COMMENT,
  GET_WORKSHOP_BY_ID,
  LIKE_COMMUNITY_POST,
} from "@/lib/constant";
import { Textarea } from "@/components/ui/textarea";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function PostCard({ post }: { post: CommunityPostProps }) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(post.likes?.length || 0);
  const [commentCount, setCommentCount] = useState<number>(
    post.comments?.length || 0
  );
  const [workshop, setWorkshop] = useState<IWorkshop>();
  const [comments, setComments] = useState<string>("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isWorkshop = post.isWorkshop;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji: EmojiClickData) => {
    setComments((msg) => msg + emoji.emoji);
  };

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    const res = await apiClient.post(
      `${LIKE_COMMUNITY_POST}`,
      {
        postId: post._id,
      },
      {
        withCredentials: true,
      }
    );

    if (res.status === 200) {
      console.log("Liked successfully");
    } else {
      console.log("Failed to like");
    }
  };

  const handleComment = async () => {
    if (comments.length == 0) {
      toast({ title: "Comment field can't be empty" });
      return;
    }

    const res = await apiClient.post(
      `${ADD_COMMUNITY_POST_COMMENT}`,
      {
        postId: post._id,
        content: comments,
      },
      {
        withCredentials: true,
      }
    );
    if (res.status === 201 && res.data) {
      toast({ title: "Comment added successfully" });
      setCommentCount((prev) => prev + 1);
      setIsOpen(false);
    } else {
      toast({ title: "Failed to add comments" });
    }
  };

  const fetchWorkshop = async () => {
    // console.log("WORKSHOP ID: ", post.workshopId);
    if (post.workshopId) {
      const res = await apiClient.get(
        `${GET_WORKSHOP_BY_ID}/${post.workshopId}`,
        {
          withCredentials: true,
        }
      );
      const data = res.data.data;
      // console.log("WORKSHOP DETAILS: ", data);
      setWorkshop(data);
    }
  };

  useEffect(() => {
    fetchWorkshop();
  }, []);

  return (
    <Card
      className={`w-full max-w-2xl mx-auto rounded-xl my-2 bg-gray-900/70 border-2  text-white ${
        isWorkshop ? "border-theme" : "border-gray-700"
      }`}
    >
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={`${post.author.image}}`} />
            <AvatarFallback>
              {post.author?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-xl font-semibold">{post.author?.name}</p>
                <div className=" flex gap-5 items-center">
                  {post.community?.name && <p> {post.community?.name} </p>}
                  <p className="text-sm  text-white/30">
                    {formatDistanceToNow(
                      new Date(post.createdAt || Date.now()),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                </div>
              </div>

              {isWorkshop && (
                <Badge
                  variant="secondary"
                  className="bg-theme text-white hover:bg-theme"
                >
                  {workshop?.category}
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-semibold leading-tight">
              {post.title}
            </h3>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="space-y-4 cursor-pointer"
        onClick={() => router.push(`communities/post/${post._id}`)}
      >
        <p className="text-base">{post.content}</p>
        {post.poll && (
          <div className="mt-4">
            <PollCard poll={post.poll} />
          </div>
        )}
        {post.media && post.media?.length > 0 && (
          <div
            className={`grid gap-2 ${
              post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"
            }`}
          >
            {post.media.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Post media ${index + 1}`}
                width={200}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
            {isWorkshop && workshop?.bannerImage && (
              <Image
                src={workshop.bannerImage}
                alt={workshop._id.toString()}
                width={200}
                height={200}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            {isWorkshop && workshop?.startTime && (
              <h1 className="bg-red-50">
                {" "}
                {workshop?.startTime.toLocaleDateString()}{" "}
              </h1>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 border-t-gray-700">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 text-lg ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart
              className={`w-20 h-20 text-3xl ${isLiked ? "fill-red-600" : ""}`}
            />
            <span>{likesCount}</span>
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setIsOpen(true)}
              >
                <MessageCircle className="w-5 h-5 text-3xl " />
                <span className="text-xl">{commentCount}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="fiter backdrop-blur-0 bg-gray-900 text-white/80 rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-[#53c97d]">Comments</DialogTitle>
                <DialogDescription>
                  <Textarea
                    placeholder="Write your comments..."
                    onChange={(e) => setComments(e.target.value)}
                    value={comments}
                    className="outline-none border-2 border-gray-600 rounded-lg my-3"
                  />
                  <div className="flex justify-between items-center">
                    <Button
                      className="bg-theme rounded-xl text-base"
                      onClick={handleComment}
                    >
                      {" "}
                      Add Comments{" "}
                    </Button>
                    <button
                      className=" text-neutral-500 hover:text-white focus:border-none focus:outline-none foucs:text-white focus:rounded-full p-1 duration-300 transition-all"
                      onClick={() => setEmojiPickerOpen(true)}
                    >
                      <Smile className=" text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                      <EmojiPicker
                        theme={Theme.DARK}
                        open={emojiPickerOpen}
                        onEmojiClick={handleAddEmoji}
                        autoFocusSearch={false}
                      />
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="sm" className="gap-2 text-xl">
            <Share2 className="w-5 h-5" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
