import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
