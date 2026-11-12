import type { View } from "./data";

export type Role = "admin" | "manager" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  /** Prototype only: stored in plain text in localStorage. Real auth belongs in the CodeIgniter backend. */
  password: string;
  role: Role;
  /** Links an account to a team member in the sample task data. */
  memberId?: string;
  active: boolean;
  joined: string;
}

export const roleMeta: Record<
  Role,
  { label: string; description: string; home: View; views: View[]; tone: string }
> = {
  admin: {
    label: "Admin",
    description: "Mengelola pengguna, hak akses, dan pengaturan sistem.",
    home: "users",
    views: ["users", "dashboard", "projects", "team", "tasks", "workload", "reports"],
    tone: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  manager: {
    label: "Manajer Proyek",
    description: "Membuat proyek, mengatur tim, membagi tugas, dan memantau beban kerja.",
    home: "dashboard",
    views: ["dashboard", "projects", "team", "tasks", "workload", "reports"],
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  },
  member: {
    label: "Anggota Tim",
    description: "Mengerjakan tugas dan memperbarui status di papan Kanban.",
    home: "mydash",
    views: ["mydash", "tasks", "projects", "team"],
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
};

export const DEMO_PASSWORD = "demo123";

const demoUsers: User[] = [
  {
    id: "u-admin",
    name: "Rizky Hidayat",
    email: "admin@simtim.co.id",
    password: DEMO_PASSWORD,
    role: "admin",
    active: true,
    joined: "2024-01-08",
  },
  {
    id: "u-budi",
    name: "Budi Santoso",
    email: "budi.santoso@simtim.co.id",
    password: DEMO_PASSWORD,
    role: "manager",
    active: true,
    joined: "2024-02-12",
  },
  {
    id: "u-dani",
    name: "Dani Pratama",
    email: "dani.pratama@simtim.co.id",
    password: DEMO_PASSWORD,
    role: "member",
    memberId: "dani",
    active: true,
    joined: "2024-03-04",
  },
  {
    id: "u-hendra",
    name: "Hendra Kusuma",
    email: "hendra.kusuma@simtim.co.id",
    password: DEMO_PASSWORD,
    role: "member",
    memberId: "hendra",
    active: true,
    joined: "2024-03-04",
  },
  {
    id: "u-siti",
    name: "Siti Rahmawati",
    email: "siti.rahmawati@simtim.co.id",
    password: DEMO_PASSWORD,
    role: "member",
    memberId: "siti",
    active: true,
    joined: "2024-04-15",
  },
  {
    id: "u-maya",
    name: "Maya Putri",
    email: "maya.putri@simtim.co.id",
    password: DEMO_PASSWORD,
    role: "member",
    memberId: "maya",
    active: true,
    joined: "2024-05-20",
  },
  {
    id: "u-rina",
    name: "Rina Wulandari",
    email: "rina.wulandari@simtim.co.id",
    password: DEMO_PASSWORD,
    role: "member",
    memberId: "rina",
    active: true,
    joined: "2024-06-03",
  },
  {
    id: "u-agus",
    name: "Agus Setiawan",
    email: "agus.setiawan@simtim.co.id",
    password: DEMO_PASSWORD,
    role: "member",
    memberId: "agus",
    active: false,
    joined: "2024-07-22",
  },
];

export const quickLogins: { role: Role; userId: string }[] = [
  { role: "admin", userId: "u-admin" },
  { role: "manager", userId: "u-budi" },
  { role: "member", userId: "u-dani" },
];

const USERS_KEY = "simtim.users";
const SESSION_KEY = "simtim.session";
const SETTINGS_KEY = "simtim.settings";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const loadUsers = () => read<User[]>(USERS_KEY, demoUsers);
export const saveUsers = (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
export const resetUsers = () => {
  localStorage.removeItem(USERS_KEY);
  return demoUsers;
};

export const loadSession = () => read<string | null>(SESSION_KEY, null);
export const saveSession = (id: string | null) =>
  id ? localStorage.setItem(SESSION_KEY, JSON.stringify(id)) : localStorage.removeItem(SESSION_KEY);

export interface Settings {
  allowSignup: boolean;
}
export const loadSettings = () => read<Settings>(SETTINGS_KEY, { allowSignup: true });
export const saveSettings = (s: Settings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));

export const userInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
