import React from "react";
import { cn } from "@/lib/utils";

export function GridBackgroundDemo() {
  return (
    <div className="relative h-full w-full">
      {/* Grid lines */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      {/* Optional dark overlay to soften the grid */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
    </div>
  );
}
