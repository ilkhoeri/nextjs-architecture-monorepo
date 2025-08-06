import React from "react";
import { Loader } from "@repo/ui";

export default function Loading() {
  return (
    <main className="relative flex h-screen min-h-screen w-full items-center justify-center bg-background-theme">
      <Loader size={24} />
    </main>
  );
}
