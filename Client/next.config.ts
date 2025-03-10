import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "encrypted-tbn0.gstatic.com",
      "images.unsplash.com",
    ],
  },
};

export default nextConfig;
