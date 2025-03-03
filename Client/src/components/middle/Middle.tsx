"use client";

import { Heart, MessageCircle, Share2, MoreHorizontal, X } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import {
  addCommentAsync,
  fetchPosts,
  toggleLikeAsync,
} from "@/Slice/postsSlice";
import { useDispatch } from "@/hooks/useDispatch";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { use } from "react";
import { Activity, addActivity } from "@/Slice/activitiesSlice";
import { IActivity } from "@/models/Activity";
import Image from "next/image";

type ModalState = {
  isOpen: boolean;
  postId: string | null;
  userId: string | null;
};

const SkeletonLoader: React.FC = () => (
  <div className="space-y-6 bg-gray-800">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="animate-pulse bg-gray-800 rounded-xl p-4 shadow-lg space-y-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
            <div className="h-3 w-1/4 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
        <div className="h-32 bg-gray-700 rounded"></div>
        <div className="flex gap-4">
          <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    ))}
  </div>
);

interface PostFeedProps {
  userId: string;
}

const PostFeed: FC<PostFeedProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const posts = useSelector((state: RootState) => (state.posts as any).posts);
  const postStatus = useSelector(
    (state: RootState) => (state.posts as any).status
  );
  const error = useSelector((state: RootState) => (state.posts as any).error);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [image, setImage] = useState("");
  const [vote, setVote] = useState<boolean>(false);

  console.log("posts at middle: ", posts);
  useEffect(() => {
    console.log("userId at middle: ",userId)
    console.log("sessionId: ",session)
    if(userId || session){
    if(session){
      dispatch(fetchPosts({ userId:  undefined, sessionUserId: session?.user?.id }));
    }else if(userId){
      dispatch(fetchPosts({ userId: userId , sessionUserId: undefined }));
    }else{
      dispatch(fetchPosts({ 
        userId: userId || undefined, 
        sessionUserId: session?.user?.id || undefined 
      }));
    }
  }
  }, [pathname, dispatch, vote,session]);
 // console.log("sessionId2: ",session)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [commentsModal, setCommentsModal] = useState<ModalState>({
    isOpen: false,
    postId: null,
    userId: null,
  });
  const [shareModal, setShareModal] = useState<ModalState>({
    isOpen: false,
    postId: null,
    userId: null,
  });

  const [newComment, setNewComment] = useState<string>("");
  const [likes, setLikes] = useState<{ [key: string]: { liked: boolean } }>({});

  const user_id = session?.user?.id;
  const email = session?.user?.email;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value); // Update local state
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getUnameInterest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      const data = await response.json();
      setImage(data.image);
    };

    fetchData();
  }, [dispatch, pathname, session]);

  const handleLike = async (postId: string, userId2: string) => {
    // Step 1: Toggle the like in the store
    await dispatch(toggleLikeAsync({ postId, userId: session?.user?.id }));

    // Step 2: Add activity if the user is not the owner
    if (userId2 !== session?.user?.id) {
      const newActivity: Activity = {
        likedById: session?.user?.id,
        id: userId2,
        post_id: postId,
        type: "like",
        user: {
          name: session?.user?.name || "",
          avatar: image || session?.user?.image || "",
        },
        text: "liked your post",
        timestamp: new Date().toISOString(),
      };

      dispatch(addActivity(newActivity));
    }
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profile/?userId=${userId}`);
  };

  const handleComment = async (
    postId: string,
    content: string,
    userId: string
  ) => {
    if (content.trim() !== "") {
      try {
        await dispatch(
          addCommentAsync({ postId, content, userId: user_id })
        ).unwrap();
        if (userId != session?.user?.id) {
          const newActivity: Activity = {
            likedById: "",
            id: userId,
            post_id: postId,
            type: "comment",
            user: {
              name: session?.user?.name || "",
              avatar: image || session?.user?.image || "",
            },
            text: "commmented on your post",
            timestamp: new Date().toISOString(),
          };

          dispatch(addActivity(newActivity));
        }
        setCommentsModal({ isOpen: false, postId: null, userId: null });
        dispatch(fetchPosts({ userId: "" }));
      } catch (error) {
        console.log("Failed to post comment:", error);
      }
    }
  };

  const handleShare = (postId: string) => {
    setShareModal({
      isOpen: true,
      postId,
      userId: null,
    });
  };

  const handleDelete = async (postId: string) => {
    const response = await fetch("/api/deletePost", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    const data = await response.json();
    setActiveDropdown(null);
    dispatch(fetchPosts({ userId: "" }));
  };

  if (!session) return <SkeletonLoader />;

  const Dropdown: React.FC<{ postId: string; userId: string }> = ({
    postId,
    userId,
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute right-0 top-8 bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-xl py-2 min-w-[170px] border border-gray-700"
      >
        {session?.user?.id === userId && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(postId)}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700/60 hover:scale-105 transition-all duration-200"
          >
            Delete
          </motion.button>
        )}
      </motion.div>
    );
  };

  const currentPost = posts.find(
    (post: any) => post._id === commentsModal.postId
  );
  const comments = currentPost?.comments || [];

  const CommentsModal: React.FC = () => {
    const [commentInput, setCommentInput] = useState(newComment);

    const postComment = async () => {
      if (commentInput.trim() !== "") {
        await handleComment(
          commentsModal.postId || "",
          commentInput,
          commentsModal.userId || ""
        );
        setCommentInput("");
      }
    };

    return (

      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        <motion.div
          className="bg-gray-900 bg-opacity-90 backdrop-blur-lg border border-gray-700 rounded-xl p-6 max-w-[500px] w-full shadow-2xl transform transition-all"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 40, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <h2 className="text-white text-2xl font-semibold tracking-wide">
              Comments
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() =>
                setCommentsModal({
                  isOpen: false,
                  postId: null,
                  userId: null,
                })
              }
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
            >
              <X className="w-6 h-6 text-gray-300" />
            </motion.button>
          </div>

          {/* Comments Section */}
          <div className="max-h-[300px] overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-600">
            {comments.length > 0 ? (
              comments.map((comment: any, index: number) => (
                <motion.div
                  key={index}
                  className="bg-gray-800 bg-opacity-80 rounded-lg p-3 shadow-sm hover:bg-opacity-100 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07, ease: "easeOut" }}
                >
                  <p className="text-white text-sm">{comment.content}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Input Field */}
          <motion.div
            className="flex gap-2 items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Write a comment..."
            />
            <motion.button
              onClick={postComment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#53c97d] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#53e686] transition-all"
            >
              Post
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  const ShareModal: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-[400px] w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Share Post</h2>
          <button
            onClick={() =>
              setShareModal({
                isOpen: false,
                postId: null,
                userId: null,
              })
            }
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="space-y-3">
          <button className="w-full bg-[#2A2A2A] text-white p-3 rounded-lg hover:bg-[#3A3A3A]">
            Copy Link
          </button>
          <button className="w-full bg-[#2A2A2A] text-white p-3 rounded-lg hover:bg-[#3A3A3A]">
            Share to Twitter
          </button>
          <button className="w-full bg-[#2A2A2A] text-white p-3 rounded-lg hover:bg-[#3A3A3A]">
            Share to Facebook
          </button>
        </div>
      </div>
    </div>
  );

  if (postStatus == "loading") return <SkeletonLoader />;
  if (postStatus === "failed") return <p>Error: {error}</p>;
  const handleVote = async (postId: string, option: any, userId: string) => {
    console.log("handle vote called");
    setVote(true);
    const hasVoted = option.votes && option.votes.includes(userId);

    // Update local state optimistically
    const updatedOption = hasVoted
      ? option.votes.length - 1
      : option.votes.length + 1;

    // Optimistically update the poll options locally
    // const updatedPoll = posts.map(post => {
    //   if (post._id === postId) {
    //     const updatedOptions = post.poll[0].options.map((opt: any) => {
    //       if (opt.option === option.option) {
    //         const updatedVotes = hasVoted
    //           ? opt.votes.filter((id: string) => id !== userId)
    //           : [...opt.votes, userId];
    //         return { ...opt, votes: updatedVotes };
    //       }
    //       return opt;
    //     });
    //     return { ...post, poll: [{ ...post.poll[0], options: updatedOptions }] };
    //   }
    //   return post;
    // });

    // setPosts(updatedPoll);

    try {
      console.log("calling vote");
      // Send request to update vote in the database
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          option: option.optionValue,
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Vote updated successfully:", data);
      } else {
        // Rollback UI if there was an error with the API

        console.error("Error updating vote:", data);
      }
    } catch (error) {
      // Rollback UI in case of network or server error

      console.error("Error updating vote:", error);
    } finally {
      setVote(false);
    }
  };

  return (
    <main className={`absolute w-full  max-w-[48rem] h-auto min-h-[40rem] sm:max-w-[47rem] md:max-w-[35rem] lg:max-w-[48rem] xl:max-w-[35.5rem] 2xl:max-w-[47.5rem] left-0  bg-gray-900 overflow-x-hidden px-4 py-6 pb-28 ${pathname.includes("/profile") ? "left-0" : "xl:left-[24rem] 2xl:left-96"
      }`}>


      <div className="container mx-auto space-y-6 h-full overflow-y-auto">
        <Suspense fallback={<SkeletonLoader />}>
          {postStatus === "loading" ? (
            <SkeletonLoader />
          ) : (
            <>
              {posts.map((post: any, index: any) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 "
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div
                      className="flex gap-4 cursor-pointer"
                      onClick={() => handleProfileClick(post.user_id)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 rounded-full overflow-hidden border-1 border-[#53c97d] shadow-md shadow-[#53c97d]/50"
                      >
                        {/* {post.profileImage ? (
                          post.profileImage.includes(
                            "https://lh3.googleusercontent.com"
                          ) ? (
                            <img
                              src={post.profileImage}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <CldImage
                              src={post.profileImage}
                              alt="Profile Image"
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                            alt={`${
                              post.newUsername || "User"
                            } profile picture`}
                            className="w-full h-full object-cover"
                          />
                        )} */}
                        <Image
                          src={post.profileImage || session?.user?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                          alt="Profile Image"
                          width={80}
                          height={60}
                          className="w-16 h-16 object-cover rounded-full border-2 border-blue-500 shadow-lg shadow-blue-600/50"
                        />
                      </motion.div>

                      <div>
                        <h3 className="text-white font-semibold text-lg">
                          {post.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          @{post.newUsername}
                        </p>
                      </div>
                    </div>

                    {/* More Options Dropdown */}
                    {session?.user?.id === post.user_id && (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative"
                      >
                        <button
                          aria-label="More options"
                          onClick={() =>
                            setActiveDropdown(
                              activeDropdown === post._id ? null : post._id
                            )
                          }
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                        {activeDropdown === post._id && (
                          <Dropdown postId={post._id} userId={post.user_id} />
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="text-white mt-4 text-[15px] leading-relaxed">
                    {post.content}
                  </p>

                  {/* Post Media */}
                  {post.image && (
                    <motion.div className="mt-4">
                      <img
                        src={post.image}
                        alt="Post media"
                        className="w-full aspect-video object-cover rounded-xl transition-all duration-300"
                      />
                    </motion.div>
                  )}

                  {/* Polls */}
                  <div className="flex flex-col items-center w-full">
                    {post.poll &&
                      post.poll.map((poll, index) => {
                        const totalVotes = poll.options.reduce(
                          (sum, option) => sum + option.votes.length,
                          0
                        );

                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="w-full max-w-lg bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl mt-6 shadow-2xl backdrop-blur-lg border border-gray-600"
                          >
                            {/* Poll Question */}
                            <h3 className="text-white font-extrabold text-lg text-center">
                              {poll.question}
                            </h3>

                            <ul className="mt-4 space-y-4">
                              {poll.options.map((option, optionIndex) => {
                                const votePercentage =
                                  totalVotes > 0
                                    ? (option.votes.length / totalVotes) * 100
                                    : 0;

                                return (
                                  <motion.li
                                    key={optionIndex}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      delay: 0.1 + optionIndex * 0.1,
                                      duration: 0.1,
                                    }}
                                    whileHover={{ scale: 1.03 }}
                                    className="relative p-4 rounded-xl bg-gray-800 transition-all duration-300 shadow-lg overflow-hidden flex items-center justify-between"
                                  >
                                    {/* Option Text & Vote Count */}
                                    <div className="flex flex-col">
                                      <span className="text-white font-medium text-sm">
                                        {option.optionValue}
                                      </span>
                                      <span className="text-gray-300 text-xs">
                                        {option.votes.length} votes
                                      </span>
                                    </div>

                                    {/* Progress Bar - Slim and Elegant */}
                                    <motion.div
                                      initial={{ width: "0%" }}
                                      animate={{ width: `${votePercentage}%` }}
                                      transition={{
                                        duration: 0.8,
                                        ease: "easeOut",
                                      }}
                                      className="absolute left-0 bottom-2 h-1 bg-gradient-to-r from-[#53c97d] to-green-500 opacity-80 rounded-xl"
                                    ></motion.div>

                                    {/* Vote Button (Aligned Right) */}
                                    <motion.button
                                      whileHover={{ scale: 1.08 }}
                                      whileTap={{ scale: 0.92 }}
                                      className="px-4 py-1 text-xs rounded-full font-semibold text-white transition-all duration-300 
                        bg-gradient-to-r from-[#53c97d] to-green-600 hover:from-green-500 hover:to-green-700 shadow-md"
                                      onClick={() =>
                                        handleVote(
                                          post._id,
                                          option,
                                          session?.user?.id
                                        )
                                      }
                                    >
                                      Vote
                                    </motion.button>
                                  </motion.li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        );
                      })}
                  </div>

                  {/* Post Actions */}
                  <div className="flex gap-6 mt-4">
                    {/* Like Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(post._id, post.user_id)}
                      className={`flex items-center gap-2 transition-all duration-300 ${post.likes.some(
                        (like) => like.userId === session?.user?.id
                      )
                          ? "text-red-500"
                          : "text-[#53c97d]"
                        }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${post.likes.some(
                          (like) => like.userId === session?.user?.id
                        )
                            ? "fill-current"
                            : ""
                          }`}
                      />
                      <span>{post.likeCount || 0}</span>
                    </motion.button>

                    {/* Comment Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() =>
                        setCommentsModal({
                          isOpen: true,
                          postId: post._id,
                          userId: post.user_id,
                        })
                      }
                      className="flex items-center gap-2 text-[#53c97d] hover:text-[#53e686]/80 transition-all duration-300"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.commentCount}</span>
                    </motion.button>

                    {/* Share Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleShare(post.id)}
                      className="flex items-center gap-2 text-[#53c97d] hover:text-[#53e686]/80 transition-all duration-300"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>{post.shares || 0}</span>
                    </motion.button>
                  </div>
                </motion.article>
              ))}
              {posts.length === 0 && (
                <p className="text-gray-400 text-center py-4">No posts found.</p>
              )}
            </>
          )}
        </Suspense>
      </div>

      {/* Modals */}
      {commentsModal.isOpen && <CommentsModal />}
      {shareModal.isOpen && <ShareModal />}
    </main>
  );
};

export default PostFeed;
