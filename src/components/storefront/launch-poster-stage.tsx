"use client";

import { useRef } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(MotionPathPlugin, useGSAP);

const POSTER_ALT =
  "RR Vastras grand website launch. Shop your vibe. 17 October 2026. Celebrate with flat 40% off on your favourite sarees. Free shipping all over Karnataka. Shop online at www.rrvastras.in.";

const FLIGHT_START = 0.05;
const FLIGHT_DURATION = 1.5;
const UNROLL_START = 1.42;
const UNROLL_DURATION = 0.84;
const CLOSE_START = 2.16;

export interface LaunchPosterStageProps {
  posterSrc: string;
  carpetSrc: string;
  posterAlt?: string;
}

export function LaunchPosterStage(props: LaunchPosterStageProps) {
  return (
    <Dialog.Portal>
      <PosterScene {...props} />
    </Dialog.Portal>
  );
}

function PosterScene({
  posterSrc,
  carpetSrc,
  posterAlt = POSTER_ALT,
}: LaunchPosterStageProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const carpetRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const rollTopRef = useRef<HTMLDivElement>(null);
  const rollBottomRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const allowDismissRef = useRef(false);

  useGSAP(() => {
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const path = pathRef.current;
    const flight = flightRef.current;
    const spin = spinRef.current;
    const floatEl = floatRef.current;
    const carpet = carpetRef.current;
    const frame = frameRef.current;
    const mask = maskRef.current;
    const sheen = sheenRef.current;
    const shadow = shadowRef.current;
    const rollTop = rollTopRef.current;
    const rollBottom = rollBottomRef.current;
    const close = closeRef.current;
    if (
      !overlay ||
      !stage ||
      !path ||
      !flight ||
      !spin ||
      !floatEl ||
      !carpet ||
      !frame ||
      !mask ||
      !sheen ||
      !shadow ||
      !rollTop ||
      !rollBottom ||
      !close
    ) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const revealPoster = () => {
      gsap.set(flight, { autoAlpha: 0 });
      gsap.set(mask, { autoAlpha: 0 });
      gsap.set(frame, {
        "--unfold-y": "0%",
        "--unfold-x": "0%",
        "--unfold-r": "0px",
        pointerEvents: "none",
      });
      gsap.set([rollTop, rollBottom, sheen], { autoAlpha: 0 });
      gsap.set(frame, { pointerEvents: "none" });
      const tl = gsap.timeline({ defaults: { ease: "power1.out" } });
      tl.to(overlay, { autoAlpha: 1, duration: 0.28 }, 0);
      tl.to(mask, { autoAlpha: 1, duration: 0.28 }, 0);
      tl.to(shadow, { autoAlpha: 1, duration: 0.28 }, 0);
      tl.to(close, { autoAlpha: 1, duration: 0.22 }, 0.06);
      tl.set(frame, { pointerEvents: "auto" }, 0.06);
      tl.call(() => {
        allowDismissRef.current = true;
      }, [], 0.06);
      return tl;
    };

    try {
      if (reduced) {
        revealPoster();
        return;
      }

      const stageRect = stage.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      const svg = path.ownerSVGElement;
      if (svg) {
        svg.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);
        svg.setAttribute("preserveAspectRatio", "none");
      }
      const carpetWidth = carpet.offsetWidth || (mobile ? 260 : 520);
      const carpetHeight = carpet.offsetHeight || carpetWidth / 2.46;
      const posterWidth = frame.offsetWidth;
      const posterHeight = frame.offsetHeight;

      if (!stageRect.width || !stageRect.height || !posterWidth || !posterHeight) {
        revealPoster();
        return;
      }

      const endX = frameRect.left + frameRect.width / 2 - stageRect.left;
      const endY = frameRect.top + frameRect.height / 2 - stageRect.top;
      const verticalRoom = Math.max(48, stageRect.height * (mobile ? 0.1 : 0.18));
      const start = {
        x: -carpetWidth * (mobile ? 0.72 : 0.62),
        y: endY + stageRect.height * (mobile ? 0.03 : 0.05),
      };
      const controlA = {
        x: stageRect.width * (mobile ? 0.05 : 0.16),
        y: Math.min(stageRect.height - carpetHeight * 0.2, endY + verticalRoom),
      };
      const controlB = {
        x: endX - stageRect.width * (mobile ? 0.04 : 0.12),
        y: Math.max(carpetHeight * 0.2, endY - verticalRoom * 0.85),
      };
      path.setAttribute(
        "d",
        `M ${start.x} ${start.y} C ${controlA.x} ${controlA.y}, ${controlB.x} ${controlB.y}, ${endX} ${endY}`
      );

      const yInset = Math.min(
        46,
        Math.max(0, (1 - carpetHeight / posterHeight) / 2) * 100
      );
      const xInset = Math.min(
        24,
        Math.max(0, (1 - carpetWidth / posterWidth) / 2) * 100
      );

      gsap.set(flight, {
        autoAlpha: 1,
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
          end: 0,
        },
      });
      gsap.set(spin, {
        rotation: mobile ? -14 : -22,
        scale: mobile ? 0.8 : 0.62,
        transformOrigin: "50% 50%",
      });
      gsap.set(floatEl, { y: 0 });
      gsap.set(mask, { autoAlpha: 0 });
      gsap.set(frame, {
        "--unfold-y": `${yInset}%`,
        "--unfold-x": `${xInset}%`,
        "--unfold-r": "26px",
        pointerEvents: "none",
      });
      gsap.set([rollTop, rollBottom], { autoAlpha: 0 });
      gsap.set([close, shadow, sheen], { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      tl.to(overlay, { autoAlpha: 1, duration: 0.42, ease: "power1.out" }, 0);
      tl.to(
        flight,
        {
          duration: FLIGHT_DURATION,
          ease: "power2.out",
          motionPath: {
            path,
            align: path,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
        },
        FLIGHT_START
      );
      tl.to(
        spin,
        {
          keyframes: [
            {
              rotation: mobile ? 8 : 15,
              scale: mobile ? 0.92 : 0.84,
              duration: FLIGHT_DURATION * 0.46,
              ease: "sine.inOut",
            },
            {
              rotation: mobile ? -3 : -5,
              scale: 1,
              duration: FLIGHT_DURATION * 0.34,
              ease: "sine.inOut",
            },
            {
              rotation: 0,
              scale: 1,
              duration: FLIGHT_DURATION * 0.2,
              ease: "power1.inOut",
            },
          ],
        },
        FLIGHT_START
      );
      tl.to(
        floatEl,
        {
          keyframes: [
            { y: mobile ? -7 : -12, duration: 0.36, ease: "sine.inOut" },
            { y: mobile ? 5 : 8, duration: 0.4, ease: "sine.inOut" },
            { y: mobile ? -4 : -6, duration: 0.34, ease: "sine.inOut" },
            { y: 0, duration: 0.28, ease: "power1.out" },
          ],
        },
        FLIGHT_START + 0.08
      );

      tl.to(flight, { autoAlpha: 0, duration: 0.32, ease: "power1.in" }, UNROLL_START);
      tl.to(mask, { autoAlpha: 1, duration: 0.18, ease: "power1.out" }, UNROLL_START);
      tl.to(
        frame,
        {
          "--unfold-y": "0%",
          "--unfold-x": "0%",
          "--unfold-r": "0px",
          duration: UNROLL_DURATION,
          ease: "power2.inOut",
        },
        UNROLL_START
      );
      tl.to(rollTop, { autoAlpha: 1, duration: 0.12, ease: "power1.out" }, UNROLL_START);
      tl.to(rollBottom, { autoAlpha: 1, duration: 0.12, ease: "power1.out" }, UNROLL_START);
      tl.to(
        [rollTop, rollBottom],
        { autoAlpha: 0, duration: 0.2, ease: "power1.in" },
        UNROLL_START + UNROLL_DURATION - 0.18
      );
      tl.fromTo(
        sheen,
        { xPercent: -30, autoAlpha: 0 },
        { xPercent: 260, autoAlpha: 0.45, duration: 0.62, ease: "power1.inOut" },
        UNROLL_START + 0.12
      );
      tl.to(sheen, { autoAlpha: 0, duration: 0.16 }, UNROLL_START + 0.62);
      tl.fromTo(
        frame,
        { scale: 0.985 },
        { scale: 1, duration: 0.4, ease: "power2.out", transformOrigin: "50% 50%" },
        UNROLL_START + UNROLL_DURATION - 0.28
      );
      tl.to(shadow, { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, UNROLL_START + 0.45);
      tl.fromTo(
        close,
        { autoAlpha: 0, y: -8, scale: 0.92 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: "power2.out" },
        CLOSE_START
      );
      tl.set(frame, { pointerEvents: "auto" }, CLOSE_START);
      tl.call(() => {
        allowDismissRef.current = true;
      }, [], CLOSE_START);
    } catch {
      revealPoster();
    }
  });

  return (
    <>
      <Dialog.Overlay
        ref={overlayRef}
        className="fixed inset-0 z-[80] bg-[#14040a]/75 opacity-0"
      />
      <Dialog.Content
        ref={stageRef}
        className="fixed inset-0 z-[80] overflow-hidden outline-none select-none focus:outline-none"
        style={{ pointerEvents: "none" }}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          stageRef.current?.focus();
        }}
        onPointerDownOutside={(event) => {
          if (!allowDismissRef.current) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (!allowDismissRef.current) event.preventDefault();
        }}
      >
        <Dialog.Title className="sr-only">RR Vastras grand website launch</Dialog.Title>
        <Dialog.Description className="sr-only">
          Flat 40% off on sarees and free shipping all over Karnataka for the 17
          October 2026 launch.
        </Dialog.Description>

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <path ref={pathRef} fill="none" />
        </svg>

        <div
          ref={flightRef}
          className="pointer-events-none absolute top-0 left-0 z-10 w-[min(74vw,320px)] invisible md:w-[min(48vw,600px)]"
        >
          <div ref={spinRef}>
            <div ref={floatRef}>
              <Image
                ref={carpetRef}
                src={carpetSrc}
                alt=""
                width={1280}
                height={520}
                unoptimized
                aria-hidden
                draggable={false}
                className="pointer-events-none h-auto w-full select-none drop-shadow-[0_18px_16px_rgba(20,0,8,0.45)]"
              />
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none flex h-full w-full items-center justify-center"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top))",
            paddingRight: "max(0.75rem, env(safe-area-inset-right))",
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
            paddingLeft: "max(0.75rem, env(safe-area-inset-left))",
          }}
        >
          <div ref={frameRef} className="pointer-events-none relative max-h-full w-fit max-w-full">
            <div
              ref={shadowRef}
              aria-hidden
              className="pointer-events-none absolute inset-x-[8%] -bottom-3 h-8 rounded-full bg-[#1a050c]/55 opacity-0 blur-lg"
            />
            <div
              ref={maskRef}
              className="relative overflow-hidden opacity-0"
              style={{
                clipPath:
                  "inset(var(--unfold-y, 46%) var(--unfold-x, 8%) var(--unfold-y, 46%) var(--unfold-x, 8%) round var(--unfold-r, 26px))",
              }}
            >
              <Image
                src={posterSrc}
                alt={posterAlt}
                width={1024}
                height={1024}
                unoptimized
                draggable={false}
                className="block h-auto w-auto max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1.5rem)] max-w-[min(720px,calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-1.5rem))]"
              />
              <div
                ref={sheenRef}
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-0"
              >
                <div className="h-full w-full -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-soft-light" />
              </div>
            </div>
            <div
              ref={rollTopRef}
              aria-hidden
              className="pointer-events-none absolute right-[4%] left-[4%] h-3.5 -translate-y-1/2 rounded-full opacity-0"
              style={{
                top: "var(--unfold-y, 46%)",
                background:
                  "linear-gradient(#fff1c4, #e8c26a 18%, #6e1830 42%, #2a0612 68%, #e8c26a 86%, #4a1020)",
                boxShadow: "0 8px 12px rgba(20,0,8,0.38), inset 0 1px 0 rgba(255,255,255,0.55)",
              }}
            />
            <div
              ref={rollBottomRef}
              aria-hidden
              className="pointer-events-none absolute right-[4%] left-[4%] h-3.5 -translate-y-1/2 rounded-full opacity-0"
              style={{
                top: "calc(100% - var(--unfold-y, 46%))",
                background:
                  "linear-gradient(#fff1c4, #e8c26a 18%, #6e1830 42%, #2a0612 68%, #e8c26a 86%, #4a1020)",
                boxShadow: "0 8px 12px rgba(20,0,8,0.38), inset 0 1px 0 rgba(255,255,255,0.55)",
              }}
            />
            <div ref={closeRef} className="absolute top-2.5 right-2.5 z-30 opacity-0">
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close promotion"
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-[0_8px_20px_rgba(20,0,8,0.35)] ring-1 ring-gold transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </Dialog.Close>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </>
  );
}
