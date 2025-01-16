import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "@/Slice/FolllowSlice";
import { RootState, AppDispatch } from "@/app/Store/store";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Activity, addActivity } from "@/Slice/activitiesSlice";

interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ currentUserId, targetUserId }) => {
  console.log("FollowButton called");
  console.log("Current user ID at FollowButton:", currentUserId);
  const { data: session } = useSession();
  
  const dispatch: AppDispatch = useDispatch();
  const { following, status } = useSelector((state: RootState) => state.follow);
  console.log("Following at FollowButton:", following);
  const isFollowing = following.includes(targetUserId);

  const handleFollow = async() => {
    if (isFollowing) {
      dispatch(unfollowUser({ currentUserId, targetUserId }));
    } else {
       const newActivity: Activity = {
                id: targetUserId,
                //post_id: postId,
                type: "follow",
                user: {
                  name: session?.user?.name || '',
                  avatar: session?.user?.image || ''
                },
                text: 'followed you',
                timestamp: new Date().toISOString()
              };
              console.log("new activity: ",newActivity)
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
