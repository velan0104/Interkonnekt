"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { addCommentAsync, fetchPosts, toggleLikeAsync } from "@/Slice/postsSlice";
import { useDispatch } from "@/hooks/useDispatch";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/navigation";

// type LikeState = {
//   [key: string]: {
//     count: number;
//     liked: boolean;
//   };
// };

// type CommentsState = {
//   [key: string]: string[];
// };

type ModalState = {
  isOpen: boolean;
  postId: string | null;
};

export default function PostFeed() {
  const dispatch = useDispatch();
  const {data: session} = useSession();
  const posts = useSelector((state: RootState) => (state.posts as any).posts);
  const postStatus = useSelector((state: RootState) => (state.posts as any).status);
  const error = useSelector((state: RootState) => (state.posts as any).error);
  const router = useRouter();
  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
   // dispatch(fetchPosts());
  }, [dispatch,postStatus]);
  console.log("posts at middle: ",posts)
  
 

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [commentsModal, setCommentsModal] = useState<ModalState>({
    isOpen: false,
    postId: null,
  });
  const [shareModal, setShareModal] = useState<ModalState>({
    isOpen: false,
    postId: null,
  });
 
  const [newComment, setNewComment] = useState<string>("");
  const [likes, setLikes] = useState<{ [key: string]: { liked: boolean } }>({});

  if (postStatus === 'loading') return <p>Loading...</p>;
  if (postStatus === 'failed') return <p>Error: {error}</p>;

  const user_id = session?.user?.id;
  const email = session?.user?.email;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value); // Update local state
  };

  const handleLike = (postId: string) => {
    console.log("handleLike called")
    dispatch(toggleLikeAsync({ postId, userId: user_id }));
    setLikes((prevLikes) => ({
      ...prevLikes,
      [postId]: { liked: !prevLikes[postId]?.liked }
    }));
  }; 

  // const handleAddComment = (postId: string, content: string) => {
  //   const userId = 'user-id'; // Get userId from state or context
  //   dispatch(addCommentAsync({ postId, userId, content }));
  // };

  const handleProfileClick = (userId: string) => {
    console.log("Profile clicked: ", userId);
    router.push(`/profile/?userId=${userId}`);
  };

  const handleComment = async (postId: string, content: string) => {
    if (content.trim() !== '') {
      try {
        await dispatch(addCommentAsync({ postId, content, userId: user_id })).unwrap();
        setCommentsModal({ isOpen: false, postId: null });
        dispatch(fetchPosts());
      } catch (error) {
        console.log("Failed to post comment:", error);
      }
    }
  };
  

  const handleShare = (postId: string) => {
    setShareModal({
      isOpen: true,
      postId,
    });
  };

  

  const Dropdown: React.FC<{ postId: string }> = ({ postId }) => (
    <div className="absolute right-0 top-8 bg-[#2A2A2A] rounded-lg shadow-lg py-2 min-w-[150px]">
      <button className="w-full text-left px-4 py-2 text-white hover:bg-[#3A3A3A]">
        Delete
      </button>
      <button className="w-full text-left px-4 py-2 text-white hover:bg-[#3A3A3A]">
        Report
      </button>
      <button className="w-full text-left px-4 py-2 text-white hover:bg-[#3A3A3A]">
        Mute
      </button>
    </div>
  );

  const currentPost = posts.find((post: any) => post._id === commentsModal.postId);
