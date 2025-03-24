"use client";
import { CallToAction } from "@/components/Landing/CallToAction";
import { Feature } from "@/components/Landing/Feature";
import { Footer } from "@/components/Landing/Footer";
import { Hero } from "@/components/Landing/Hero";
import { Marquee } from "@/components/Landing/Marquee";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="overflow-x-hidden bg-slate-950">
        {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full"></div> */}
        <Hero />
        <Marquee />
        <Feature />
        {/* <Testimonials /> */}
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}
