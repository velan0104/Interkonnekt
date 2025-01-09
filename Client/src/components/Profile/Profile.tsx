import { useState, useEffect } from "react";
import Image from "next/image";
import { getSession, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { set } from "mongoose";

import UploadImages from "@/components/uploadImage/UploadImage";
import { CldImage } from "next-cloudinary";
import { usePathname, useSearchParams } from "next/navigation";
import { Edit2, LogOut } from "lucide-react";
import { sign } from "crypto";

interface UserProfile {
  name: string;
  username?: string;
  email: string;
  interest?: [string];
  image?: string;
  googleImage?: string;
  createdAt: string;
}

export default function Profile() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [interest, setInterest] = useState([]);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingInterest, setEditingInterest] = useState(false);
  const [editingProfileImage, setEditingProfileImage] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [cloudinaryImage, setCloudinaryImage] = useState<string>();
  const pathname = usePathname();
  const [IscloudinaryImage, setIsCloudinaryImage] = useState(false);
  const [triggerUpload, setTriggerUpload] = useState(false);
  const [sessionImage,setSessionImage] = useState<string>("");
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [signedInUser, setIsSignedInUser] = useState(false);
  const [email,setEmail] = useState<string>("");
  const [createdAt2,setCreatedAt2] = useState<string>("");
  // const params = useSearchParams();
  // useEffect(()=>{
    
  // //  const userId = params.get("userId");
  // console.log("userId at profile3: ",userId)
  // },[session,pathname]);
   
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const session = await getSession();
  //     if (session) {
  //       const userData: UserProfile = {
  //         name: session.user?.name || "",
  //         email: session.user?.email || "",
  //         username: session.user?.username || "",
  //         interest: Array.isArray(session.user?.interest)
  //       ? session.user?.interest
  //       : session.user?.interest
  //       ? session.user?.interest.split(",")
  //       : [],
  //         createdAt: session.user?.createdAt || new Date().toISOString(),
  //         image: session.user?.image || "",
  //       };
  //       setUser(userData);
  //       setUsername(userData.username || "");
  //       setInterest(userData.interest || []);
  //       setSessionImage(userData.image || "");


  //     }
  //   };
  //   fetchUser();
  //   gsap.from(".profile-card", { opacity: 0, y: 50, duration: 1 });
  // }, []);


  // useEffect(() => {
  //   if(userId == session?.user?.id)
  //   {
  //     console.log("userId at profile2: ",userId)
  //     setSignedInUser(true);
  //     const fetchUser = async () => {
  //     //  const session = await getSession();
  //       if (session) {
  //         const userData: UserProfile = {
  //           name: session.user?.name || "",
  //           email: session.user?.email || "",
  //           username: session.user?.username || "",
  //           interest: Array.isArray(session.user?.interest)
  //         ? session.user?.interest
  //         : session.user?.interest
  //         ? session.user?.interest.split(",")
  //         : [],
  //           createdAt: session.user?.createdAt || new Date().toISOString(),
  //           image: session.user?.image || "",
  //         };
  //         setUser(userData);
  //         setUsername(userData.username || "");
  //         setInterest(userData.interest || []);
  //         setSessionImage(userData.image || "");
  //         setEmail(userData.email || "");
  //         setCreatedAt2(userData.createdAt || "");
  
  //       }
  //     };
  //     //fetchUser();
  //   }else{
  //      console.log("userId at profile2 in not signedin user: ",userId)
  //     setSignedInUser(false);
  //     const fetchUnameInterest = async () => {
  //       const response = await fetch("/api/getUnameInterest", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ userId: session?.user?.email }),
  //       })
  //       const data = await response.json();
  //       if (data) {
  //         setUsername(data.username);
  //         setInterest(Array.isArray(data.interest)
  //         ? data.interest
  //         : data.interest
  //         ? data.interest.split(",")
  //         : []);
  //         setEmail(data.email);
  //         setCreatedAt2(data.createdAt);
  //         if ( data.image && data.image.includes("https://lh3.googleusercontent.com")) {
  //           setProfileImage(data.image);
  //         } else {
  //           setCloudinaryImage(data.image)
  //         }
  //       }
  
  
  //       setEditing(!data.username || !data.interest);
  
  //     }
  //    // fetchUnameInterest();
  //   }
  // },[pathname])
  // // console.log("userId at profile2: ",userId)
  // console.log("signedInUser: ",signedInUser)
 

  const fetchUserData = async (userId:string) => {
    //const sessionData = await getSession();
    if(!session) return;
   

    const response = await fetch("/api/getUnameInterest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( {userId} ),
    });
    const data = await response.json();
    if (data) {
      setUsername(data.username);
      setInterest(data.interest);
      setCreatedAt2(data.createdAt);
      setEmail(data.email );
      setProfileImage(data.image);
      if (data.image &&  data.image.includes("https://lh3.googleusercontent.com")){
        setIsCloudinaryImage(false);
        setProfileImage(data.image);
      }else{
        setIsCloudinaryImage(true);
        setCloudinaryImage(data.image);
      }
      console.log("image at profile2: ",data.image)
      console.log("username at profile2: ",data.username)
      console.log("interest at profile2: ",data.interest)
      console.log("email at profile2: ",data.email)
      console.log("createdAt at profile2: ",data.createdAt)
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

  const fetchUnameInterest = async (userId:string) => {
    if(!userId || userId == "") return;
    if (!session || !pathname) return;
    const response = await fetch("/api/getUnameInterest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify( {userId} ),
    });
    const data = await response.json();
    if (data) {
      setUsername(data.username);
      setInterest(data.interest);
      setCreatedAt2(data.createdAt);
      setEmail(data.email );
      setProfileImage(data.image);
      if (data.image &&  data.image.includes("https://lh3.googleusercontent.com")){
        setIsCloudinaryImage(false);
        setProfileImage(data.image);
      }else{
        setIsCloudinaryImage(true);
        setCloudinaryImage(data.image);
      }
      console.log("image at profile2: ",data.image)
      console.log("username at profile2: ",data.username)
      console.log("interest at profile2: ",data.interest)
      console.log("email at profile2: ",data.email)
      console.log("createdAt at profile2: ",data.createdAt)
    }
  }
  const params = useSearchParams();

  useEffect( () => {
    
    if(!params.get("userId") && !session?.user?.id) return;
   

    if (params.get("userId") === session?.user?.id) {
      console.log("userId at profile2: ",params.get("userId"))
      console.log("username at profile2: ",username)
      setIsSignedInUser(true);
      fetchUserData(params.get("userId"));
    } else {
      if(params.get("userId")|| session?.user?.provider == "google"){
      console.log("userId at profile2 at else: ",params.get("userId"))
      console.log("username at profile2: ",username)
      fetchUnameInterest(params.get("userId") || session?.user?.id);
      setIsSignedInUser(false);
      // Fetch other user data logic here
      }
      };

      
    
  

 

    
  }, [params,session,pathname]);


  // useEffect(() => {
  //   if (!user?.email) return;
  //  // console.log("useEffect called")
  //  if(signedInUser){
  //   const fetchUnameInterest = async () => {
  //     const response = await fetch("/api/getUnameInterest", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userId: userId }),
  //     })
  //     const data = await response.json();
  //     if (data) {
  //       setUsername(data.username);
  //       setInterest(Array.isArray(data.interest)
  //       ? data.interest
  //       : data.interest
  //       ? data.interest.split(",")
  //       : []);
  //       setCreatedAt2(data.createdAt);
  //       setEmail(data.email);
  //       if ( data.image && data.image.includes("https://lh3.googleusercontent.com")) {
  //         setProfileImage(data.image);
  //       } else {
  //         setCloudinaryImage(data.image)
  //       }
  //     }


  //     setEditing(!data.username || !data.interest);

  //   }
  //   fetchUnameInterest();
  // }
  // }, [session, pathname]);

  // useEffect(() => {
  //   const fetchFollow = async () => {
  //     const session = await getSession();
  //     if (session) {
  //       // Fetch user details
  //       const response = await fetch(`/api/getUserDetails?email=${session?.user?.email}`);
  // const data = await response.json();
  // // setUser(data.user);
  // setFollowing(data.following);
  //     }
  //   };
  //   fetchFollow();
   
  // }, []);

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








  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center pb-16 min-h-screen bg-gray-900 text-white ">
      <motion.div
        className="profile-card bg-gray-800 border border-gray-500 rounded-2xl shadow-lg p-8 w-[95%] max-w-xl relative"
        style={{ transform: "translateY(-50px)" }} // Moves the card upwards
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center ">
          {/* Profile Image */}
          <div className="relative w-40 h-40 mb-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full p-[2px]">
            {IscloudinaryImage ? (
              <CldImage
                src={cloudinaryImage || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAY1BMVEVVYIDn7O3///9TXn/r8PBPW31BTnRLV3pGU3fIztV+h53u8/PW3OBfaYddZ4b09PaOlqikqbh7gppmcIzo6e25vsiGjaKZnrBxepPDxs+ytsPe4Oalrbnh5uiaorLJy9XT1d0+l9ETAAAHqklEQVR4nMWciY6rOgyGQ0NIKEtatrJ0evr+T3kDdKUsv9PCtTTS0dEMfDiO4zh22O4b0Vlzzc+nokzjmLE4TsvidM6vTaa/eiyzB/KPRRkJpaQU3Ahj5ocLKZUSUVkcfXswO6isOnHPMzDMsHxKB+d5/FRlW0FldRIpOUozYJMqSmoLLipUlpeeAoAeYMoryVw0qKaIlMCJehEqKpq1oHSeeoKgpFcuL80Jdg9D6TqVZCW9YMm0hrFAKJ3Hnp2SHsK9GMXCoP6lluP2jiXTfz+DaopvtfTA8hLE5Jeh9JF/YUtDEfy4PIaLUGGqfofUikqv30L9VE29CH5ZUNY8VLb3fo3UitrP+/hZKF/8XE29CDE7DeegjsiqaydcHq2g9OHHFv4u6jBtWJNQupRrMjEmy0mqKagmXcmcniLSKUc6AZVFK+upo4omJuE4VBgT9NTG5VKI/kdSFkkRj/vRUagMZeJCeSpNDuc6z6sqz+vzIUnNf6Fkgo3qagyqiTAmEyMVdegEQeAGbifmH0HghHWBxl4iGrOrESiN2bj09n5oeJwPMWRhtVeQVcoUgtIlwiTZxRkDeoL9XWIES4x4hk+oA/AorvbhDNGNK9wj7lcelqGOwIMEq+a09NRWxQCtq48VZwj1D9CTiPxgGamVwEfmjByuzgOoDJjMZsYAaropC5nJXGRzUDoBHhH7MJOh8mPgM/dzUBfAoDx07G4jWAFxonechroCjlgWJCZDVSDTOZyCQrwmj0Iak/EMETCAqZ6AQryBvBAM6kZ1AVT15hdeoBpkFfX+6FB/yO6DN6NQBeBSREK0qFYCZOESxRjUP+R7ZE1WlIGqkeXG+/cJpVMoBvLpTI7jI0/mT1t/QNXIks7TxgYqhD5Y5kMoDTheA1XaMDlOCT081gOoGtqfi72FSZn5t4fCRi9/hwItShR2UMjEfrGqG1SO7ajWhXpY1Q0K3HquO3xmsXmFasCMz8pQzGteoED1rg51c+sdVBZhf7M6FO838h0UtAxsAcVU/YCCdnqbQInyDpXBic3VoZiX3aDg0dsASuU3qATO3qwPxZMeCp57W0Cxdv4ZqApPuG4ApaoO6oRnEjeAkqcOiuMJwQ2gOG+hNOGkYwMo5mkD5VOgEjsoIEXxhPIN1JGQnJaU3MYLlE95x9FAoRFC+/u1xa6vlQDalvRiIgWmoaC+E17+2TE5zh8Wbvdv0YzgOuXFUlFGVUg+4QYVZazBjwhUZWVRrbg57KE5b9gV9+eenZl3UIQ5rq4M/4TNoHJ2xufFRlDyzAgr31ZQJ0ZwUxtBiYLhbmorKJ4w3KttBpWyGP7lzaBiBuWlNoWi6Gk7KJJsB0UYPpXbL8iEhcMMH2EAxcEe6kCIPVOKS2DR8hntuLghHiC1LoHgPJk42UaeyMH04y0lZZkxpm5z4OC4LpZ7vkMVlAW5/QOL4NN1KAbVLciE0IW1Z/9kqOAsaMU8JnShzFUj3pU6gAG1Xs0EeYRwuBV5JKqK7stNOEzYOLQiEqKiXJpB9RsHwharF+L4ISfI71Bmi0XYjHZC3PwFtInE+s0oZdveU5GgXMLa2ku7bSclOFpROWH8sJPaN+kSHNTZwUmmTjQOdksFUZJmnUh8907JtjygNDG92IlIcasiW9QtvUhJxPYCW5VLtVf2SMQSUta9CDBP5YZkpEfKmuw+UV8FVW4MhN+S+4RjkLsIJAR1Laz8cQyyIwYKDFsBXd+mreVxYIQfrT0ESMm6FoP3crSGH0I+RS3uAZECsw95HkJajJ/Zbs1DuaFV7Xg3eveDbfLoy2UoC4t6PdgmRwprQb2WAMDFEmtDvRVL0E19FajezB9QFdUsV4EaFOCApUrrQg1LlXY50arWgBoWde000SusAMWjYfkbWtZ1l2XnSfcyH4WC1AkolnbK5FhKjJRU7q4kq1oM1P+oXsZsGD6hSG6ds6Xg073QoMbLdHcNYQehFvMcRKPiEwXNlOogIEoPkEry51fWu3Eo2NZVChWAE7oW7wvMCFSDPUAcsKJ09wK35vLrJNTuvDwDuVdW6GbU9fceVqA703ix2y0VpXBZ1khz0Z3Kve6BJqP5FpVdNn6pxh1J8TOxncB1/GRJWwvNPMaFzjxAxpfMImMdhMm8tuSwH/KjQWzSLwhVhISR+9DW5BAsN4hN5TuE2IfWx0VGW9f91ExEWul2Ovmk4l5aOdaHfR2WO6GtsXbksZ7RYVs0l2luN3ADbRWfvfJge6aZgu/V6dJMOfuRe8UytjVovIUbWdsw9EnVNYf+AqnDGmhLxKOt5OPN0fdWQd5Oua8H7g3rVVsiDkdfP9FGrlPZGdM3U24KK/APvbZkNNFyP9Vwnxlrl7H/3ZSbwnL8UnFj48SGeyN777IKUocV1LEqJ189c4lDtRJRj3U9WVziYOTn5vQqcxeWzF4Mov8fpqV7XVYyKnf+rUuXzawyhMHCS5fvCvo90+IrgVuVfqysJTVhUD+1rAVrIkD9Dgu7qgu90+wn3gG91Ay//e1rLPz6N8o9efqLQXQpNzESbxS0LeqivYV89yJdXSQl2UERuehEllAtF2T2geWVnvaXjO504E6qzHVtgb6EurNp7d7p2uuC9HdXsbbyH8oqgTWWktC8AAAAAElFTkSuQmCC"}
                alt="Profile Image"
                width={128}
                height={128}
                 className="w-full h-full object-cover rounded-full"
              />
            ) : ( profileImage || user?.image) && (
              <img
                src={profileImage || user?.image || "data:image/png;base64,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"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-[gradient-to-r from-blue-400 to-purple-400 ]"
              />
            )}
            {signedInUser && (
            <div
              onClick={() => setEditingProfileImage(true)}
              className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={20} />
              <UploadImages/>
            </div>
            )}
          </div>
            
  
          {/* Username */}
          <div className="mb-4 text-center relative">
            <h2 className="text-3xl font-bold">{username || user?.username || "No username set"}</h2>
            {editingUsername ? (
              <div className="flex flex-col items-center gap-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input border rounded px-4 py-2 bg-gray-700 text-white w-full"
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
                className="absolute top-1/2 right-[-40px] transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <Edit2 size={20} />
              </button>
            )
            )}
          </div>
  
          {/* Email */}
          <div className="mb-6 text-center">
            <h3 className="text-sm text-gray-400">Email:</h3>
            <p className="text-lg text-gray-200">{email || user?.email || "No email provided"}</p>
          </div>
  
          {/* Joined Date */}
          <p className="text-sm text-gray-400 mb-6">
            Joined: {new Date(createdAt2 || user?.createdAt || "empty").toLocaleDateString()}
          </p>
  
          {/* Interest */}
          
          <div className="mb-6 text-center flex items-center justify-center gap-4">
            <h3 className="text-lg font-medium">Interest:</h3>
            {Array.isArray(interest) && interest.map((item,index)=>(
              <div key={index} className="flex items-center gap-2">
            <p  className="text-gray-200">{item || "No interest set"}</p>
            
            </div>
             ))}
             {signedInUser && (
             <button
              onClick={() => setEditingInterest(true)}
              className="text-gray-600 hover:text-blue-600"
              aria-label="Edit Interest"
            >
              <Edit2 size={16} />
            </button>
            )}
          </div>
         
          {editingInterest && (
            <div className="flex flex-col items-center gap-2 mb-4">
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
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
            {/* Followers and Following */}
            <div className="flex space-x-6 mt-6">
          <div
            onClick={handleShowFollowers}
            className="cursor-pointer text-lg"
          >
            <span className="font-bold">{followers.length}</span> Followers
          </div>
          <div
            onClick={handleShowFollowing}
            className="cursor-pointer text-lg"
          >
            <span className="font-bold">{following.length}</span> Following
          </div>
        </div>

        {/* Following Modal */}
        {showFollowingModal && (
          <div className="modal">
            <div className="modal-content">
              <h3 className="text-xl">Following</h3>
              <button onClick={closeModals}>Close</button>
              <ul>
                {following.map((follow: any) => (
                  <li key={follow._id}>{follow.username}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Follower Modal */}
        {showFollowerModal && (
          <div className="modal">
            <div className="modal-content">
              <h3 className="text-xl">Followers</h3>
              <button onClick={closeModals}>Close</button>
              <ul>
                {followers.map((follower: any) => (
                  <li key={follower._id}>{follower.username}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      
  
          {/* Sign Out */}
          {signedInUser && (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
          )}
        </div>
      </motion.div>
    </div>
  );
  
}