"use client";
import { motion } from "framer-motion";

export const Marquee = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="container max-w-screen-xl mx-auto">
        <div className=" flex flex-col text-center gap-10">
          <div className="flex-1 md:flex-none text-white font-semibold text-xl">
            {/* <h2>
              {" "}
              Grow Your Network.
              <br /> Connect with{" "}
            </h2> */}
            <h2 className="font-bold text-theme text-4xl p-2">
              {" "}
              Enhance Your Network{" "}
            </h2>
            <h3 className="font-semibold mx-5">
              {" "}
              Connect with People of different skillset and grow you network.
            </h3>
          </div>
          <div className="flex flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              initial={{ translateX: "-50%" }}
              animate={{ translateX: "0" }}
              transition={{
                repeat: Infinity,
                duration: 30,
                ease: "linear",
              }}
              className="flex flex-none gap-6 md:gap-14 pr-14 -translate-x-1/2"
            >
              {[
                "Coding",
                "Communication",
                "Art",
                "Singing",
                "Teaching",
                "Coding",
                "Communication",
                "Art",
                "Singing",
                "Teaching",
              ].map((logo, idx) => (
                <div
                  key={idx}
                  className="bg-theme text-base md:text-lg text-black px-5 py-2 md:px-10 md:py-4 rounded-full"
                >
                  {logo}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
