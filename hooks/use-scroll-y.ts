"use client";

import { useEffect, useState } from "react";

/** Tracks vertical scroll position for UI like blurred navbars. */
export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let raf = 0;
    let latest = 0;

    const flush = () => {
      raf = 0;
      setY((prev) => (prev === latest ? prev : latest));
    };

    const onScroll = () => {
      latest = window.scrollY;
      if (!raf) raf = requestAnimationFrame(flush);
    };

    latest = window.scrollY;
    setY(latest);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return y;
}
