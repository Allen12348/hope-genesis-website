"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { ImageFallbackPlaceholder } from "@/components/media/image-fallback-placeholder";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  alt: string;
  /** If the primary URL fails, try this URL before the branded placeholder. */
  fallbackSrc?: string;
};

/**
 * Marketing/admin image with branded fallback if `src` is empty or fails to load
 * (e.g. broken remote URL). Keeps folder-based or CMS URLs via a single `src`.
 */
export function CmsImage({ src, alt, className, fill, fallbackSrc, ...rest }: Props) {
  const [broken, setBroken] = React.useState(!src?.trim());
  const [activeSrc, setActiveSrc] = React.useState(src?.trim() || "");

  React.useEffect(() => {
    const next = src?.trim() || "";
    setActiveSrc(next);
    setBroken(!next);
  }, [src]);

  if (broken) {
    if (fill) {
      return <ImageFallbackPlaceholder fill className={className} />;
    }
    return (
      <ImageFallbackPlaceholder
        className={cn("aspect-video w-full max-w-full overflow-hidden rounded-xl", className)}
      />
    );
  }

  return (
    <Image
      src={activeSrc}
      alt={alt}
      fill={fill}
      className={className}
      {...rest}
      onError={() => {
        if (fallbackSrc && activeSrc !== fallbackSrc) {
          setActiveSrc(fallbackSrc);
          return;
        }
        setBroken(true);
      }}
    />
  );
}
