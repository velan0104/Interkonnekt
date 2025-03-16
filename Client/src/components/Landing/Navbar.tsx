// import LogoIcon from "@/assets/logo.svg";
import Button from "./Button";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 py-4 border-b border-white/15 md:border-none">
      <div className="absolute inset-0 backdrop-blur -z-10 md:hidden"></div>
      <div className="container">
        <div className="flex justify-between items-center md:border border-white/15 md:p-2.5 rounded-xl max-w-2xl mx-auto relative">
          <div className="absolute inset-0 backdrop-blur -z-10 hidden md:block"></div>
          <div>
            <div className="border h-10 w-10 rounded-lg inline-flex justify-center items-center border-white/15">
              {/* <LogoIcon className="h-8 w-8" /> */}
              <h1> Interkonnekt</h1>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <Button> Join waitlist </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
