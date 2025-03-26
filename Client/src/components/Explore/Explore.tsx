import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { CldImage } from "next-cloudinary";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { Carousel } from "../ui/carousel";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Details {
  id: string;
  image: string;
  name: string;
  interest: string;
}

interface Community {
  _id: string;
  name: string;
  bio: string;
  profilePic: string;
  banner: string;
  category: string;
}

const ExplorePage = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<Details[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState([]);
  const [communityData, setCommunityData] = useState<Community[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);



  const placeholders = [
    "Technology",
    "Interview",
    "Travel",
    "Fitness",
    "Books",
    "Coding",
  ];

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.length > 0) {
        try {
          const data = await fetch(`/api/searchAll`, {
            method: "POST",
            body: JSON.stringify({ searchTerm }),
            headers: { "Content-Type": "application/json" },
          });
          const response = await data.json();
          setSearching(true);
          setResults(response.message);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setResults([]); // Clear results if no input
      }
    };

    // Fetch results after a short delay to reduce API calls
    const delayDebounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await fetch("/api/allUserData", {
        method: "POST",

        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      setUserData(data.users);
    };

    fetchAllUsers();
  }, [pathname, session]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch("/api/getCommunities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
        const data = await response.json();
        setCommunityData(data.communities);
        console.log("data at get community: ", data)
      } catch (error) {
        console.error("Error fetching communities");
      }
    }
    fetchCommunities();
  }, [pathname, session]);
  console.log("community data: ", communityData);

  const communities = [
    {
      _id: "1",
      name: "Tech Enthusiasts",
      description: "A community for tech lovers.",
      image:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fless-address&psig=AOvVaw27zQQs_XtEVXTR6OtoLCrX&ust=1739875891964000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCo_IPFyosDFQAAAAAdAAAAABAE",
    },
    {
      _id: "2",
      name: "Fitness Freaks",
      description: "For those who love staying fit and active.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6OtylapJIJ8pMwHzuMakRJI239w1g8HEjw&s",
    },
    {
      _id: "3",
      name: "Book Worms",
      description: "Discuss and share book recommendations.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTafy_h5eLHC9twqFUvMC7Y5DuSXJ-u5NvuCw&s",
    },
  ];

  const users = [
    {
      _id: "1",
      name: "Alice Johnson",
      bio: "Tech blogger and software developer.",
    },
    { _id: "2", name: "Bob Smith", bio: "Fitness coach and nutritionist." },
    { _id: "3", name: "Catherine Lee", bio: "Book lover and aspiring author." },
  ];

  const interests = [
    { name: "Technology", emoji: "💻" },
    { name: "Fitness", emoji: "🏋️" },
    { name: "Books", emoji: "📚" },
    { name: "Music", emoji: "🎶" },
    { name: "Travel", emoji: "✈️" },
  ];

  useEffect(() => {
    gsap.fromTo(
      ".fade-in",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="absolute bg-gray-900 text-gray-100 w-[27rem]   p-4 md:p-6 overflow-hidden max-w-[48rem] h-auto min-h-[40rem] sm:w-[47rem] md:max-w-[35rem] lg:max-w-[48rem] xl:max-w-[35.5rem] 2xl:max-w-[47.5rem] left-0 xl:left-[23rem] 2xl:left-96 pb-20 sm:pb-0 border border-gray-800">
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="max-w-xl mx-auto p-4">
        {Array.isArray(results) && results.length > 0
          ? results.map(
            (result, index) =>
              result.id !== session?.user?.id && (
                <div
                  key={index}
                  className="flex items-center gap-4 mb-6 bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-gray-700 border border-gray-700 cursor-pointer"
                  onClick={() => router.push(`/profile/?userId=${result.id}`)}
                >

                  <Image
                    src={result?.image || session?.user?.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                    alt="Profile Image"
                    width={80}
                    height={60}
                    className="w-14 h-14 object-cover rounded-full border-2 border-[#53c97d] shadow-lg shadow-green-600/50"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-[#53c97d]">
                      {result.username}
                    </h3>
                    <p className="text-sm text-gray-400">{result.interest}</p>
                  </div>
                </div>
              )
          )
          : searching && (
            <p className="text-center text-gray-500 text-sm">No result</p>
          )}
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-[#53c97d] mb-8 text-center">
          Popular Interests
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {interests.map((interest, index) => (
            <motion.div
              key={index}
              //whileHover={{ scale: 1.2 }}
              className="px-6 py-3 bg-gradient-to-r from-[#67a57d] to-green-600 text-white rounded-full shadow-md flex items-center gap-2 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSearchTerm(interest.name)}
            >
              <span>{interest.emoji}</span>
              {interest.name}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Communities Section */}
      <section className="mb-12">
        <h2 className="text-4xl font-extrabold text-[#53c97d] mb-10 text-center tracking-wide drop-shadow-lg">
          Featured Communities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {communityData.map((community) => (
            <motion.div
              key={community._id}
              whileHover={{ scale: 1.06, translateY: -5 }}
              className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-3xl border border-gray-700 backdrop-blur-lg flex flex-col"
            >
              {/* Banner Image with Fixed Height */}
              <div className="relative w-full h-40">
                <Image
                  src={community.banner}
                  alt={`${community.name} Banner`}
                  width={400}
                  height={160} // Ensures consistent height
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-gray-900/90"></div>
              </div>

              {/* Profile Image with Neon Glow Effect */}
              <div className="relative flex justify-center -mt-14 h-24">
                <Image
                  src={community.profilePic}
                  alt={community.name}
                  width={90}
                  height={90}
                  className="rounded-full  border-4 border-gray-900 shadow-lg  transition-transform duration-300 ring-4 ring-[#53c97d] ring-opacity-50 object-cover mb-2"
                />
              </div>

              {/* Card Content with Uniform Spacing */}
              <div className="p-5 text-center bg-white/10 backdrop-blur-md rounded-b-2xl flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-[#53c97d] drop-shadow-lg">
                  {community.name}
                </h3>
                <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                  {community.bio}
                </p>

                {/* Spacer to Align Button */}
                <div className="flex-grow"></div>

                {/* Join Button with Glow Effect */}
                <button className="mt-4 px-6 py-2 bg-[#53c97d] text-gray-900 font-semibold rounded-full shadow-md hover:bg-[#45a067] transition-all duration-300 ring-2 ring-[#53c97d] hover:ring-offset-2 hover:ring-offset-gray-900" onClick={() => router.push(`/communities/${community._id}`)}>
                  🚀 Visit Community
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Users Section */}
      <section className=" px-4">
        <h2 className="text-4xl font-extrabold text-[#53c97d] text-center tracking-wide drop-shadow-lg">
          Meet Inspiring People
        </h2>

        {/* Horizontal Scroll Wrapper */}
        <div className="relative overflow-hidden mt-2">
          <motion.div
            className="flex gap-6 overflow-x-auto pb-4 px-2 scrollbar-hide"
            drag="x"
            dragConstraints={{ right: 0, left: -((userData.length - 2) * 260) }} // Adjust for smooth drag
          >
            {userData.map((user, index) => (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.05, rotateZ: 2 }}
                className="relative min-w-[250px] bg-gray-900 rounded-3xl shadow-lg overflow-hidden p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl"
                onClick={() => {
                  router.push(`/profile/?userId=${user.id}`);
                }}
              >
                {/* Floating Profile Image */}
                <div className="relative mt-5">
                  <Image
                    src={user.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                    alt={user.name}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-full border-4 border-green-500 shadow-lg shadow-green-500/50"
                  />
                </div>

                {/* User Info */}
                <h3 className="text-xl font-bold text-[#53c97d] mt-2">{user.name}</h3>
                <p className="text-gray-300 text-sm mt-2">{user.interest}</p>

                {/* Button to View Profile */}
                <button className="mt-4 px-5 py-2 bg-[#53c97d] text-gray-900 font-semibold rounded-full shadow-md hover:bg-[#45a067] transition-all">
                  🔍 View Profile
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default ExplorePage;
