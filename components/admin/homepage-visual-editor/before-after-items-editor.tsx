"use client";

import * as React from "react";
import { GripVertical, ImagePlus, Trash2 } from "lucide-react";
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
import type { BeforeAfterCms, BeforeAfterItemCms } from "@/lib/cms/marketing-cms-defaults";
import { AdminImageUrlField } from "@/components/admin/admin-image-url-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function emptyItem(): BeforeAfterItemCms {
  return {
    category: "Installation",
    title: "New comparison",
    caption: "",
    beforeImageUrl: "",
    afterImageUrl: "",
    beforeAlt: "Before",
    afterAlt: "After",
  };
}

function SortableItem({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: BeforeAfterItemCms;
  index: number;
  onChange: (next: BeforeAfterItemCms) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `ba-${index}`,
  });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.7 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="space-y-3 rounded-xl border border-border/70 bg-muted/15 p-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="cursor-grab touch-none rounded p-1 text-muted-foreground"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <span className="text-xs font-semibold uppercase text-muted-foreground">Slide {index + 1}</span>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Category</Label>
          <Input value={item.category} onChange={(e) => onChange({ ...item, category: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Title</Label>
          <Input value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1">
        <Label>Caption</Label>
        <Textarea value={item.caption ?? ""} rows={2} onChange={(e) => onChange({ ...item, caption: e.target.value })} />
      </div>
      <AdminImageUrlField
        id={`ba-before-${index}`}
        label="Before image"
        value={item.beforeImageUrl}
        onChange={(beforeImageUrl) => onChange({ ...item, beforeImageUrl })}
        altLabel="Before alt"
        altValue={item.beforeAlt}
        onAltChange={(beforeAlt) => onChange({ ...item, beforeAlt })}
        mediaFolder="before-after"
      />
      <AdminImageUrlField
        id={`ba-after-${index}`}
        label="After image"
        value={item.afterImageUrl}
        onChange={(afterImageUrl) => onChange({ ...item, afterImageUrl })}
        altLabel="After alt"
        altValue={item.afterAlt}
        onAltChange={(afterAlt) => onChange({ ...item, afterAlt })}
        mediaFolder="before-after"
      />
    </div>
  );
}

type Props = {
  data: BeforeAfterCms;
  onChange: (next: BeforeAfterCms) => void;
};

export function BeforeAfterItemsEditor({ data, onChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const ids = data.items.map((_, i) => `ba-${i}`);

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    onChange({ items: arrayMove(data.items, oldIndex, newIndex) });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Drag to reorder showcase slides. Each slide uses the draggable before/after comparison on the homepage.
      </p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {data.items.map((item, index) => (
              <SortableItem
                key={ids[index]}
                item={item}
                index={index}
                onChange={(next) => {
                  const items = [...data.items];
                  items[index] = next;
                  onChange({ items });
                }}
                onRemove={() => onChange({ items: data.items.filter((_, i) => i !== index) })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-xl"
        disabled={data.items.length >= 6}
        onClick={() => onChange({ items: [...data.items, emptyItem()] })}
      >
        <ImagePlus className="mr-2 h-4 w-4" />
        Add comparison slide
      </Button>
    </div>
  );
}
