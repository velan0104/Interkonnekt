import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { CldImage } from "next-cloudinary";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

interface Details {
    id: string;
    image: string,
    name: string,
    interest: string,
}

const ExplorePage = () => {
const {data : session} = useSession();
const pathname = usePathname();
const router = useRouter();
    const [userData,setUserData] = useState<Details[]>([]);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState([]);
  
    useEffect(() => {
      const fetchResults = async () => {
        if (searchTerm.length > 0) {
          try {
            const  data  = await fetch(`/api/searchAll`, {
              method: "POST",
              body: JSON.stringify({searchTerm}),
              headers: { "Content-Type": "application/json" },
            });
            const response = await data.json();
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
    console.log("results at explore: ",results)

    useEffect(() => {
        const fetchAllUsers = async () => {
            const response = await fetch('/api/allUserData',
               {
                method : 'POST',
               
                headers: { 'Content-Type': 'application/json' }
               }
            )
            const data = await response.json();
            console.log("data.users: ",data.users)
            setUserData(data.users);
            console.log("user details at explore: ",userData)
        }
        
        fetchAllUsers();
    },[pathname,session])

  const communities = [
    {
      _id: "1",
      name: "Tech Enthusiasts",
      description: "A community for tech lovers.",
      image: "data:image/jpeg;base64,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",
    },
    {
      _id: "2",
      name: "Fitness Freaks",
      description: "For those who love staying fit and active.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6OtylapJIJ8pMwHzuMakRJI239w1g8HEjw&s",
    },
    {
      _id: "3",
      name: "Book Worms",
      description: "Discuss and share book recommendations.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTafy_h5eLHC9twqFUvMC7Y5DuSXJ-u5NvuCw&s",
    },
  ];

  const users = [
    { _id: "1", name: "Alice Johnson", bio: "Tech blogger and software developer." },
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
    <div className="bg-gray-900 text-gray-100 h-[89vh] p-6 overflow-y-auto">
 <div className="mb-8 flex justify-center">
      <div className="relative w-full max-w-md">
      <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for people, communities, or interests..."
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg transition"
          />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 19a8 8 0 100-16 8 8 0 000 16zm10-2.5l-3-3" />
        </svg>
      </div>
    </div>
    <div className="max-w-xl mx-auto p-4">
  {Array.isArray(results) && results.length > 0 ? (
    results.map((result, index) => result.id !== session?.user?.id && (
      
      <div
        key={index}
        className="flex items-center gap-4 mb-6 bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
        onClick={() => router.push(`/profile/?userId=${result.id}`)}
      >
        {!result.image ?
                      <img
                      src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                      alt={result.name}
                      className="w-10 h-10 rounded-full border border-gray-700"
                    /> : 
                    ( result.image && result.image.includes("https://lh3.googleusercontent.com") ? 
                      <img
                      src={result.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                      alt={result.name}
                      className="w-10 h-10 rounded-full border border-gray-700"
                    /> :
                    <CldImage
                    src={result.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                    alt={result.name}
                    width={50}
                    height={50}
                     className="w-10 h-10 object-cover rounded-full"
                    />
                    )
                      }
        <div>
          <h3 className="text-lg font-semibold ">{result.username}</h3>
          <p className="text-sm text-gray-500">{result.interest}</p>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 text-sm"></p>
  )}
</div>


      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-12 mb-12 text-center"
      >
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          🌟 Explore New Horizons
        </h1>
        <p className="text-gray-100 text-lg mt-4">
          Discover communities, connect with people, and ignite your passions.
        </p>
      </motion.div>

      {/* Interests Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-blue-400 mb-8 text-center">
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
              whileHover={{ scale: 1.2 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-md flex items-center gap-2"
            >
              <span>{interest.emoji}</span>
              {interest.name}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Communities Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-blue-400 mb-8 text-center">
          Featured Communities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {communities.map((community) => (
            <motion.div
              key={community._id}
              whileHover={{ scale: 1.05, rotateZ: 1 }}
              className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-xl group"
            >
              <div className="relative">
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-full h-40 object-cover group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-500 group-hover:text-blue-300">
                  {community.name}
                </h3>
                <p className="mt-2 text-gray-300 group-hover:text-gray-100">
                  {community.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Users Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-blue-400 mb-8 text-center">
          Meet Inspiring People
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {userData.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.1 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center group hover:bg-gradient-to-br from-blue-600 to-blue-800"
              onClick={() => {router.push(`/profile/?userId=${user.id}`)}}
            >
              <div className="relative" >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform">
               {!user.image ?
                             <img
                             src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                             alt={user.name}
                             className="w-14 h-14 rounded-full border border-gray-700"
                           /> : 
                           ( user.image && user.image.includes("https://lh3.googleusercontent.com") ? 
                             <img
                             src={user.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                             alt={user.name}
                             className="w-14 h-14 rounded-full border border-gray-700"
                           /> :
                           <CldImage
                           src={user.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm59k-5YeirfW5MOf8SJiGIEJ6yTYRlnCs7SV93Y2__6FrKPWnE3FXgGDWhXAjsCe8_18&usqp=CAU"}
                           alt={user.name}
                           width={50}
                           height={50}
                            className="w-14 h-14 object-cover rounded-full"
                           />
                           )
                             }
                </div>
              </div>
              <h3 className="text-lg font-bold text-blue-500 mt-4 group-hover:text-blue-300">
                {user.name}
              </h3>
              <p className="text-gray-300 text-sm mt-2 text-center group-hover:text-gray-100">
                {user.interest}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default ExplorePage;
