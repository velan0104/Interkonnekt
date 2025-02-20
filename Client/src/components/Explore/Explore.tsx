import { motion, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { CldImage } from "next-cloudinary";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { Carousel } from "../ui/carousel";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

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
const [searching,setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [results, setResults] = useState([]);

    const placeholders = [
      "Technology",
      "Interview",
      "Travel",
      "Fitness",
      "Books",
      "Coding",
    ]
  
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
            const response = await fetch('/api/allUserData',
               {
                method : 'POST',
               
                headers: { 'Content-Type': 'application/json' }
               }
            )
            const data = await response.json();
           
            setUserData(data.users);
            
        }
        
        fetchAllUsers();
    },[pathname,session])

  const communities = [
    {
      _id: "1",
      name: "Tech Enthusiasts",
      description: "A community for tech lovers.",
      image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fless-address&psig=AOvVaw27zQQs_XtEVXTR6OtoLCrX&ust=1739875891964000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKCo_IPFyosDFQAAAAAdAAAAABAE",
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
    <div className="absolute bg-gray-900 text-gray-100   p-4 md:p-6 overflow-hidden max-w-[48rem] h-auto min-h-[40rem] sm:max-w-[47rem] md:max-w-[35rem] lg:max-w-[48rem] xl:max-w-[35.5rem] 2xl:max-w-[47.5rem] left-0 xl:left-[23rem] 2xl:left-96 pb-20 sm:pb-0">
 <div className="mb-8 flex justify-center">
      <div className="relative w-full max-w-md">
      {/* <input
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
        </svg> */}
         <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={(e) => setSearchTerm(e.target.value)}
       // onSubmit={onSubmit}
       
      />
      </div>
    </div>
    <div className="max-w-xl mx-auto p-4">
      
  { Array.isArray(results) && results.length > 0 ? (
    results.map((result, index) => result.id !== session?.user?.id && (
      
      <div
        key={index}
        className="flex items-center gap-4 mb-6 bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
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
  ) : (searching &&
    <p className="text-center text-gray-500 text-sm">No result</p>
  )}
</div>


      {/* Hero Section */}
      {/* <motion.div
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
      </motion.div> */}

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
              //whileHover={{ scale: 1.2 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-md flex items-center gap-2 cursor-pointer"
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
        <h2 className="text-3xl font-semibold text-blue-400 mb-8 text-center">
          Featured Communities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {communities.map((community) => (
            <motion.div
              key={community._id}
              whileHover={{ scale: 1.05, rotateZ: 1 }}
              className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-xl"
            >
             
                <div key={community._id} className="bg-gray-800 rounded-lg p-4 shadow-md">
            <img src={community.image} alt={community.name} className="w-full h-32 object-cover rounded-md" />
            <h3 className="text-lg font-bold text-blue-500 mt-2">{community.name}</h3>
            <p className="text-gray-300 text-sm">{community.description}</p>
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
          className="hidden sm:grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-8 "
        >
          {userData.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.1 }}
              className="bg-gray-800 h-auto p-6 rounded-xl shadow-lg flex flex-col items-center group hover:bg-gradient-to-br from-blue-600 to-blue-800 "
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
        <div className=" sm:hidden">
        <Carousel  slides={userData.map(user => ({
          ...user,
          id: user.id,
          profileImage: user.image,
          interests: user.interest
        }))} />
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
