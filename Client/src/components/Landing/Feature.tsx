"use client";
import Image from "next/image";
import { Building, Users, Video } from "lucide-react";
import { motion } from "framer-motion";

interface cardProps {
  img: string;
  Icon: React.ElementType;
  title: string;
  description: string;
  isOdd?: boolean;
}

const Features: cardProps[] = [
  {
    img: "/images/feature-1.jpg",
    Icon: Users,
    title: "Interest based communities",
    description: "Join groups based on your passion",
  },
  {
    img: "/images/feature-2.jpg",
    Icon: Video,
    title: "Random Connect",
    description:
      "Connect with random people based on your skills and grow your network.",
  },
  {
    img: "/images/feature-3.jpg",
    Icon: Building,
    title: "Host and Join Workshop",
    description:
      "Join and host workshop for sharing your skills & interest with like-minded people.",
  },
];

export const Feature = () => {
  return (
    <div className=" max-w-[1320px] mx-auto min-h-screen">
      <h1 className="text-theme font-semibold italic text-4xl text-center md:text-left md:text-5xl py-8">
        {" "}
        What Special ?
      </h1>
      <div className="flex flex-col gap-10">
        {Features.map((item, idx) => (
          <CardComponent
            key={idx}
            img={item.img}
            Icon={item.Icon}
            title={item.title}
            description={item.description}
            isOdd={idx % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
};

const CardComponent = ({ img, Icon, title, description, isOdd }: cardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.2 }}
    className="grid grid-cols-1 md:grid-cols-2 w-full   text-white items-center content-center gapy-5"
  >
    <div
      className={`card-wrapper h-[300px] w-[300px] mx-auto md:mx-0 md:h-[500px] md:w-[500px] ${
        isOdd ? "md:order-2" : "md:order-1"
      }`}
    >
      <div className="card-content flex items-center justify-center text-xs h-[400px] w-[400px]">
        <Image
          src={img}
          alt={title}
          height={200}
          width={200}
          className="h-[95%] w-[95%] mx-auto rounded-2xl"
        />
      </div>
    </div>
    <div
      className={`flex flex-col gap-4 max-w-[70%] mx-auto md:mx-0 py-5 md:py-0  ${
        isOdd ? "md:order-1" : "md:order-2"
      }`}
    >
      <div className="relative">
        <div className="filter blur-lg bg-theme size-[85px] rounded-full z-0" />
        <div className="absolute top-0 size-20 bg-theme rounded-full shadow-theme p-5 text-black flex justify-center items-center z-40">
          <Icon size={36} color="black" />
        </div>
      </div>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-xl"> {description}</p>
    </div>
  </motion.div>
);
