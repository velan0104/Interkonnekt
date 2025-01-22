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
  const [profileImage, setProfileImage] = useState("");
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

  const profileRef = useRef(null);
  const statsRef = useRef(null);
  const mainContentRef = useRef(null);

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
      if (
        data.image &&
        data.image.includes("https://lh3.googleusercontent.com")
      ) {
        setIsCloudinaryImage(false);
        setCloudinaryImage("");
        setProfileImage(data.image);
      } else {
        setIsCloudinaryImage(true);
        setCloudinaryImage(data.image);
        setProfileImage("");
      }
      setFollowers(data.followers);
      setFollowing(data.following);
      console.log("followers at profile2: ", data.followers);
      console.log("following at profile2: ", data.following);
      console.log("image at profile2: ", data.image);
      console.log("username at profile2: ", data.username);
      console.log("interest at profile2: ", data.interest);
      console.log("email at profile2: ", data.email);
      console.log("createdAt at profile2: ", data.createdAt);
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
      if (
        data.image &&
        data.image.includes("https://lh3.googleusercontent.com")
      ) {
        setIsCloudinaryImage(false);
        setProfileImage(data.image);
      } else {
        setIsCloudinaryImage(true);
        setCloudinaryImage(data.image);
      }
      console.log("followers at profile2: ", data.followers);
      console.log("following at profile2: ", data.following);
      console.log("image at profile2: ", data.image);
      console.log("username at profile2: ", data.username);
      console.log("interest at profile2: ", data.interest);
      console.log("email at profile2: ", data.email);
      console.log("createdAt at profile2: ", data.createdAt);
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
        console.log("userId at profile2 at else: ", params.get("userId"));
        console.log("username at profile2: ", username);
        fetchUnameInterest(params.get("userId") || session?.user?.id);
        setIsSignedInUser(false);
        // Fetch other user data logic here
      }
    }
  }, [params, session, pathname]);

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
    console.log("data at modal: ", data);
    if (!isOpen) return null;

    const [userDetails, setUserDetails] = useState<
      Record<string, { username: string; name: string; image: string }>
    >({});

    // const[modalData,setModalData] = useState(data);
    // console.log("modalData: ",modalData)

    // {followers.map((user,index) => {
    //   <div>
    //  <p className="text-black" key={index}>{user}</p>
    //   </div>
    // })}

    useEffect(() => {
      if (isOpen) {
        console.log("Modal opened with data: ", data);

        data.forEach(async (item) => {
          if (!userDetails[item.userId]) {
            console.log("Fetching details for userId: ", item.userId);
            await fetchForModal(item.userId);
          }
        });
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
    console.log("userDetails at modal: ", userDetails);

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
                  {userDetail?.image &&
                  userDetail.image.includes(
                    "https://lh3.googleusercontent.com"
                  ) ? (
                    <img
                      src={
                        userDetail?.image ||
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAY1BMVEVVYIDn7O3///9TXn/r8PBPW31BTnRLV3pGU3fIztV+h53u8/PW3OBfaYddZ4b09PaOlqikqbh7gppmcIzo6e25vsiGjaKZnrBxepPDxs+ytsPe4Oalrbnh5uiaorLJy9XT1d0+l9ETAAAHqklEQVR4nMWciY6rOgyGQ0NIKEtatrJ0evr+T3kDdKUsv9PCtTTS0dEMfDiO4zh22O4b0Vlzzc+nokzjmLE4TsvidM6vTaa/eiyzB/KPRRkJpaQU3Ahj5ocLKZUSUVkcfXswO6isOnHPMzDMsHxKB+d5/FRlW0FldRIpOUozYJMqSmoLLipUlpeeAoAeYMoryVw0qKaIlMCJehEqKpq1oHSeeoKgpFcuL80Jdg9D6TqVZCW9YMm0hrFAKJ3Hnp2SHsK9GMXCoP6lluP2jiXTfz+DaopvtfTA8hLE5Jeh9JF/YUtDEfy4PIaLUGGqfofUikqv30L9VE29CH5ZUNY8VLb3fo3UitrP+/hZKF/8XE29CDE7DeegjsiqaydcHq2g9OHHFv4u6jBtWJNQupRrMjEmy0mqKagmXcmcniLSKUc6AZVFK+upo4omJuE4VBgT9NTG5VKI/kdSFkkRj/vRUagMZeJCeSpNDuc6z6sqz+vzIUnNf6Fkgo3qagyqiTAmEyMVdegEQeAGbifmH0HghHWBxl4iGrOrESiN2bj09n5oeJwPMWRhtVeQVcoUgtIlwiTZxRkDeoL9XWIES4x4hk+oA/AorvbhDNGNK9wj7lcelqGOwIMEq+a09NRWxQCtq48VZwj1D9CTiPxgGamVwEfmjByuzgOoDJjMZsYAaropC5nJXGRzUDoBHhH7MJOh8mPgM/dzUBfAoDx07G4jWAFxonechroCjlgWJCZDVSDTOZyCQrwmj0Iak/EMETCAqZ6AQryBvBAM6kZ1AVT15hdeoBpkFfX+6FB/yO6DN6NQBeBSREK0qFYCZOESxRjUP+R7ZE1WlIGqkeXG+/cJpVMoBvLpTI7jI0/mT1t/QNXIks7TxgYqhD5Y5kMoDTheA1XaMDlOCT081gOoGtqfi72FSZn5t4fCRi9/hwItShR2UMjEfrGqG1SO7ajWhXpY1Q0K3HquO3xmsXmFasCMz8pQzGteoED1rg51c+sdVBZhf7M6FO838h0UtAxsAcVU/YCCdnqbQInyDpXBic3VoZiX3aDg0dsASuU3qATO3qwPxZMeCp57W0Cxdv4ZqApPuG4ApaoO6oRnEjeAkqcOiuMJwQ2gOG+hNOGkYwMo5mkD5VOgEjsoIEXxhPIN1JGQnJaU3MYLlE95x9FAoRFC+/u1xa6vlQDalvRiIgWmoaC+E17+2TE5zh8Wbvdv0YzgOuXFUlFGVUg+4QYVZazBjwhUZWVRrbg57KE5b9gV9+eenZl3UIQ5rq4M/4TNoHJ2xufFRlDyzAgr31ZQJ0ZwUxtBiYLhbmorKJ4w3KttBpWyGP7lzaBiBuWlNoWi6Gk7KJJsB0UYPpXbL8iEhcMMH2EAxcEe6kCIPVOKS2DR8hntuLghHiC1LoHgPJk42UaeyMH04y0lZZkxpm5z4OC4LpZ7vkMVlAW5/QOL4NN1KAbVLciE0IW1Z/9kqOAsaMU8JnShzFUj3pU6gAG1Xs0EeYRwuBV5JKqK7stNOEzYOLQiEqKiXJpB9RsHwharF+L4ISfI71Bmi0XYjHZC3PwFtInE+s0oZdveU5GgXMLa2ku7bSclOFpROWH8sJPaN+kSHNTZwUmmTjQOdksFUZJmnUh8907JtjygNDG92IlIcasiW9QtvUhJxPYCW5VLtVf2SMQSUta9CDBP5YZkpEfKmuw+UV8FVW4MhN+S+4RjkLsIJAR1Laz8cQyyIwYKDFsBXd+mreVxYIQfrT0ESMm6FoP3crSGH0I+RS3uAZECsw95HkJajJ/Zbs1DuaFV7Xg3eveDbfLoy2UoC4t6PdgmRwprQb2WAMDFEmtDvRVL0E19FajezB9QFdUsV4EaFOCApUrrQg1LlXY50arWgBoWde000SusAMWjYfkbWtZ1l2XnSfcyH4WC1AkolnbK5FhKjJRU7q4kq1oM1P+oXsZsGD6hSG6ds6Xg073QoMbLdHcNYQehFvMcRKPiEwXNlOogIEoPkEry51fWu3Eo2NZVChWAE7oW7wvMCFSDPUAcsKJ09wK35vLrJNTuvDwDuVdW6GbU9fceVqA703ix2y0VpXBZ1khz0Z3Kve6BJqP5FpVdNn6pxh1J8TOxncB1/GRJWwvNPMaFzjxAxpfMImMdhMm8tuSwH/KjQWzSLwhVhISR+9DW5BAsN4hN5TuE2IfWx0VGW9f91ExEWul2Ovmk4l5aOdaHfR2WO6GtsXbksZ7RYVs0l2luN3ADbRWfvfJge6aZgu/V6dJMOfuRe8UytjVovIUbWdsw9EnVNYf+AqnDGmhLxKOt5OPN0fdWQd5Oua8H7g3rVVsiDkdfP9FGrlPZGdM3U24KK/APvbZkNNFyP9Vwnxlrl7H/3ZSbwnL8UnFj48SGeyN777IKUocV1LEqJ189c4lDtRJRj3U9WVziYOTn5vQqcxeWzF4Mov8fpqV7XVYyKnf+rUuXzawyhMHCS5fvCvo90+IrgVuVfqysJTVhUD+1rAVrIkD9Dgu7qgu90+wn3gG91Ay//e1rLPz6N8o9efqLQXQpNzESbxS0LeqivYV89yJdXSQl2UERuehEllAtF2T2geWVnvaXjO504E6qzHVtgb6EurNp7d7p2uuC9HdXsbbyH8oqgTWWktC8AAAAAElFTkSuQmCC"
                      }
                      alt={userDetail.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <CldImage
                      src={
                        cloudinaryImageAtModal ||
                        "data:image/png;base64,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"
                      }
                      alt={userDetail?.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
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
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="bg-gray-900 text-white h-[89vh] overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-800 py-12 flex justify-center">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-8 ">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-md">
                {IscloudinaryImage ? (
                  <CldImage
                    src={
                      cloudinaryImage ||
                      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAY1BMVEVVYIDn7O3///9TXn/r8PBPW31BTnRLV3pGU3fIztV+h53u8/PW3OBfaYddZ4b09PaOlqikqbh7gppmcIzo6e25vsiGjaKZnrBxepPDxs+ytsPe4Oalrbnh5uiaorLJy9XT1d0+l9ETAAAHqklEQVR4nMWciY6rOgyGQ0NIKEtatrJ0evr+T3kDdKUsv9PCtTTS0dEMfDiO4zh22O4b0Vlzzc+nokzjmLE4TsvidM6vTaa/eiyzB/KPRRkJpaQU3Ahj5ocLKZUSUVkcfXswO6isOnHPMzDMsHxKB+d5/FRlW0FldRIpOUozYJMqSmoLLipUlpeeAoAeYMoryVw0qKaIlMCJehEqKpq1oHSeeoKgpFcuL80Jdg9D6TqVZCW9YMm0hrFAKJ3Hnp2SHsK9GMXCoP6lluP2jiXTfz+DaopvtfTA8hLE5Jeh9JF/YUtDEfy4PIaLUGGqfofUikqv30L9VE29CH5ZUNY8VLb3fo3UitrP+/hZKF/8XE29CDE7DeegjsiqaydcHq2g9OHHFv4u6jBtWJNQupRrMjEmy0mqKagmXcmcniLSKUc6AZVFK+upo4omJuE4VBgT9NTG5VKI/kdSFkkRj/vRUagMZeJCeSpNDuc6z6sqz+vzIUnNf6Fkgo3qagyqiTAmEyMVdegEQeAGbifmH0HghHWBxl4iGrOrESiN2bj09n5oeJwPMWRhtVeQVcoUgtIlwiTZxRkDeoL9XWIES4x4hk+oA/AorvbhDNGNK9wj7lcelqGOwIMEq+a09NRWxQCtq48VZwj1D9CTiPxgGamVwEfmjByuzgOoDJjMZsYAaropC5nJXGRzUDoBHhH7MJOh8mPgM/dzUBfAoDx07G4jWAFxonechroCjlgWJCZDVSDTOZyCQrwmj0Iak/EMETCAqZ6AQryBvBAM6kZ1AVT15hdeoBpkFfX+6FB/yO6DN6NQBeBSREK0qFYCZOESxRjUP+R7ZE1WlIGqkeXG+/cJpVMoBvLpTI7jI0/mT1t/QNXIks7TxgYqhD5Y5kMoDTheA1XaMDlOCT081gOoGtqfi72FSZn5t4fCRi9/hwItShR2UMjEfrGqG1SO7ajWhXpY1Q0K3HquO3xmsXmFasCMz8pQzGteoED1rg51c+sdVBZhf7M6FO838h0UtAxsAcVU/YCCdnqbQInyDpXBic3VoZiX3aDg0dsASuU3qATO3qwPxZMeCp57W0Cxdv4ZqApPuG4ApaoO6oRnEjeAkqcOiuMJwQ2gOG+hNOGkYwMo5mkD5VOgEjsoIEXxhPIN1JGQnJaU3MYLlE95x9FAoRFC+/u1xa6vlQDalvRiIgWmoaC+E17+2TE5zh8Wbvdv0YzgOuXFUlFGVUg+4QYVZazBjwhUZWVRrbg57KE5b9gV9+eenZl3UIQ5rq4M/4TNoHJ2xufFRlDyzAgr31ZQJ0ZwUxtBiYLhbmorKJ4w3KttBpWyGP7lzaBiBuWlNoWi6Gk7KJJsB0UYPpXbL8iEhcMMH2EAxcEe6kCIPVOKS2DR8hntuLghHiC1LoHgPJk42UaeyMH04y0lZZkxpm5z4OC4LpZ7vkMVlAW5/QOL4NN1KAbVLciE0IW1Z/9kqOAsaMU8JnShzFUj3pU6gAG1Xs0EeYRwuBV5JKqK7stNOEzYOLQiEqKiXJpB9RsHwharF+L4ISfI71Bmi0XYjHZC3PwFtInE+s0oZdveU5GgXMLa2ku7bSclOFpROWH8sJPaN+kSHNTZwUmmTjQOdksFUZJmnUh8907JtjygNDG92IlIcasiW9QtvUhJxPYCW5VLtVf2SMQSUta9CDBP5YZkpEfKmuw+UV8FVW4MhN+S+4RjkLsIJAR1Laz8cQyyIwYKDFsBXd+mreVxYIQfrT0ESMm6FoP3crSGH0I+RS3uAZECsw95HkJajJ/Zbs1DuaFV7Xg3eveDbfLoy2UoC4t6PdgmRwprQb2WAMDFEmtDvRVL0E19FajezB9QFdUsV4EaFOCApUrrQg1LlXY50arWgBoWde000SusAMWjYfkbWtZ1l2XnSfcyH4WC1AkolnbK5FhKjJRU7q4kq1oM1P+oXsZsGD6hSG6ds6Xg073QoMbLdHcNYQehFvMcRKPiEwXNlOogIEoPkEry51fWu3Eo2NZVChWAE7oW7wvMCFSDPUAcsKJ09wK35vLrJNTuvDwDuVdW6GbU9fceVqA703ix2y0VpXBZ1khz0Z3Kve6BJqP5FpVdNn6pxh1J8TOxncB1/GRJWwvNPMaFzjxAxpfMImMdhMm8tuSwH/KjQWzSLwhVhISR+9DW5BAsN4hN5TuE2IfWx0VGW9f91ExEWul2Ovmk4l5aOdaHfR2WO6GtsXbksZ7RYVs0l2luN3ADbRWfvfJge6aZgu/V6dJMOfuRe8UytjVovIUbWdsw9EnVNYf+AqnDGmhLxKOt5OPN0fdWQd5Oua8H7g3rVVsiDkdfP9FGrlPZGdM3U24KK/APvbZkNNFyP9Vwnxlrl7H/3ZSbwnL8UnFj48SGeyN777IKUocV1LEqJ189c4lDtRJRj3U9WVziYOTn5vQqcxeWzF4Mov8fpqV7XVYyKnf+rUuXzawyhMHCS5fvCvo90+IrgVuVfqysJTVhUD+1rAVrIkD9Dgu7qgu90+wn3gG91Ay//e1rLPz6N8o9efqLQXQpNzESbxS0LeqivYV89yJdXSQl2UERuehEllAtF2T2geWVnvaXjO504E6qzHVtgb6EurNp7d7p2uuC9HdXsbbyH8oqgTWWktC8AAAAAElFTkSuQmCC"
                    }
                    alt="Profile Image"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  (profileImage || user?.image) && (
                    <img
                      src={
                        profileImage ||
                        user?.image ||
                        "data:image/png;base64,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"
                      }
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-[gradient-to-r from-blue-400 to-purple-400 ]"
                    />
                  )
                )}
              </div>
              {signedInUser && (
                <div
                  onClick={() => setEditingProfileImage(true)}
                  className="absolute bottom-3 right-3 bg-blue-700 p-2 rounded-full hover:bg-blue-800 transition-colors cursor-pointer"
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
                <div className="flex flex-col items-center gap-2 w-full">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border rounded px-4 py-2 bg-gray-700 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveUsername}
                      className="px-4 py-2 text-sm text-blue-600 bg-gray-700 rounded hover:bg-blue-600 hover:text-white"
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
                    className="text-blue-300 hover:text-blue-500 ml-2"
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
                    className="ml-2 text-blue-300 hover:text-blue-500"
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
                        className="px-4 py-2 text-sm text-blue-600 bg-gray-700 rounded hover:bg-blue-600 hover:text-white"
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
                  className="inline-flex items-center gap-2 bg-blue-700 px-6 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              )}
              {!signedInUser && (
                <FollowButton
                  currentUserId={session.user?.id}
                  targetUserId={params.get("userId") || ""}
                />
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-10 bg-gray-900">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              onClick={() => setShowFollowerModal(true)}
              className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-2xl font-bold">{followers?.length}</h2>
              <p className="text-gray-400">Followers</p>
            </div>
            <div
              onClick={() => setShowFollowingModal(true)}
              className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-2xl font-bold">{following?.length}</h2>
              <p className="text-gray-400">Following</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold">
                {new Date(
                  createdAt2 || user?.createdAt || "empty"
                ).toLocaleDateString()}
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
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <PostFeed userId={params.get("userId") || ""} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
