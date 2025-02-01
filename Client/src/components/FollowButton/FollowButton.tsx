import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "@/Slice/FolllowSlice";
import { RootState, AppDispatch } from "@/app/Store/store";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Activity, addActivity } from "@/Slice/activitiesSlice";
import { useEffect, useState } from "react";

interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ currentUserId, targetUserId }) => {
  console.log("FollowButton called");
  console.log("Current user ID at FollowButton:", currentUserId);
  console.log("Target user ID at FollowButton:", targetUserId);
  const { data: session } = useSession();
  
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((state: RootState) => (state.posts as any).posts);
  const { following, status } = useSelector((state: RootState) => state.follow);
  const [image,setImage] = useState("");
  console.log("Following at FollowButton:", following);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  useEffect(() => {
    setIsFollowing(following.includes(targetUserId));
  }, [following]);
  console.log("isFollowing at FollowButton:", isFollowing);
  
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
  },[dispatch])

  const handleFollow = async() => {
   
    if (isFollowing) {
      dispatch(unfollowUser({ currentUserId, targetUserId }));
    } else {
      
    console.log("image valie: ",image);
    console.log("activity creating")
       const newActivity: Activity = {
                id: targetUserId,
                //post_id: postId,
                type: "follow",
                user: {
                  name: session?.user?.name || '',
                  avatar: image || session?.user?.image || ''
                },
                text: 'followed you',
                timestamp: new Date().toISOString()
              };
              console.log("new activity at follow button: ",newActivity)
              dispatch(addActivity(newActivity));
      dispatch(followUser({ currentUserId, targetUserId }));
    }
  };

  return (
    <button
      onClick={handleFollow}
      className={`px-4 py-2 text-white rounded ${
        isFollowing ? "bg-red-500" : "bg-blue-500"
      }`}  
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
