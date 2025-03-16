// import Logo from "@/assets/logo.svg";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="py-5 border-t border-white/15 ">
      <div className="container max-w-[1320px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex gap-2 items-center lg:flex-1">
            {/* <Logo className="h-6 w-6" /> */}
            <div className="font-medium text-white/80"> Interkonnekt </div>
          </div>
          <nav className="flex flex-col lg:flex-row gap-5 lg:gap-7 lg:flex-1 lg:justify-center">
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              {" "}
              Features{" "}
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              {" "}
              Developers{" "}
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              {" "}
              Company{" "}
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              {" "}
              Blog{" "}
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm transition"
            >
              {" "}
              Changelog{" "}
            </a>
          </nav>
          <div className="flex gap-5 lg:flex-1 lg:justify-end">
            <FaFacebook className="size-6 text-white/40 hover:text-white transition" />
            <FaInstagram className="size-6 text-white/40 hover:text-white transition" />
            <FaYoutube className="size-6 text-white/40 hover:text-white transition" />
          </div>
        </div>
      </div>
    </footer>
  );
};
