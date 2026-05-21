"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type AdminActionItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

export type AdminActionMenuEntry = AdminActionItem | { type: "separator"; key: string };

type AdminActionMenuProps = {
  items: AdminActionMenuEntry[];
  label?: string;
  align?: "start" | "end";
};

export function AdminActionMenu({ items, label = "Row actions", align = "end" }: AdminActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={label}
          title={label}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48 border-border bg-popover">
        {items.map((entry) =>
          "type" in entry && entry.type === "separator" ? (
            <DropdownMenuSeparator key={entry.key} />
          ) : (
            <DropdownMenuItem
              key={(entry as AdminActionItem).key}
              disabled={(entry as AdminActionItem).disabled}
              className={cn(
                "gap-2 text-sm font-medium",
                (entry as AdminActionItem).destructive &&
                  "text-destructive focus:bg-destructive/10 focus:text-destructive",
              )}
              onSelect={(e) => {
                e.preventDefault();
                (entry as AdminActionItem).onSelect();
              }}
            >
              {(entry as AdminActionItem).icon}
              {(entry as AdminActionItem).label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
