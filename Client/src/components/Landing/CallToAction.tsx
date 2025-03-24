"use client";
import starsBg from "@/assets/stars.png";
import gridLines from "@/assets/grid-lines.png";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { RefObject, useEffect, useRef } from "react";
import Button from "./Button";
import { useRouter } from "next/navigation";

const useRelativeMousePosition = (to: RefObject<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const updateMousePosition = (event: MouseEvent) => {
    if (!to.current) return;
    const { top, left } = to.current?.getBoundingClientRect();
    mouseX.set(event.x - left);
    mouseY.set(event.y - top);
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return [mouseX, mouseY];
};

export const CallToAction = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const borderDivRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundPositionY = useTransform(
    scrollYProgress,
    [0, 1],
    [-300, 300]
  );
  // Helping your Buisness Thrive in the Real World{" "}

  const [mouseX, mouseY] = useRelativeMousePosition(borderDivRef);

  const maskImage = useMotionTemplate`radial-gradient(50% 50% at ${mouseX}px ${mouseY}px,black,transparent)`;
  return (
    <section
      className="py-20 md:py-24 max-w-screen-xl mx-auto"
      ref={sectionRef}
    >
      <div className="container">
        <motion.div
          ref={borderDivRef}
          className="border border-white/15 py-24 rounded-xl overflow-hidden relative group"
          animate={{
            backgroundPositionX: starsBg.width,
          }}
          transition={{
            repeat: Infinity,
            duration: 60,
            ease: "linear",
          }}
          style={{
            backgroundPositionY,
            backgroundImage: `url(${starsBg.src})`,
          }}
        >
          <div
            className="absolute inset-0 bg-[rgb(29,222,98)] bg-blend-overlay [mask-image:radial-gradient(50%_50%_at_50%_35%,black,transparent)] group-hover:opacity-0 transition duration-700"
            style={{
              backgroundImage: `url(${gridLines.src})`,
            }}
          ></div>
          <motion.div
            className="absolute inset-0 bg-[rgb(29,222,98)] bg-blend-overlay  opacity-0 group-hover:opacity-100 transition duration-700"
            style={{
              maskImage,
              backgroundImage: `url(${gridLines.src})`,
            }}
          ></motion.div>
          <div className="relative">
            <h2 className="text-5xl md:text-6xl max-w-sm mx-auto tracking-tighter text-center font-medium">
              {" "}
              Grow your Network
            </h2>
            <p className="text-center text-lg md:text-xl max-w-xs mx-auto text-white/70 px-4 mt-5 tracking-tight">
              {" "}
              Connect with like-minded people
            </p>
            <div className="flex justify-center mt-5">
              <Button
                text="Get started →"
                handleClick={() => router.push("/auth/signup")}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
