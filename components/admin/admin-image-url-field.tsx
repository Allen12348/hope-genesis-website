"use client";



import * as React from "react";

import { FolderOpen, ImageIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { isSafeImageSource } from "@/lib/validations/image-url";

import { ImageFallbackPlaceholder } from "@/components/media/image-fallback-placeholder";

import { clampCompanyHeroBackgroundBlur } from "@/lib/cms/hero-display";

import type { MediaFolderId } from "@/lib/domain/media/constants";

import { MediaPickerDialog } from "@/components/admin/media/media-picker-dialog";



const HELPER =

  "Select from the media library or paste a https:// URL. Use “Test image” to verify before saving.";



type Props = {

  id: string;

  label: string;

  value: string;

  onChange: (next: string) => void;

  altLabel?: string;

  altValue?: string;

  onAltChange?: (next: string) => void;

  disabled?: boolean;

  className?: string;

  placeholder?: string;

  /** Live preview: blur on background image only (px, 0–20). */

  previewBackgroundBlur?: number;

  /** Default folder when opening the media picker. */

  mediaFolder?: MediaFolderId;

  /** Show “Select media” button (default true). */

  enableMediaPicker?: boolean;

};



function previewUrl(value: string): string {

  const t = value.trim();

  if (!t) return "";

  if (t.startsWith("http")) return t;

  if (typeof window !== "undefined" && t.startsWith("/")) return `${window.location.origin}${t}`;

  return t;

}



export function AdminImageUrlField({

  id,

  label,

  value,

  onChange,

  altLabel,

  altValue,

  onAltChange,

  disabled,

  className,

  previewBackgroundBlur = 0,

  placeholder = "https://example.com/project-image.jpg",

  mediaFolder = "gallery",

  enableMediaPicker = true,

}: Props) {

  const [testUrl, setTestUrl] = React.useState<string | null>(null);

  const [testError, setTestError] = React.useState<string | null>(null);

  const [testing, setTesting] = React.useState(false);

  const [pickerOpen, setPickerOpen] = React.useState(false);



  const previewSrc = testUrl ?? previewUrl(value);

  const bgBlur = clampCompanyHeroBackgroundBlur(previewBackgroundBlur);



  function runTest() {

    const u = value.trim();

    setTestError(null);

    setTestUrl(null);

    if (!u) {

      setTestError("Enter a URL or select from the media library.");

      return;

    }

    if (!isSafeImageSource(u)) {

      setTestError("Use a media library image or a public http(s) URL.");

      return;

    }

    setTesting(true);

    const img = new window.Image();

    img.onload = () => {

      setTestUrl(previewUrl(u));

      setTesting(false);

    };

    img.onerror = () => {

      setTestError("Image could not be loaded from this URL.");

      setTesting(false);

    };

    img.src = previewUrl(u);

  }



  return (

    <>

      <div className={cn("space-y-3 rounded-xl border border-border bg-muted/20 p-4", className)}>

        <div className="space-y-1">

          <Label htmlFor={id}>{label}</Label>

          <div className="flex flex-col gap-2 sm:flex-row">

            <Input

              id={id}

              value={value}

              disabled={disabled}

              onChange={(e) => onChange(e.target.value)}

              placeholder={placeholder}

              className="border-border bg-background font-mono text-xs sm:flex-1 sm:text-sm"

            />

            {enableMediaPicker ? (

              <Button

                type="button"

                variant="secondary"

                size="sm"

                className="shrink-0 rounded-xl"

                disabled={disabled}

                onClick={() => setPickerOpen(true)}

              >

                <FolderOpen className="mr-1.5 h-4 w-4" />

                Select media

              </Button>

            ) : null}

          </div>

          <p className="text-xs text-muted-foreground">{HELPER}</p>

        </div>



        {altLabel && onAltChange ? (

          <div className="space-y-1">

            <Label htmlFor={`${id}-alt`}>{altLabel}</Label>

            <Input

              id={`${id}-alt`}

              value={altValue ?? ""}

              disabled={disabled}

              onChange={(e) => onAltChange(e.target.value)}

              className="border-border bg-background"

            />

          </div>

        ) : null}



        <div className="flex flex-wrap items-center gap-2">

          <Button

            type="button"

            variant="outline"

            size="sm"

            className="rounded-xl border-border"

            disabled={disabled || testing}

            onClick={() => runTest()}

          >

            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}

            Test image

          </Button>

          <Button

            type="button"

            variant="ghost"

            size="sm"

            className="rounded-xl text-muted-foreground"

            disabled={disabled}

            onClick={() => {

              onChange("");

              setTestUrl(null);

              setTestError(null);

            }}

          >

            Clear

          </Button>

        </div>



        {testError ? <p className="text-sm font-medium text-destructive">{testError}</p> : null}



        <div className="space-y-1">

          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>

          <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-border bg-background">

            {previewSrc && isSafeImageSource(value.trim()) && !testError ? (

              bgBlur > 0 ? (

                <div className="absolute inset-0 overflow-hidden">

                  <div

                    className={cn(

                      "absolute inset-0",

                      bgBlur > 10 ? "scale-110" : "scale-105",

                    )}

                    style={{ transformOrigin: "center center" }}

                  >

                    {/* eslint-disable-next-line @next/next/no-img-element -- admin-only probe URL */}

                    <img

                      src={previewSrc}

                      alt=""

                      className="h-full w-full object-cover"

                      style={{ filter: `blur(${bgBlur}px)` }}

                    />

                  </div>

                </div>

              ) : (

                // eslint-disable-next-line @next/next/no-img-element -- admin-only probe URL

                <img src={previewSrc} alt="" className="h-full w-full object-contain" />

              )

            ) : (

              <ImageFallbackPlaceholder className="h-full min-h-[140px]" />

            )}

          </div>

        </div>

      </div>



      {enableMediaPicker ? (

        <MediaPickerDialog

          open={pickerOpen}

          onOpenChange={setPickerOpen}

          defaultFolder={mediaFolder}

          title={`Select image — ${label}`}

          onSelect={(url, asset) => {

            onChange(url);

            if (onAltChange && asset.alt && !altValue?.trim()) {

              onAltChange(asset.alt);

            }

            setTestUrl(previewUrl(url));

            setTestError(null);

          }}

        />

      ) : null}

    </>

  );

}

