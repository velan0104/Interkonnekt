"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center ">
      <div className="flex flex-col gap-y-10 justify-center items-center">
        <h1 className="text-5xl font-bold text-indigo-700"> INTERKONNEKT </h1>
        <button
          className="bg-indigo-700 w-fit px-5 py-3 rounded-xl text-white font-xl font-semibold"
          onClick={() => router.push("/profile")}
        >
          {" "}
          Move to Dashboard →
        </button>
      </div>
    </div>
  );
}
