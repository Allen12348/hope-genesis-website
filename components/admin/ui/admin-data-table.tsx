"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { AdminCard } from "@/components/admin/ui/admin-card";

export type AdminTableColumn<T> = {
  id: string;
  header: string;
  sortable?: boolean;
  /** For default string sort when using built-in sort */
  sortValue?: (row: T) => string | number | boolean | null | undefined;
  className?: string;
  headerClassName?: string;
  cell: (row: T) => React.ReactNode;
};

type AdminDataTableProps<T> = {
  rows: T[];
  columns: AdminTableColumn<T>[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  /** Fields joined for default text search */
  searchKeys?: (row: T) => string[];
  /** Optional status filter: label + predicate */
  filterOptions?: { value: string; label: string; predicate: (row: T) => boolean }[];
  filterLabel?: string;
  pageSize?: number;
  enableSelection?: boolean;
  bulkActions?: React.ReactNode;
  emptyState?: React.ReactNode;
  toolbarExtra?: React.ReactNode;
  className?: string;
  onSelectionChange?: (ids: string[]) => void;
  /** Hide built-in search + filter row (use when parent supplies filtered `rows`). */
  suppressToolbar?: boolean;
};

export function AdminDataTable<T>({
  rows,
  columns,
  getRowId,
  searchPlaceholder = "Search…",
  searchKeys,
  filterOptions,
  filterLabel = "Filter",
  pageSize = 10,
  enableSelection = false,
  bulkActions,
  emptyState,
  toolbarExtra,
  className,
  onSelectionChange,
  suppressToolbar = false,
}: AdminDataTableProps<T>) {
  const [q, setQ] = React.useState("");
  const dq = useDebouncedValue(q, 220);
  const [filter, setFilter] = React.useState<string>("all");
  const [sort, setSort] = React.useState<{ id: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = React.useState(0);
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set());

  const processed = React.useMemo(() => {
    let list = [...rows];
    const needle = dq.trim().toLowerCase();
    if (needle && searchKeys) {
      list = list.filter((r) =>
        searchKeys(r).some((s) => String(s).toLowerCase().includes(needle)),
      );
    }
    if (filterOptions && filter !== "all") {
      const opt = filterOptions.find((o) => o.value === filter);
      if (opt) list = list.filter(opt.predicate);
    }
    if (sort) {
      const col = columns.find((c) => c.id === sort.id);
      if (col?.sortable && col.sortValue) {
        const dir = sort.dir === "asc" ? 1 : -1;
        list.sort((a, b) => {
          const va = col.sortValue!(a);
          const vb = col.sortValue!(b);
          if (va === vb) return 0;
          if (va == null) return 1;
          if (vb == null) return -1;
          if (typeof va === "number" && typeof vb === "number") return va < vb ? -dir : dir;
          return String(va).localeCompare(String(vb), undefined, { sensitivity: "base" }) * dir;
        });
      }
    }
    return list;
  }, [rows, dq, searchKeys, filter, filterOptions, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(processed.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);

  React.useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  const pageRows = React.useMemo(() => {
    const start = safePage * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, safePage, pageSize]);

  React.useEffect(() => {
    setPage(0);
  }, [dq, filter, rows.length]);

  function toggleSort(id: string) {
    const col = columns.find((c) => c.id === id);
    if (!col?.sortable) return;
    setSort((prev) => {
      if (!prev || prev.id !== id) return { id, dir: "asc" };
      if (prev.dir === "asc") return { id, dir: "desc" };
      return null;
    });
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllPage() {
    const ids = pageRows.map(getRowId);
    const allOn = ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOn) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  }

  const allPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(getRowId(r)));

  React.useEffect(() => {
    onSelectionChange?.(Array.from(selected));
  }, [selected, onSelectionChange]);

  return (
    <div className={cn("space-y-3", className)}>
      {!suppressToolbar ? (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="h-10 border-border bg-background pl-9"
                aria-label="Search table"
              />
            </div>
            {filterOptions ? (
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="sr-only">{filterLabel}</span>
                <select
                  className="h-10 min-w-[9rem] rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  {filterOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">{toolbarExtra}</div>
        </div>
      ) : null}

      {enableSelection && selected.size > 0 ? (
        <AdminCard className="flex flex-wrap items-center justify-between gap-2 border-accent/30 bg-accent/5 px-4 py-2">
          <span className="text-sm font-semibold text-foreground">
            {selected.size} selected
          </span>
          <div className="flex flex-wrap gap-2">{bulkActions}</div>
        </AdminCard>
      ) : null}

      <AdminCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="sticky top-0 z-[1] bg-muted/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
              <tr className="border-b border-border">
                {enableSelection ? (
                  <th className="w-10 px-3 py-3">
                    <Checkbox
                      checked={allPageSelected}
                      onCheckedChange={() => toggleAllPage()}
                      aria-label="Select all on page"
                    />
                  </th>
                ) : null}
                {columns.map((col) => (
                  <th key={col.id} className={cn("px-4 py-3", col.headerClassName)}>
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.id)}
                        className="inline-flex items-center gap-1 rounded-lg px-1 py-0.5 font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {col.header}
                        {sort?.id === col.id ? (
                          sort.dir === "asc" ? (
                            <ArrowUp className="h-3 w-3 text-accent" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-accent" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                    className="px-4 py-16 text-center text-sm text-muted-foreground"
                  >
                    {emptyState ?? "No rows match your filters."}
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => {
                  const id = getRowId(row);
                  return (
                    <tr
                      key={id}
                      className="bg-card text-foreground transition-colors hover:bg-muted/40 data-[selected=true]:bg-accent/5"
                      data-selected={enableSelection && selected.has(id)}
                    >
                      {enableSelection ? (
                        <td className="px-3 py-2.5 align-middle">
                          <Checkbox checked={selected.has(id)} onCheckedChange={() => toggleRow(id)} aria-label="Select row" />
                        </td>
                      ) : null}
                      {columns.map((col) => (
                        <td key={col.id} className={cn("px-4 py-2.5 align-middle", col.className)}>
                          {col.cell(row)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 border-t border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing{" "}
            <span className="font-semibold text-foreground">
              {processed.length === 0 ? 0 : safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, processed.length)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{processed.length}</span>
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1 rounded-lg"
              disabled={safePage <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <span className="px-2 font-mono text-[11px] text-foreground">
              {safePage + 1}/{pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1 rounded-lg"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
