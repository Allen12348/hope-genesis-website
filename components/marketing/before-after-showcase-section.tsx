import { beforeAfterShowcases } from "@/data/before-after-showcase";
import { SectionShell } from "@/components/sections/section-shell";
import { BeforeAfterSlider } from "@/components/media/before-after-slider";
import { Badge } from "@/components/ui/badge";

export function BeforeAfterShowcaseSection() {
  return (
    <SectionShell
      intro
      eyebrow="Transformations"
      title="Before & after — interactive comparisons"
      description="Drag the reveal handle to compare workmanship. Hover for subtle zoom; open fullscreen for detail review on large displays."
    >
      <div className="grid gap-8">
        {beforeAfterShowcases.map((item) => (
          <div key={item.id} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full">
                {item.segment}
              </Badge>
              <h3 className="font-display text-xl font-semibold">{item.title}</h3>
            </div>
            <BeforeAfterSlider
              beforeSrc={item.beforeSrc}
              afterSrc={item.afterSrc}
              alt={item.alt}
            />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
