import { Logo } from "./Logo";
import {
  ChartColumn,
  FolderKanban,
  Gauge,
  LayoutGrid,
  LogOut,
  ShieldCheck,
  SquareKanban,
  Users,
} from "lucide-react";
import type { View } from "../data";

const allNavItems: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: "users", label: "Pengguna", icon: ShieldCheck },
  { id: "mydash", label: "Dasbor", icon: LayoutGrid },
  { id: "dashboard", label: "Dasbor", icon: LayoutGrid },
  { id: "projects", label: "Proyek", icon: FolderKanban },
  { id: "team", label: "Tim", icon: Users },
  { id: "tasks", label: "Tugas", icon: SquareKanban },
  { id: "workload", label: "Beban Kerja", icon: Gauge },
  { id: "reports", label: "Laporan", icon: ChartColumn },
];

function NavButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition ${
        active
          ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
          : "text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm"
      }`}
    >
      {children}
      <span className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

const itemsFor = (views: View[]) => views.map((v) => allNavItems.find((i) => i.id === v)!);

export function Sidebar({
  view,
  views,
  onNavigate,
  onLogout,
}: {
  view: View;
  views: View[];
  onNavigate: (v: View) => void;
  onLogout: () => void;
}) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[84px] shrink-0 flex-col items-center py-6 sm:flex">
      <button
        type="button"
        onClick={() => onNavigate(views[0])}
        className="mb-10 flex flex-col items-center"
        aria-label="Beranda SIM Tim"
      >
        <Logo size="sm" tile />
      </button>
      <nav className="flex flex-1 flex-col items-center gap-2 rounded-full border border-slate-200/70 bg-white/60 p-2 backdrop-blur">
        {itemsFor(views).map(({ id, label, icon: Icon }) => (
          <NavButton key={id} label={label} active={view === id} onClick={() => onNavigate(id)}>
            <Icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
          </NavButton>
        ))}
      </nav>
      <div className="mt-6 flex flex-col items-center gap-2">
        <NavButton label="Keluar" onClick={onLogout}>
          <LogOut className="h-[19px] w-[19px]" strokeWidth={1.8} />
        </NavButton>
      </div>
    </aside>
  );
}

export function MobileNav({
  view,
  views,
  onNavigate,
}: {
  view: View;
  views: View[];
  onNavigate: (v: View) => void;
}) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-between rounded-2xl border border-slate-200/70 bg-white/80 p-1.5 shadow-lg backdrop-blur-xl sm:hidden">
      {itemsFor(views).map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onNavigate(id)}
          aria-label={label}
          className={`flex h-11 flex-1 items-center justify-center rounded-xl ${view === id ? "bg-slate-900 text-white" : "text-slate-500"}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </button>
      ))}
    </nav>
  );
}
