import type { ReactNode } from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminCard } from "@/components/admin/ui/admin-card";

type AdminEmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function AdminEmptyState({ title, description, icon, action, className }: AdminEmptyStateProps) {
  return (
    <AdminCard className={cn("flex flex-col items-center justify-center gap-3 px-6 py-16 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground ring-1 ring-border">
        {icon ?? <FolderOpen className="h-7 w-7 opacity-70" />}
      </div>
      <div className="space-y-1">
        <p className="font-display text-lg font-semibold text-foreground">{title}</p>
        {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </AdminCard>
  );
}
