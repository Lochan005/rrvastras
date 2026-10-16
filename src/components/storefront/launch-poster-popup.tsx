"use client";

import { useEffect, useState, type ComponentType } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { LaunchPosterStageProps } from "./launch-poster-stage";

export type LaunchPosterFrequency = "session" | "always";

export interface LaunchPosterPopupProps {
  /** "session" shows once per browser tab. "always" shows on each full page load. */
  frequency?: LaunchPosterFrequency;
  /** Change this to show the popup again in the same session. */
  storageKey?: string;
  posterSrc?: string;
  carpetSrc?: string;
  posterAlt?: string;
  /** When false, the popup stays hidden. */
  enabled?: boolean;
}

const DEFAULT_POSTER_SRC = "/promo/grand-launch-poster.jpg";
const DEFAULT_CARPET_SRC = "/promo/magic-carpet.svg";
const DEFAULT_STORAGE_KEY = "rrvastras.launch-poster";

const shownThisDocument = new Set<string>();
let assetWarmup: Promise<void> | null = null;

function documentId(frequency: LaunchPosterFrequency, storageKey: string) {
  return `${frequency}:${storageKey}`;
}

function canShow(frequency: LaunchPosterFrequency, storageKey: string) {
  if (shownThisDocument.has(documentId(frequency, storageKey))) return false;
  if (frequency === "always") return true;
  try {
    return window.sessionStorage.getItem(storageKey) !== "seen";
  } catch {
    return true;
  }
}

function remember(frequency: LaunchPosterFrequency, storageKey: string) {
  shownThisDocument.add(documentId(frequency, storageKey));
  if (frequency !== "session") return;
  try {
    window.sessionStorage.setItem(storageKey, "seen");
  } catch {
    // Private mode can block storage. The in-memory set still covers this document.
  }
}

function preloadImage(src: string, timeoutMs = 2500) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    image.onload = () => {
      image.decode().then(finish).catch(finish);
    };
    image.onerror = finish;
    image.src = src;
    if (image.complete) {
      image.decode().then(finish).catch(finish);
    }
  });
}

function warmAssets(posterSrc: string, carpetSrc: string) {
  assetWarmup ??= Promise.all([
    preloadImage(posterSrc),
    preloadImage(carpetSrc),
    import("./launch-poster-stage"),
  ])
    .then(() => undefined)
    .catch((error: unknown) => {
      assetWarmup = null;
      throw error;
    });
  return assetWarmup;
}

export function LaunchPosterPopup({
  frequency = "session",
  storageKey = DEFAULT_STORAGE_KEY,
  posterSrc = DEFAULT_POSTER_SRC,
  carpetSrc = DEFAULT_CARPET_SRC,
  posterAlt,
  enabled = true,
}: LaunchPosterPopupProps) {
  const [open, setOpen] = useState(false);
  const [Stage, setStage] = useState<ComponentType<LaunchPosterStageProps> | null>(
    null
  );

  useEffect(() => {
    if (!enabled) return;
    if (!canShow(frequency, storageKey)) return;

    let active = true;
    warmAssets(posterSrc, carpetSrc)
      .then(() => import("./launch-poster-stage"))
      .then((mod) => {
        if (!active || !canShow(frequency, storageKey)) return;
        remember(frequency, storageKey);
        setStage(() => mod.LaunchPosterStage);
        setOpen(true);
      })
      .catch(() => {
        // A failed asset chunk should not trap the page behind an empty dialog.
      });

    return () => {
      active = false;
    };
  }, [carpetSrc, enabled, frequency, posterSrc, storageKey]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) setOpen(false);
      }}
    >
      {open && Stage ? (
        <Stage posterSrc={posterSrc} carpetSrc={carpetSrc} posterAlt={posterAlt} />
      ) : null}
    </Dialog.Root>
  );
}
