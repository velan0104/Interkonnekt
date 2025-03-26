"use client";
import { useEffect, useRef } from "react";
import BlurText from "../ui/BlurText";
import dynamic from "next/dynamic";
import { sampleArcs, globeConfig } from "@/lib/utils";
import gsap from "gsap";
import Button from "./Button";
import { useScroll, useTransform, motion } from "framer-motion";
import starsBg from "@/assets/stars.png";
import { useRouter } from "next/navigation";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
  }
);

export const Hero = () => {
  const router = useRouter();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundPositionY = useTransform(
    scrollYProgress,
    [0, 1],
    [-300, 300]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".title", {
        yPercent: 100,
        duration: 2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      animate={{
        backgroundPositionX: starsBg.width,
      }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 120,
      }}
      className="h-[492px] md:h-[800px] flex items-center overflow-hidden relative [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
      style={{
        backgroundImage: `url(${starsBg.src})`,
        backgroundPositionY,
      }}
    >
      <div className=" h-screen w-screen ">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[100%] w-[100%] flex flex-col justify-center items-center z-30">
          <div className="text-3xl md:text-9xl font-bold overflow-hidden ">
            <h1 className="title bg-gradient-to-r from-theme to-[#24f26e] bg-clip-text text-transparent font-sans">
              INTERKONNEKT
            </h1>
          </div>

          <BlurText
            text="Connect, Collaborate, and Grow with Like-Minded People!"
            delay={150}
            animateBy="words"
            direction="bottom"
            className="text-xl text-center md:text-4xl mb-8 text-gray-300 "
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 5, duration: 0.8, ease: "easeOut" }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Button
              text="Get Started →"
              handleClick={() => router.push("/auth/signup")}
            />
          </motion.div>
        </div>
        <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 md:h-full">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </motion.section>
  );
};
