import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getSession, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { set } from "mongoose";
import { AppDispatch } from "@/app/Store/store";
import UploadImages from "@/components/uploadImage/UploadImage";
import { CldImage } from "next-cloudinary";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Edit, Edit2, LogOut } from "lucide-react";
import { FaUserAlt } from "react-icons/fa";
import { sign } from "crypto";
import FollowButton from "../FollowButton/FollowButton";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import { fetchPosts } from "@/Slice/postsSlice";
import PostFeed from "../middle/Middle";
import Posts from "@/models/post";
import { Button } from "../ui/moving-border";

interface UserProfile {
  name: string;
  username?: string;
  email: string;
  interest?: string[];
  image?: string;
  googleImage?: string;
  createdAt: string;
}
gsap.registerPlugin(ScrollTrigger);
export default function Profile() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [interest, setInterest] = useState<string[]>([]);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingInterest, setEditingInterest] = useState(false);
  const [editingProfileImage, setEditingProfileImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [cloudinaryImage, setCloudinaryImage] = useState<string>();
  const pathname = usePathname();
  const [IscloudinaryImage, setIsCloudinaryImage] = useState(false);
  const [triggerUpload, setTriggerUpload] = useState(false);
  const [sessionImage, setSessionImage] = useState<string>("");
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [signedInUser, setIsSignedInUser] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [createdAt2, setCreatedAt2] = useState<string>("");
  const [profileAtModal, setProfileAtModal] = useState<string>("");
  const [nameAtModal, setNameAtModal] = useState<string>("");
  const [usernameAtModal, setUsernameAtModal] = useState<string>("");
  const [IscloudinaryImageAtModal, setIsCloudinaryImageAtModal] =
    useState(false);
  const [cloudinaryImageAtModal, setCloudinaryImageAtModal] =
    useState<string>();
  const [activeTab, setActiveTab] = useState("posts");
  const router = useRouter();
  const posts = useSelector((state: RootState) => (state.posts as any).posts);
  const profileRef = useRef(null);
  const statsRef = useRef(null);
  const [followed, setFollowed] = useState<boolean>(false);
  const mainContentRef = useRef(null);
  console.log("posts at profile: ", posts);
  const fetchUserData = async (userId: string) => {
    //const sessionData = await getSession();
    if (!session) return;

    const response = await fetch("/api/getUnameInterest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (data) {
      setUsername(data.username);
      setInterest(data.interest);
      setCreatedAt2(data.createdAt);
      setEmail(data.email);
      setProfileImage(data.image);

      setFollowers(data.followers);
      setFollowing(data.following);
    }

    if (session) {
      const userData: UserProfile = {
        name: session.user?.name || "",
        email: session.user?.email || "",
        username: session.user?.username || "",
        interest: session.user?.interest
          ? Array.isArray(session.user?.interest)
            ? session.user?.interest
            : session.user?.interest.split(",")
          : [],
        createdAt: session.user?.createdAt || new Date().toISOString(),
        image: session.user?.image || "",
      };
      setUser(userData);
    }
  };

  console.log("profileimage at profile: ", profileImage);
  console.log("cloudinary at profile: ", cloudinaryImage);

  const fetchUnameInterest = async (userId: string) => {
    if (!userId || userId == "") return;
    if (!session || !pathname) return;
    const response = await fetch("/api/getUnameInterest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (data) {
      setUsername(data.username);
      setInterest(data.interest);
      setCreatedAt2(data.createdAt);
      setEmail(data.email);
      setProfileImage(data.image);
      setFollowers(data.followers);
      setFollowing(data.following);
    }
  };
  const params = useSearchParams();

  useEffect(() => {
    if (!params.get("userId") && !session?.user?.id) return;

    if (params.get("userId") === session?.user?.id) {
      console.log("userId at profile2: ", params.get("userId"));
      console.log("username at profile2: ", username);
      setIsSignedInUser(true);
      fetchUserData(params.get("userId"));
    } else {
      if (params.get("userId") || session?.user?.provider == "google") {
        fetchUnameInterest(params.get("userId") || session?.user?.id);
        setIsSignedInUser(false);
        // Fetch other user data logic here
      }
    }
  }, [params, session, pathname, FollowButton]);

  const saveUsername = async () => {
    if (username.trim()) {
      const response = await fetch("/api/InsertUsername", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email: user?.email }),
      });
      if (response.ok) {
        setUser((prev) => (prev ? { ...prev, username } : null));
        setEditingUsername(false);
      } else {
        alert("Failed to update username.");
      }
    }
  };

  const saveInterest = async () => {
    if (interest.length > 0) {
      const response = await fetch("/api/InsertUsername", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest, email: user?.email }),
      });
      if (response.ok) {
        setUser((prev) => (prev ? { ...prev, interest } : null));
        setEditingInterest(false);
      } else {
        alert("Failed to update interest.");
      }
    }
  };

  const handleShowFollowing = () => {
    setShowFollowingModal(true);
  };

  const handleShowFollowers = () => {
    setShowFollowerModal(true);
  };

  const closeModals = () => {
    setShowFollowingModal(false);
    setShowFollowerModal(false);
  };

  const handleNavigateToProfile = (userId: string) => {
    router.push(`/profile/?userId=${userId}`);
    setShowFollowerModal(false);
    setShowFollowingModal(false);
  };

  function Modal({
    isOpen,
    onClose,
    title,
    data,
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: { userId: string }[];
  }) {
    if (!isOpen) return null;

    const [userDetails, setUserDetails] = useState<
      Record<string, { username: string; name: string; image: string }>
    >({});

    useEffect(() => {
      if (isOpen) {
        data.forEach(async (item) => {
          if (!userDetails[item.userId]) {
            await fetchForModal(item.userId);
          }
        });
        console.log("userDetails at modal: ", userDetails);
      }
    }, [isOpen, data, userDetails]);

    const fetchForModal = async (userId: string) => {
      try {
        const response = await fetch("/api/getUnameInterest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();

        if (data) {
          setUserDetails((prev) => ({
            ...prev,
            [userId]: {
              username: data.username,
              name: data.name,
              image: data.image,
            },
          }));
        }
      } catch (error) {
        console.error(`Failed to fetch details for userId: ${userId}`, error);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md ">
          <div className="flex justify-between items-center mb-4 ">
            {data.length < 1 ? (
              <div className="text-center text-gray-500 ">
                {/* Displaying an icon when there are no followers or following */}
                <FaUserAlt
                  className="absolute mx-auto mb-4 text-gray-400"
                  size={25}
                />
                <span className="ml-10 text-lg">No {title}...</span>
              </div>
            ) : (
              <h2 className="text-xl font-bold text-blue-600">{title}</h2>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-blue-600 focus:outline-none"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            {data.map((item, index) => {
              const userDetail = userDetails[item.userId];
              console.log("userDetail at modal: ", userDetail);

              return (
                <div
                  key={index}
                  onClick={() => {
                    handleNavigateToProfile(item.userId);
                  }}
                  className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg shadow hover:bg-gray-700"
                >
                  {/* {!userDetail?.image ? (
                   <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                   alt={userDetail?.name}
                   width={40}
                   height={40}
                   className="rounded-full"
                   />
                ) : (
                 
                 
                  userDetail.image.includes(
                    "https://lh3.googleusercontent.com"
                  ) ? (
                    <img
                      src={
                        userDetail?.image ||
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                      }
                      alt={userDetail.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <CldImage
                    src={userDetail?.image || cloudinaryImageAtModal || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                    alt={userDetail?.name}
                    width={40}
                    height={60}
                    className="rounded-full w-14 h-14"
                  />
                  )
                )
                  } */}
                  <Image
                    src={
                      userDetail?.image ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                    }
                    alt="Profile Image"
                    width={80}
                    height={60}
                    className="w-14 h-14 object-cover rounded-full border-2 border-blue-500 shadow-lg shadow-blue-600/50"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-300">
                      {userDetail?.name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{userDetail?.username || "No username available"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <p>Loading Profile Page...</p>;
  }

  return (
    <>
      <div className="bg-gray-900 absolute text-white w-full  overflow-y-auto max-w-[48rem] h-auto min-h-[40rem] sm:max-w-[47rem] md:max-w-[35rem] lg:max-w-[48rem] xl:max-w-[30.5rem] 2xl:max-w-[40.5rem] left-0 xl:left-[24rem] 2xl:left-[28rem] ">
        {/* Profile Header */}
        <div className=" py-10 px-6 flex flex-col items-center md:flex-row md:justify-between  rounded-xl border-2 border-green-400">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-8 ">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32  md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-lg">
                {!profileImage ? (
                  <img
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                    }
                    alt={username}
                    className="w-full h-full rounded-full border border-gray-700 object-cover"
                  />
                ) : profileImage &&
                  profileImage.includes("https://lh3.googleusercontent.com") ? (
                  <img
                    src={profileImage}
                    alt={username}
                    className="w-full h-full rounded-full  border border-gray-700 object-cover"
                  />
                ) : (
                  <CldImage
                    src={
                      profileImage ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
                    }
                    alt={username}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
              </div>
              {signedInUser && (
                <div
                  onClick={() => setEditingProfileImage(true)}
                  className="absolute bottom-3 right-0 bg-[#53c97d] p-2 rounded-full hover:bg-green-600 transition-colors cursor-pointer"
                >
                  <Edit2 size={20} className="text-white" />
                  <UploadImages />
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="flex-1 space-y-6">
              <span className="text-3xl md:text-4xl font-bold">
                {username || user?.username || "No Username Set"}
              </span>
              {editingUsername ? (
                <div className="flex flex-col items-center gap-2 w-full mt-3">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border rounded px-4 py-2 bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveUsername}
                      className="px-4 py-2 text-sm text-[#53c97d] bg-gray-700 rounded hover:bg-green-600 hover:text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingUsername(false)}
                      className="px-4 py-2 text-sm text-gray-400 bg-gray-700 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                signedInUser && (
                  <button
                    onClick={() => setEditingUsername(true)}
                    className="text-blue-300 hover:text-green-500 ml-2"
                  >
                    <Edit2 size={20} />
                  </button>
                )
              )}

              <p className="text-lg text-gray-200">
                Email: {email || user?.email || "Not Provided"}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">Interests:</span>
                {Array.isArray(interest) && interest.length > 0 ? (
                  interest.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-700 rounded-full"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No interests set</span>
                )}
                {signedInUser && (
                  <button
                    onClick={() => setEditingInterest(true)}
                    className="ml-2 text-blue-300 hover:text-green-500"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
                {editingInterest && (
                  <div className="flex flex-col items-center gap-2 mb-4">
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value.split(","))}
                      className="input border rounded px-4 py-2 bg-gray-700 text-white w-full "
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveInterest}
                        className="px-4 py-2 text-sm text-[#53c97d] bg-gray-700 rounded hover:bg-green-600 hover:text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingInterest(false)}
                        className="px-4 py-2 text-sm text-gray-400 bg-gray-700 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400">
                Joined:{" "}
                {new Date(
                  createdAt2 || user?.createdAt || "empty"
                ).toLocaleDateString()}
              </p>
              {signedInUser && (
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-2 bg-[#53c97d] px-6 py-2 rounded-lg hover:bg-[#53c97d] transition"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              )}
              {!signedInUser && (
                <div onClick={() => setFollowed(true)}>
                  <FollowButton
                    currentUserId={session.user?.id}
                    targetUserId={params.get("userId") || ""}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-10 bg-gray-900">
          <div className="container mx-auto grid  grid-cols-3 gap-8 px-3">
            <div
              onClick={() => setShowFollowerModal(true)}
              className="bg-gray-800 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-2xl font-bold">{followers?.length}</h2>
              <p className="text-gray-400 mr-2 sm:mr-0">Followers</p>
            </div>
            <div
              onClick={() => setShowFollowingModal(true)}
              className="bg-gray-800 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-2xl font-bold">{following?.length}</h2>
              <p className="text-gray-400">Following</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <h2 className="text-2xl font-bold">
                {/* {new Date(
                  createdAt2 || user?.createdAt || "empty"
                ).toLocaleDateString()} */}
                {posts.length}
              </h2>
              <p className="text-gray-400">Posts</p>
            </div>
          </div>
        </div>

        <Modal
          isOpen={showFollowerModal}
          onClose={() => setShowFollowerModal(false)}
          title="Followers"
          data={followers}
        />
        <Modal
          isOpen={showFollowingModal}
          onClose={() => setShowFollowingModal(false)}
          title="Following"
          data={following}
        />

        {/* Posts Section */}
        <div className="">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-semibold mb-2  ">Your Posts</h2>
            <div className="bg-gray-800  rounded-lg shadow-md">
              <PostFeed userId={params.get("userId") || ""} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
