import { useDispatch, useSelector } from "react-redux";
import { toggleFollow } from "@/Slice/FolllowSlice";
import { RootState } from "@/app/Store/store";

interface FollowButtonProps {
  userId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const dispatch = useDispatch();
  const { following } = useSelector((state: RootState) => state.follow);

  const isFollowing = following.includes(userId);

  const handleFollow = async () => {
    dispatch(toggleFollow(userId));
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
