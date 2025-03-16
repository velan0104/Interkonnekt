"use client";
import avatar1 from "@/assets/avatar-1.png";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    text: "Communication",
    name: "Sophia Perez",
    title: "Director @ Quantum",
    avatarImg: avatar1,
  },
  {
    text: "Coding",
    name: "Jamie Lee",
    title: "Founder @ Pulse",
    avatarImg: avatar1,
  },
  {
    text: "Singing",
    name: "Alisa Hester",
    title: "Product @ Innovate",
    avatarImg: avatar1,
  },
  {
    text: "Art",
    name: "Alec Whitten",
    title: "CTO @ Tech Solutions",
    avatarImg: avatar1,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="container max-w-screen-[1320px] mx-auto">
        <h2 className="text-5xl md:text-6xl text-center tracking-tighter font-medium text-white">
          {" "}
          Enhance your skills{" "}
        </h2>
        <p className="text-white/70 text-lg md:text-xl text-center mt-5 tracking-tight max-w-xs mx-auto ">
          Our revolutionary AI SEO tools have transformed our clients
          strategies.
        </p>
        <div className=" flex overflow-hidden mt-10 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
          <motion.div
            initial={{
              translateX: "-50%",
            }}
            animate={{
              translateX: "0",
            }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
            className="flex gap-5 pr-5 flex-none "
          >
            {[...testimonials, ...testimonials].map((testimonial) => (
              <div
                key={testimonial.name}
                className="border border-white/15 p-6 md:p-10 rounded-xl bg-[linear-gradient(to_bottom_left,rgb(29,242,105,.3),black)] max-w-xs md:max-w-md flex-none"
              >
                <div className="text-lg tracking-tight md:text-xl">
                  {" "}
                  {testimonial.text}{" "}
                </div>
                {/* <div className="flex items-center gap-3 mt-5">
                  <div className="relative after:content-[''] after:absolute after:inset-0 after:bg-[rgb(140,69,244)] after:rounded-lg after:mix-blend-soft-light before:content-[''] before:absolute before:inset-0 before:border before:border-white/30 before:z-10 before:rounded-lg">
                    <Image
                      src={testimonial.avatarImg}
                      alt={`Avatar for ${testimonial.name}`}
                      className="h-11 w-11 rounded-lg grayscale"
                    />
                  </div>
                  <div className="">
                    <div> {testimonial.name} </div>
                    <div className="text-white/50 text-sm">
                      {" "}
                      {testimonial.title}{" "}
                    </div>
                  </div>
                </div> */}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
