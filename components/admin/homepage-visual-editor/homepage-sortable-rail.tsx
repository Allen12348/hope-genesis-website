"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { HomeLegacySectionId } from "@/lib/cms/homepage-sections";
import { HOME_SECTION_LABELS } from "@/lib/cms/homepage-sections";
import { isSectionVisible } from "@/lib/cms/homepage-visual-editor/registry";
import type { HomepageEditorState } from "@/lib/cms/homepage-visual-editor/types";
import { cn } from "@/lib/utils";

function SortableRow({
  id,
  label,
  visible,
  selected,
  onSelect,
}: {
  id: HomeLegacySectionId;
  label: string;
  visible: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border/60 bg-card px-2 py-2 shadow-sm",
        selected && "border-sky-500 ring-2 ring-sky-400/30",
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button type="button" className="min-w-0 flex-1 text-left text-sm font-medium" onClick={onSelect}>
        {label}
        {!visible ? <span className="ml-2 text-[10px] font-semibold uppercase text-amber-600">Hidden</span> : null}
      </button>
    </li>
  );
}

type Props = {
  state: HomepageEditorState;
  selectedId: string | null;
  onSelect: (id: HomeLegacySectionId) => void;
  onReorder: (order: HomeLegacySectionId[]) => void;
};

export function HomepageSortableRail({ state, selectedId, onSelect, onReorder }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = state.order.indexOf(active.id as HomeLegacySectionId);
    const newIndex = state.order.indexOf(over.id as HomeLegacySectionId);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(state.order, oldIndex, newIndex));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={state.order} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          <li className="rounded-xl border border-sky-200/60 bg-sky-50/40 px-3 py-2 text-sm font-semibold text-sky-900 dark:bg-sky-950/30 dark:text-sky-100">
            Hero (fixed top)
          </li>
          {state.order.map((id) => (
            <SortableRow
              key={id}
              id={id}
              label={HOME_SECTION_LABELS[id]}
              visible={isSectionVisible(id, state.visibility)}
              selected={selectedId === id}
              onSelect={() => onSelect(id)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
