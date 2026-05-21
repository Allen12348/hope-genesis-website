import { cn } from "@/lib/utils";

export type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h2>
      {description ? <p className="text-base leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
  );
}
