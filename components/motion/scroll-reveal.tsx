"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  delay?: number;
};

/**
 * Scroll-triggered reveal wrapper — respects reduced motion preferences.
 */
export function ScrollReveal({
  className,
  delay = 0,
  children,
  ...props
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
