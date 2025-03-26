"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { signOut } from "next-auth/react";
import {
  Home,
  Compass,
  Users,
  MessageSquare,
  User,
  Video,
  LogOut,
} from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/Store/store";
import {
  setOpenCallModal,
  setOpenVideoChatModal,
} from "@/Slice/videoChatSlice";
import { VideoCallModal } from "../VideoCall/VideoCallModal";
import { CallModal } from "../VideoCall/CallModal";
import Image from "next/image";

export default function SidebarDemo() {
  const { data: session } = useSession();
  const [activeLink, setActiveLink] = useState("home");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [cloudinaryImage, setCloudinaryImage] = useState("");
  const [IscloudinaryImage, setIsCloudinaryImage] = useState(false);
  const openVideoChatModal = useSelector(
    (state: RootState) => state.videoChat.openVideoChatModal
  );
  const openCallModal = useSelector(
    (state: RootState) => state.videoChat.openCallModal
  );
  const caller = useSelector((state: RootState) => state.videoChat.caller);
  const pathname = usePathname();
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchUnameInterest = async () => {
      const response = await fetch("/api/getUnameInterest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });
      const data = await response.json();
      if (data) {
        setUsername(data.username);
        setProfileImage(data.image);
        // if (!data.image) {
        //   setIsCloudinaryImage(false);
        //   setProfileImage(
        //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
        //   );
        // } else if (data.image.includes("https://lh3.googleusercontent.com")) {
        //   setIsCloudinaryImage(false);
        //   setProfileImage(data.image);
        // } else {
        //   setIsCloudinaryImage(true);
        //   setCloudinaryImage(data.image);
        // }
      }
    };
    fetchUnameInterest();
  }, [session]);

  useEffect(() => {
    // Automatically set the active link based on the current pathname
    if (pathname === "/profile") {
      setActiveLink("profile");
    }
    if (pathname === "/messages") {
      setActiveLink("messages");
    }
    if (pathname === "/communities") {
      setActiveLink("communities");
    }
    if (pathname === "/explore") {
      setActiveLink("explore");
    }
    if (pathname === "/main") {
      setActiveLink("home");
    }
  }, [pathname, activeLink]);

  const links = [
    { label: "Home", href: "/main", icon: <Home size={20} /> },
    { label: "Explore", href: "/explore", icon: <Compass size={20} /> },
    { label: "Communities", href: "/communities", icon: <Users size={20} /> },
    { label: "Messages", href: "/messages", icon: <MessageSquare size={20} /> },
    {
      label: "Profile",
      href: `/profile/?userId=${session?.user?.id}`,
      icon: <User size={20} />,
    },
  ];

  const handleVideoCallModal = () => {
    dispatch(setOpenVideoChatModal(!openVideoChatModal));
  };

  const handleAcceptCall = () => {
    socket?.emit("acceptCall", {
      sender: session?.user?.id,
      receiver: caller?._id,
    });
    dispatch(setOpenCallModal(false));
  };

  const handleDeclineCall = () => {
    const senderId = caller?._id;
    const receiverId = session?.user?.id;
    socket?.emit("declineCall", { senderId, receiverId });
    dispatch(setOpenCallModal(false));
  };

  return (
    <div
      className={cn(
        " rounded-xl flex flex-col   dark:bg-gray-900 h-[89vh] w-full max-w-5xl mx-auto  dark:border-gray-700 overflow-hidden shadow-lg"
      )}
    >
      <div className="xl:hidden fixed bottom-0 left-0 w-full bg-black dark:bg-gray-900 shadow-lg flex justify-around py-3 border-t border-gray-300 dark:border-gray-700 z-50">
        {links.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-[#53c97d] transition-colors"
          >
            {link.icon}
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
      </div>

      <aside className="hidden fixed md:flex flex-col h-[89vh] w-96 bg-gray-900 text-white p-5 shadow-lg  backdrop-blur-sm">
        {/* Profile Section */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 shadow-md mb-8">
          <Image
            src={
              profileImage ||
              session?.user?.image ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"
            }
            alt="Profile Image"
            width={80}
            height={60}
            className="w-14 h-14 object-cover rounded-full border-2 border-[#53c97d] shadow-lg shadow-[#53c97d]/50"
          />

          <span className="text-lg font-semibold tracking-wide">
            {username || session?.user?.name}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {[
              {
                label: "Home",
                icon: <Home size={20} />,
                route: "/main",
                id: "home",
              },
              {
                label: "Explore",
                icon: <Compass size={20} />,
                route: "/explore",
                id: "explore",
              },
              {
                label: "Communities",
                icon: <Users size={20} />,
                route: "/communities",
                id: "communities",
              },
              {
                label: "Messages",
                icon: <MessageSquare size={20} />,
                route: "/messages",
                id: "messages",
              },
              {
                label: "Profile",
                icon: <User size={20} />,
                route: `/profile/?userId=${session?.user?.id}`,
                id: "profile",
              },
            ].map(({ label, icon, route, id }) => (
              <li key={id} onClick={() => setActiveLink(id)}>
                <button
                  onClick={() => router.push(route)}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 
                  ${
                    activeLink === id
                      ? "bg-[#53c97d] text-white shadow-lg shadow-[#53c97d]/50 border-l-4 border-[#53c97d]"
                      : "hover:bg-white/10 hover:text-[#53c97d]"
                  }`}
                >
                  {icon}
                  <span className="font-medium text-[16px] tracking-wide">
                    {label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Video Call Button */}
        <button
          onClick={() => dispatch(setOpenVideoChatModal(!openVideoChatModal))}
          className="flex items-center justify-center gap-3 w-full bg-theme hover:bg-theme/80 text-white font-semibold py-3 px-5 rounded-lg mb-4 shadow-lg transition-all transform hover:scale-105"
        >
          <Video size={22} />
          <span>Start Video Call</span>
        </button>

        {/* Logout Button */}
        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/auth/signup" })}
          className="flex items-center justify-center gap-4 px-5 py-3 w-full bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 
             shadow-md hover:bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/50 
             transform hover:scale-105 border border-transparent hover:border-white"
        >
          <LogOut size={22} />
          <span className="text-lg">Logout</span>
        </button>
        <VideoCallModal
          open={openVideoChatModal}
          onOpenChange={handleVideoCallModal}
        />
        {caller !== null && (
          <CallModal
            isOpen={openCallModal}
            onAccept={handleAcceptCall}
            onClose={handleDeclineCall}
            onDecline={handleDeclineCall}
            caller={caller}
          />
        )}
      </aside>
    </div>
  );
}

const Dashboard = () => (
  <div className="flex flex-1 p-10 bg-gray-900 dark:bg-neutral-900">
    <div className="h-full w-full rounded-lg bg-gray-900 dark:bg-neutral-800 animate-pulse" />
  </div>
);
