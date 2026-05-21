"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
  /** CMS default when the visitor has no saved preference. */
  defaultTheme?: "light" | "dark" | "system";
};

/** next-themes provider with sensible defaults for a marketing site. */
export function ThemeProvider({ children, defaultTheme = "light" }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
