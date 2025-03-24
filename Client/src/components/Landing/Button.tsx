interface ButtonProps {
  text: string;
  handleClick: () => void;
}

const Button = ({ text, handleClick }: ButtonProps) => {
  return (
    <button
      className="relative py-2 px-3 font-medium text-sm bg-gradient-to-b from-[#03451b] to-theme shadow-[0px_0px_12px_#03451b] rounded-xl"
      onClick={handleClick}
    >
      <div className="absolute inset-0 ">
        <div className="rounded-xl border border-white/70 absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="rounded-xl border absolute inset-0 border-white/40 [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div className="absolute inset-0 shadow-[0_0_10px_rgb(140,69,255,.7)_inset] rounded-xl" />
      </div>
      <span> {text} </span>
    </button>
  );
};

export default Button;
