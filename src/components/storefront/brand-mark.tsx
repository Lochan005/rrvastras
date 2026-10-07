import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
}: {
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <Link href="/" aria-label="RR Vastras home" className="flex items-center">
      <Image
        src="/logo.png"
        alt="RR Vastras"
        width={1024}
        height={341}
        className={cn(
          "h-auto w-auto object-contain",
          compact
            ? "max-h-[5.76rem] lg:max-h-24"
            : "max-h-[3.6rem] lg:max-h-[3.6rem]"
        )}
        priority
      />
    </Link>
  );
}
