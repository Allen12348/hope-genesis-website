"use client";

import { HgeAssistant } from "@/components/ai/squirly-assistant";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <HgeAssistant />
      <Toaster richColors position="top-center" />
    </>
  );
}
