"use client";

import { useEffect } from "react";

/** Publishes measured site header height to `--site-header-height` on :root. */
export function useSiteHeaderHeight(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const setHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${el.offsetHeight}px`
      );
    };

    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(el);
    window.addEventListener("resize", setHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setHeight);
    };
  }, [ref]);
}
