"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center ">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="flex flex-col gap-y-10 justify-center items-center">
        <h1 className="text-5xl font-bold text-indigo-700"> INTERKONNEKT </h1>
        <button
          className="bg-indigo-700 w-fit px-5 py-3 rounded-xl text-white font-xl font-semibold"
          onClick={() => router.push("/auth/signup")}
        >
         
          Move to Dashboard →
        </button>
      </div>
    </div>
  );
}
