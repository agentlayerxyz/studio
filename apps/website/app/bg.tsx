"use client";

import { OmbreSynthesis8, OmbreVapor1 } from "@ombre-ui/react";
import { useTheme } from "nextra-theme-docs";

export default function Bg() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {resolvedTheme === "light" ? <OmbreVapor1 /> : <OmbreSynthesis8 />}
    </div>
  );
}
