import apiClient from "@/lib/api-client";
import { GET_WORKSHOP_BY_ID } from "@/lib/constant";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

const WorkshopPost = ({ post }: { post: any }) => {
  const [workshop, setWorkshop] = useState<any | null>(null);

  useEffect(() => {
    console.log(`WORKSHOP ENDPOINT: ${GET_WORKSHOP_BY_ID}/${post.workshopId}`);
    console.log("TYPE: ", typeof post.workshopId);
    const fetchWorkshop = async () => {
      const res = await apiClient.get(
        `${GET_WORKSHOP_BY_ID}/${post.workshopId}`,
        {
          withCredentials: true,
        }
      );
      const data = res.data;
      setWorkshop(data);
    };

    fetchWorkshop();
  }, [post.workshopId]);

  if (!workshop) {
    return <div>Loading workshop details...</div>;
  }

  return (
    // <div className="mx-auto border-2 border-theme">
    //   <h2 className="text-xl font-bold">{post.title}</h2>
    //   <p>{post.content}</p>
    //   <div className="mt-2">
    //     <p>Workshop Host: {workshop.host}</p>
    //     <p>Start Time: {new Date(workshop.startTime).toLocaleString()}</p>
    //     <p>Category: {workshop.category}</p>
    //     <a href={`/call/${workshop.meetingLink}`} className="text-blue-500">
    //       Join Workshop
    //     </a>
    //   </div>
    // </div>

    <Card className="w-full max-w-2xl mx-auto rounded-xl my-2 bg-gray-900/70 border-2 border-gray-700 text-white">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={`${workshop.host.image}`} />
            <AvatarFallback>
              {workshop.host?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className=" text-xl font-semibold">{workshop.host.name}</p>
                <div className=" flex gap-5 items-center">
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
              {/* <Badge variant="secondary">{post.tags}</Badge> */}
            </div>
            <h3 className="text-xl font-semibold leading-tight">
              {workshop.title}
            </h3>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className="space-y-4 cursor-pointer"
        // onClick={() => router.push(`communities/post/${post._id}`)}
      >
        <p className="text-base">{post.content}</p>
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
};

export default WorkshopPost;
