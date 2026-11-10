import { cx } from "@/lib/format";

interface FlourishProps {
  className?: string;
  variant?: "divider" | "corner" | "lotus" | "arch";
}

export function HeritageFlourish({ className, variant = "divider" }: FlourishProps) {
  if (variant === "lotus") {
    return (
      <div className={cx("flex items-center justify-center my-4 select-none", className)}>
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="text-brass">
          {/* Central Lotus Petal */}
          <path
            d="M24 2C24 2 27 9 27 15C27 18 25.5 20 24 20C22.5 20 21 18 21 15C21 9 24 2 24 2Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          {/* Left Petals */}
          <path
            d="M22 6C22 6 16 11 17 17C17.5 19.5 20 20 21 20C21 20 19 15 22 6Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          <path
            d="M17 12C17 12 11 15 13 19C14 20.5 16 20.5 17 20C17 20 15 17 17 12Z"
            fill="currentColor"
            fillOpacity="0.35"
          />
          {/* Right Petals */}
          <path
            d="M26 6C26 6 32 11 31 17C30.5 19.5 28 20 27 20C27 20 29 15 26 6Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          <path
            d="M31 12C31 12 37 15 35 19C34 20.5 32 20.5 31 20C31 20 33 17 31 12Z"
            fill="currentColor"
            fillOpacity="0.35"
          />
          {/* Horizontal delicate whisker lines */}
          <line x1="2" y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="30" y1="20" x2="46" y2="20" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5" />
          <circle cx="2" cy="20" r="1.5" fill="currentColor" fillOpacity="0.7" />
          <circle cx="46" cy="20" r="1.5" fill="currentColor" fillOpacity="0.7" />
        </svg>
      </div>
    );
  }

  // Regal Golden Divider with Indian Diamond Crest
  return (
    <div className={cx("flex items-center justify-center gap-3 my-6 select-none", className)}>
      <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent via-brass/60 to-brass" />
      <div className="flex items-center gap-1 text-brass">
        <span className="h-1.5 w-1.5 rotate-45 border border-brass bg-paper" />
        <span className="h-2.5 w-2.5 rotate-45 bg-brass/80 shadow-xs" />
        <span className="h-1.5 w-1.5 rotate-45 border border-brass bg-paper" />
      </div>
      <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-l from-transparent via-brass/60 to-brass" />
    </div>
  );
}
