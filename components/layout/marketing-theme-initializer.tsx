"use client";



import * as React from "react";

import { useTheme } from "next-themes";



const STORAGE_KEY = "theme";



/** Applies CMS default theme when the visitor has no saved `next-themes` preference. */

export function MarketingThemeInitializer({

  defaultTheme,

}: {

  defaultTheme: "light" | "dark" | "system";

}) {

  const { setTheme } = useTheme();

  const applied = React.useRef(false);



  React.useEffect(() => {

    if (applied.current) return;

    applied.current = true;



    try {

      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) return;

      setTheme(defaultTheme);

    } catch {

      /* ignore */

    }

  }, [defaultTheme, setTheme]);



  return null;

}

