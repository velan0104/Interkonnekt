import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "@/Slice/FolllowSlice";
import { RootState, AppDispatch } from "@/app/Store/store";
import axios from "axios";

interface FollowButtonProps {
  currentUserId: string;
  targetUserId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ currentUserId, targetUserId }) => {
  console.log("FollowButton called");
  console.log("Current user ID at FollowButton:", currentUserId);
  console.log("Target user ID at FollowButton:", targetUserId);
  const dispatch: AppDispatch = useDispatch();
  const { following, status } = useSelector((state: RootState) => state.follow);
  console.log("Following at FollowButton:", following);
  const isFollowing = following.includes(targetUserId);

  const handleFollow = async() => {
    if (isFollowing) {
      dispatch(unfollowUser({ currentUserId, targetUserId }));
    } else {
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
