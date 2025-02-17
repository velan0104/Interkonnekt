import { Heart, MessageCircle, Share2 } from "lucide-react";
import Image from "next/image";

const PostCard = ({ post }) => {
  return (
    <div className="max-w-2xl bg-gray-800 w-full mx-auto cursor-pointer m-1 rounded-xl">
      <div className="flex py-3 px-5 gap-8 items-start">
        <div className="h-14 min-w-14 rounded-full text-center bg-gray-400 text-3xl font-medium">
          {post.image ? (
            <Image
              src={post.image}
              alt="post"
              width={100}
              height={100}
              className="h-full w-full rounded-full"
            />
          ) : (
            <span className="">{post.author.substring(0, 1)}</span>
          )}
        </div>
        <div>
          <div className="text-lg font-semibold text-white">{post.author}</div>
          <span className="text-base font-light text-white/80">
            {post.community}
          </span>
          <div className="max-w-[90%] pt-3">{post?.content}</div>
          {post.image && (
            <div className="max-w-[90%] bg-gray-600/30 rounded-xl p-3 mt-2">
              <Image
                src={post.image}
                alt="post"
                width={300}
                height={300}
                className="aspect-auto max-h-[300px] mx-auto rounded-lg"
              />
            </div>
          )}
          <div className="flex gap-10 px-5 my-3">
            <div className="flex gap-2">
              <Heart /> {post.like}
            </div>
            <div className="flex gap-2">
              <MessageCircle /> {post.comment}
            </div>
            <div className="flex gap-2">
              <Share2 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
