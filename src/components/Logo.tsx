import { useState } from "react";
import logoSrc from "../assets/nid-logo.png";

/**
 * Global N.I.D. branding config. Every placement (sidebar, header, auth, modals, footer)
 * reads from here so the logo stays consistent across the whole app.
 */
export const BRAND = {
  // Bundled locally (cropped to the wordmark) so it loads even when external hosts are blocked.
  logoUrl: logoSrc,
  name: "N.I.D.",
  credit: "Developed by N.I.D. Core",
  product: "SIM Tim",
};

const widths = {
  xs: "w-14", // footer
  sm: "w-[60px]", // sidebar / modal corner
  md: "w-24", // mobile header
  lg: "w-40 sm:w-48", // auth pages
};

/**
 * Renders the pre-cropped N.I.D. wordmark at a fixed aspect ratio so every placement stays proportional.
 */
export function Logo({
  size = "sm",
  tile = false,
  className = "",
}: {
  size?: keyof typeof widths;
  tile?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const mark = (
    <span className={`relative block aspect-[392/106] shrink-0 ${widths[size]}`}>
      {failed ? (
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold tracking-tight text-slate-900">
          {BRAND.name}
        </span>
      ) : (
        <img
          src={BRAND.logoUrl}
          alt={`Logo ${BRAND.name}`}
          draggable={false}
          onError={() => setFailed(true)}
          className="block h-full w-full select-none object-contain"
        />
      )}
    </span>
  );
  if (!tile) return <span className={`inline-flex ${className}`}>{mark}</span>;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl bg-white px-2.5 py-2.5 shadow-sm ring-1 ring-slate-200/70 ${className}`}
    >
      {mark}
    </span>
  );
}

export function Footer({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row ${className}`}
    >
      <div className="flex items-center gap-3">
        <Logo size="xs" />
        <span className="h-4 w-px bg-slate-200" />
        <span className="font-medium text-slate-600">{BRAND.credit}</span>
      </div>
      <span className="text-center text-slate-400">
        © {new Date().getFullYear()} {BRAND.product} · Sistem Manajemen Tim & Alokasi Sumber Daya
      </span>
    </footer>
  );
}
