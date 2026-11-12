import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  FolderKanban,
  LogOut,
  Search,
  Settings,
  SquareKanban,
  UserRound,
  X,
} from "lucide-react";
import { projects, projectById, type Task, type View } from "../data";
import { useClickOutside } from "./ui";
import { Logo } from "./Logo";
import { roleMeta, userInitials, type User } from "../auth";

const initialNotifications = [
  {
    id: 1,
    title: "Kapasitas Hendra Kusuma mencapai 100%",
    body: "2 tugas baru ditugaskan pada minggu ini.",
    time: "12 mnt lalu",
    tone: "bg-rose-500",
  },
  {
    id: 2,
    title: "Tugas kritis melewati tenggat",
    body: "Perbaikan batas waktu sesi pada alur transfer",
    time: "1 jam lalu",
    tone: "bg-orange-500",
  },
  {
    id: 3,
    title: "Siti memindahkan tugas ke Sedang Dikerjakan",
    body: "Desain ulang formulir pendaftaran vendor",
    time: "3 jam lalu",
    tone: "bg-sky-500",
  },
  {
    id: 4,
    title: "Laporan Iterasi 14 telah tersedia",
    body: "Ringkasan capaian mingguan berhasil dibuat.",
    time: "Kemarin",
    tone: "bg-emerald-500",
  },
];

export function Header({
  title,
  subtitle,
  query,
  onQuery,
  tasks,
  onNavigate,
  user,
  onLogout,
  canSeeTasks,
}: {
  title: string;
  subtitle: string;
  query: string;
  onQuery: (q: string) => void;
  tasks: Task[];
  onNavigate: (v: View) => void;
  user: User;
  onLogout: () => void;
  canSeeTasks: boolean;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unread, setUnread] = useState<number[]>([1, 2, 3]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  const searchRef = useClickOutside<HTMLDivElement>(searchOpen, closeSearch);
  const notifRef = useClickOutside<HTMLDivElement>(notifOpen, closeNotif);
  const profileRef = useClickOutside<HTMLDivElement>(profileOpen, closeProfile);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { tasks: [], projects: [] };
    return {
      tasks: canSeeTasks ? tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5) : [],
      projects: !canSeeTasks
        ? []
        : projects.filter((p) => `${p.name} ${p.client}`.toLowerCase().includes(q)).slice(0, 3),
    };
  }, [query, tasks, canSeeTasks]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hasResults = results.tasks.length + results.projects.length > 0;

  return (
    <header className="sticky top-3 z-30 mb-6 flex items-center gap-4 rounded-2xl border border-white/80 bg-white/65 px-4 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:px-5">
      <Logo size="md" className="shrink-0 sm:hidden" />
      <div className="min-w-0 flex-1 lg:flex-none">
        <p className="hidden text-xs font-medium text-slate-500 sm:block">{subtitle}</p>
        <h1 className="truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h1>
      </div>

      <div ref={searchRef} className="relative mx-auto hidden w-full max-w-md md:block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            onQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Cari tugas, proyek..."
          className="h-11 w-full rounded-full border border-slate-200/80 bg-white/80 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
        />
        {query && (
          <button
            type="button"
            aria-label="Hapus pencarian"
            onClick={() => onQuery("")}
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {searchOpen && canSeeTasks && query.trim() && (
          <div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-2 shadow-xl shadow-slate-900/10">
            {!hasResults && (
              <p className="px-3 py-4 text-center text-sm text-slate-500">
                Tidak ada tugas atau proyek yang cocok dengan “{query}”.
              </p>
            )}
            {results.tasks.length > 0 && (
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Tugas
              </p>
            )}
            {results.tasks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onNavigate("tasks");
                  setSearchOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-50"
              >
                <SquareKanban className="h-4 w-4 text-slate-400" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                  {t.title}
                </span>
                <span className="text-xs text-slate-400">{projectById(t.projectId).name}</span>
              </button>
            ))}
            {results.projects.length > 0 && (
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Proyek
              </p>
            )}
            {results.projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onNavigate("projects");
                  setSearchOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-slate-50"
              >
                <FolderKanban className="h-4 w-4 text-slate-400" />
                <span className="flex-1 truncate text-sm font-medium text-slate-800">{p.name}</span>
                <span className="text-xs text-slate-400">{p.client}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 lg:ml-0">
        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-label="Notifikasi"
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 transition hover:text-slate-900"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {unread.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                {unread.length}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-900/10">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold">Notifikasi</p>
                <button
                  type="button"
                  onClick={() => setUnread([])}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:text-slate-300"
                  disabled={!unread.length}
                >
                  Tandai semua telah dibaca
                </button>
              </div>
              <ul className="max-h-80 overflow-y-auto p-2">
                {initialNotifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => setUnread((u) => u.filter((id) => id !== n.id))}
                      className="flex w-full gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50"
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${unread.includes(n.id) ? n.tone : "bg-slate-200"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm ${unread.includes(n.id) ? "font-semibold text-slate-900" : "font-medium text-slate-600"}`}
                        >
                          {n.title}
                        </span>
                        <span className="block truncate text-xs text-slate-500">{n.body}</span>
                      </span>
                      <span className="shrink-0 text-[11px] text-slate-400">{n.time}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white py-1 pl-1 pr-3 transition hover:border-slate-300"
            aria-expanded={profileOpen}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-xs font-semibold text-white">
              {userInitials(user.name)}
            </span>
            <span className="hidden text-left lg:block">
              <span className="block text-sm font-semibold leading-tight text-slate-900">
                {user.name}
              </span>
              <span className="block text-[11px] leading-tight text-slate-500">
                {roleMeta[user.role].label}
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-2 shadow-xl shadow-slate-900/10">
              <div className="px-3 py-2.5">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${roleMeta[user.role].tone}`}
                >
                  {roleMeta[user.role].label}
                </span>
              </div>
              <div className="my-1 h-px bg-slate-100" />
              {[
                { label: "Profil Saya", icon: UserRound },
                { label: "Pengaturan Ruang Kerja", icon: Settings },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={closeProfile}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  {label}
                </button>
              ))}
              <div className="my-1 h-px bg-slate-100" />
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
