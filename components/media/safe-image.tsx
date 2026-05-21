"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK =
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&h=800&q=70";

export type SafeImageProps = Omit<ImageProps, "onError" | "src"> & {
  src: string;
  fallbackSrc?: string;
};

/**
 * `next/image` with lazy loading, optional blur placeholder, and a broken-URL fallback.
 */
export function SafeImage({ src, fallbackSrc = FALLBACK, className, alt, ...rest }: SafeImageProps) {
  const [current, setCurrent] = React.useState(src);

  React.useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      className={cn(className)}
      loading={rest.loading ?? "lazy"}
      onError={() => setCurrent(fallbackSrc)}
    />
  );
}
