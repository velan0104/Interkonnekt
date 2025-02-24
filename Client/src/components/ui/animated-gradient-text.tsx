import { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface AnimatedGradientTextProps
  extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

export function AnimatedGradientText({
  children,
  className,
  ...props
}: AnimatedGradientTextProps) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit bg-transparent flex-row items-center justify-center px-4 py-1.5 text-sm font-medium transition-shadow duration-500 ease-out [--bg-size:300%]",
        className,
      )}
      {...props}
    >
      <div
        className={`absolute inset-0 block h-full w-full animate-gradient  `}
      />

<span className="relative text-transparent bg-clip-text">
        {children}
      </span>
    </div>
  );
}