const comments = currentPost?.comments || [];

  const CommentsModal: React.FC = () => {
    const [commentInput, setCommentInput] = useState(newComment); // Local state for input

    // const handleInputChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   setCommentInput(e.target.value); // Update local state
    // };
  
    const postComment = async () => {
      if (commentInput.trim() !== "") {
        await handleComment(commentsModal.postId || "", commentInput);
        setCommentInput(""); // Clear input
      }
    };
    return(
   // const [content, setContent] = useState('');
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-[500px] w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-bold">Comments</h2>
          <button
            onClick={() =>
              setCommentsModal({
                isOpen: false,
                postId: null,
              })
            }
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="max-h-[300px] overflow-y-auto mb-4">
  {comments.map((comment: any, index: number) => (
    <div key={index} className="bg-[#2A2A2A] rounded-lg p-3 mb-2">
      <p className="text-white">{comment.content}</p>
      <p className="text-gray-400 text-sm">
        {new Date(comment.createdAt).toLocaleString()}
      </p>
    </div>
  ))}
</div>
        <div className="flex gap-2">
          <input
            type="text"
           value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 bg-[#2A2A2A] rounded-lg px-4 py-2 text-white"
            placeholder="Add a comment..."
          />
          <button
           onClick={postComment}
            className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

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
  return (
    <main className=" bg-gray-900  px-4">
      <div className=" mx-auto space-y-4 h-[89vh] overflow-y-auto">
      {posts.map((post:any,index:any) => (
  <article key={index} className="bg-gray-900 rounded-xl p-4 shadow-lg">
    <div className="flex items-start justify-between">
      <div
        className="flex gap-3 cursor-pointer"
        onClick={() => handleProfileClick(post.user_id)}
      >
        <div className="flex items-center gap-3 w-20 h-16 mb-8 px-2 rounded-full">
  {post.profileImage ? (
    post.profileImage.includes("https://lh3.googleusercontent.com") ? (
      <img
        src={post.profileImage}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : ( post.profileImage && (
      <CldImage
        src={post.profileImage}
        alt="Profile Image"
        width={80}
        height={60}
        className="w-full h-full object-cover rounded-full"
      />
    )
    )
  ) : (
    <div className="w-12 h-10 rounded-full bg-gray-400 flex items-center justify-center">
      {/* Fallback for missing profile */}
      <img
  src={"data:image/png;base64,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"} // Placeholder image
  alt={`${post.newUsername || "User"} profile picture`}
  className="w-12 h-12 rounded-full"
/>
    </div>
  )}
</div>

        
        <div>
          <h3 className="font-semibold text-white">{post.name}</h3>
          <p className="text-gray-400 text-sm">@{post.newUsername}</p>
        </div>
      </div>
      <div className="relative">
        <button
          aria-label="More options"
          onClick={() =>
            setActiveDropdown(activeDropdown === post.id ? null : post.id)
          }
        >
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
        {activeDropdown === post.id && <Dropdown postId={post.id} />}
      </div>
    </div>
    <p className="text-white mt-4">{post.content}</p>
    {post.image && (
      <div className="mt-4">
        <img
          src={post.image}
          alt="Post media"
          className="w-full aspect-video object-cover rounded-xl"
        />
      </div>
    )}
    {post.poll && (
      <div className="polls">
     
        <div key={index} className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-white font-semibold">{post.poll.question}</h3>
          <ul className="mt-2">
            {post.poll.options.map((option:any, index:any) => (
              <li
                key={index}
                className="flex justify-between items-center mt-2 bg-gray-700 p-2 rounded"
              >
                <span className="text-white">{option}</span>
                <button
                 // onClick={() => handleVote(index)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Vote ({option.votes})
                </button>
              </li>
            ))}
          </ul>
        </div>
      
    </div>
    
    )}
    <div className="flex gap-6 mt-4">
      <button
       onClick={() => handleLike(post._id)}
       className={`flex items-center gap-2 ${
        post.likes.some(like => like.userId === session?.user?.id) ? "text-red-500" : "text-[#1DA1F2]"
      } hover:opacity-80`}
    >
      <Heart
        className={`w-5 h-5 ${post.likes.some(like => like.userId === session?.user?.id) ? "fill-current" : ""}`}
      />
      <span>{post.likeCount || 0}</span>
      </button>
      <button
        onClick={() => setCommentsModal({ isOpen: true, postId: post._id })}
        className="flex items-center gap-2 text-[#1DA1F2] hover:text-[#1DA1F2]/80"
      >
        <MessageCircle className="w-5 h-5" />
        <span>{post.commentCount}</span>
      </button>
      <button
        onClick={() => handleShare(post.id)}
        className="flex items-center gap-2 text-[#1DA1F2] hover:text-[#1DA1F2]/80"
      >
        <Share2 className="w-5 h-5" />
        <span>{post.shares || 0}</span>
      </button>
    </div>
  </article>
))}


       
      </div>
      {commentsModal.isOpen && <CommentsModal />}
      {shareModal.isOpen && <ShareModal />}
    </main>
  );
}
