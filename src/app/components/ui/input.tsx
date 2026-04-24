import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "input-glass text-white placeholder:text-white/40 selection:bg-indigo-500/30 flex h-10 w-full min-w-0 rounded-xl border px-4 py-2 text-base transition-all duration-300 outline-none",
        "focus-visible:border-indigo-500/50 focus-visible:ring-2 focus-visible:ring-indigo-500/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
