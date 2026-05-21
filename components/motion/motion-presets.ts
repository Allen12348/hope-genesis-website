import type { Transition, Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fade/slide props — enter keeps opacity 1 so content is never stuck invisible (FM + AnimatePresence). */
export function fadeSlideMotion(reduce: boolean | null, axis: "x" | "y" = "x") {
  const offset = axis === "x" ? { x: 12, y: 0 } : { x: 0, y: 10 };
  const exitOffset = axis === "x" ? { x: -12, y: 0 } : { x: 0, y: -10 };

  if (reduce) {
    return {
      initial: false as const,
      animate: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 1, x: 0, y: 0 },
    };
  }

  return {
    initial: { opacity: 1, ...offset },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...exitOffset },
  };
}

export const defaultTransition: Transition = {
  duration: 0.28,
  ease,
};

export const scrollRevealVariants = (reduce: boolean | null): Variants | false => {
  if (reduce) return false;
  return {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };
};
