export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Status = "todo" | "inprogress" | "done";
export type View =
  | "dashboard"
  | "projects"
  | "team"
  | "tasks"
  | "workload"
  | "reports"
  | "users"
  | "mydash";

export interface Member {
  id: string;
  name: string;
  role: string;
  allocated: number;
  capacity: number;
  tone: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  dot: string;
  soft: string;
  progress: number;
  dueOffset: number;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  assignees: string[];
  priority: Priority;
  status: Status;
  /** Days relative to today; negative values are in the past. */
  dueOffset: number;
  comments: number;
  subtasks: [number, number];
}

export const members: Member[] = [
  {
    id: "hendra",
    name: "Hendra Kusuma",
    role: "Pengembang Backend",
    allocated: 40,
    capacity: 40,
    tone: "bg-violet-100 text-violet-700",
  },
  {
    id: "dani",
    name: "Dani Pratama",
    role: "Pengembang Frontend",
    allocated: 36,
    capacity: 40,
    tone: "bg-sky-100 text-sky-700",
  },
  {
    id: "siti",
    name: "Siti Rahmawati",
    role: "Desainer UI/UX",
    allocated: 30,
    capacity: 40,
    tone: "bg-pink-100 text-pink-700",
  },
  {
    id: "maya",
    name: "Maya Putri",
    role: "Analis Produk",
    allocated: 26,
    capacity: 40,
    tone: "bg-amber-100 text-amber-700",
  },
  {
    id: "rina",
    name: "Rina Wulandari",
    role: "Penjamin Mutu",
    allocated: 24,
    capacity: 40,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "agus",
    name: "Agus Setiawan",
    role: "Insinyur Infrastruktur",
    allocated: 18,
    capacity: 40,
    tone: "bg-orange-100 text-orange-700",
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    name: "Pembaruan Sistem Perbankan Inti",
    client: "Bank Nusantara",
    dot: "bg-indigo-500",
    soft: "bg-indigo-50 text-indigo-700",
    progress: 68,
    dueOffset: 24,
  },
  {
    id: "p2",
    name: "Portal Pengadaan Elektronik",
    client: "PT Sinar Logistik",
    dot: "bg-teal-500",
    soft: "bg-teal-50 text-teal-700",
    progress: 42,
    dueOffset: 38,
  },
  {
    id: "p3",
    name: "Aplikasi SDM Seluler",
    client: "Internal",
    dot: "bg-pink-500",
    soft: "bg-pink-50 text-pink-700",
    progress: 81,
    dueOffset: 12,
  },
  {
    id: "p4",
    name: "Migrasi Gudang Data",
    client: "PT Graha Retail",
    dot: "bg-amber-500",
    soft: "bg-amber-50 text-amber-700",
    progress: 55,
    dueOffset: 30,
  },
  {
    id: "p5",
    name: "Pusat Layanan Pelanggan",
    client: "Telko Prima",
    dot: "bg-sky-500",
    soft: "bg-sky-50 text-sky-700",
    progress: 27,
    dueOffset: 52,
  },
];

export const initialTasks: Task[] = [
  {
    id: "t1",
    title: "API rekonsiliasi gerbang pembayaran",
    projectId: "p1",
    assignees: ["hendra"],
    priority: "Critical",
    status: "inprogress",
    dueOffset: 1,
    comments: 8,
    subtasks: [3, 5],
  },
  {
    id: "t2",
    title: "Perbaikan batas waktu sesi pada alur transfer",
    projectId: "p1",
    assignees: ["hendra", "rina"],
    priority: "Critical",
    status: "todo",
    dueOffset: -1,
    comments: 5,
    subtasks: [0, 3],
  },
  {
    id: "t3",
    title: "Tata letak responsif untuk widget dasbor",
    projectId: "p3",
    assignees: ["dani"],
    priority: "High",
    status: "inprogress",
    dueOffset: 2,
    comments: 3,
    subtasks: [2, 4],
  },
  {
    id: "t4",
    title: "Desain ulang formulir pendaftaran vendor",
    projectId: "p2",
    assignees: ["siti"],
    priority: "High",
    status: "inprogress",
    dueOffset: 3,
    comments: 6,
    subtasks: [4, 6],
  },
  {
    id: "t5",
    title: "Logika status alur persetujuan",
    projectId: "p2",
    assignees: ["hendra"],
    priority: "High",
    status: "todo",
    dueOffset: 4,
    comments: 2,
    subtasks: [0, 4],
  },
  {
    id: "t6",
    title: "Migrasi proses ETL ke Airflow",
    projectId: "p4",
    assignees: ["agus"],
    priority: "Medium",
    status: "inprogress",
    dueOffset: 6,
    comments: 1,
    subtasks: [5, 9],
  },
  {
    id: "t7",
    title: "Rangkaian uji regresi untuk rilis 2.4",
    projectId: "p1",
    assignees: ["rina"],
    priority: "High",
    status: "todo",
    dueOffset: 2,
    comments: 4,
    subtasks: [1, 7],
  },
  {
    id: "t8",
    title: "Halaman pengajuan dan persetujuan cuti",
    projectId: "p3",
    assignees: ["dani", "siti"],
    priority: "Medium",
    status: "todo",
    dueOffset: 5,
    comments: 2,
    subtasks: [0, 5],
  },
  {
    id: "t9",
    title: "Laporan analitik SLA tiket",
    projectId: "p5",
    assignees: ["maya"],
    priority: "Medium",
    status: "todo",
    dueOffset: 7,
    comments: 0,
    subtasks: [0, 3],
  },
  {
    id: "t10",
    title: "Penskalaan otomatis klaster Kubernetes",
    projectId: "p4",
    assignees: ["agus"],
    priority: "Low",
    status: "done",
    dueOffset: -2,
    comments: 3,
    subtasks: [4, 4],
  },
  {
    id: "t11",
    title: "Audit token sistem desain",
    projectId: "p3",
    assignees: ["siti"],
    priority: "Low",
    status: "done",
    dueOffset: -3,
    comments: 5,
    subtasks: [6, 6],
  },
  {
    id: "t12",
    title: "Sintesis hasil wawancara pelanggan",
    projectId: "p5",
    assignees: ["maya"],
    priority: "Medium",
    status: "done",
    dueOffset: -1,
    comments: 7,
    subtasks: [3, 3],
  },
  {
    id: "t13",
    title: "Layanan notifikasi seluler",
    projectId: "p3",
    assignees: ["dani"],
    priority: "Critical",
    status: "inprogress",
    dueOffset: 0,
    comments: 9,
    subtasks: [2, 5],
  },
  {
    id: "t14",
    title: "Pembuat dokumen PDF faktur",
    projectId: "p2",
    assignees: ["hendra", "dani"],
    priority: "Medium",
    status: "todo",
    dueOffset: -2,
    comments: 1,
    subtasks: [1, 4],
  },
  {
    id: "t15",
    title: "Integrasi widget obrolan langsung",
    projectId: "p5",
    assignees: ["dani", "maya"],
    priority: "High",
    status: "todo",
    dueOffset: 8,
    comments: 2,
    subtasks: [0, 6],
  },
  {
    id: "t16",
    title: "Optimasi indeks basis data",
    projectId: "p4",
    assignees: ["hendra", "agus"],
    priority: "High",
    status: "done",
    dueOffset: -4,
    comments: 4,
    subtasks: [5, 5],
  },
];

export const statusLabels: Record<Status, string> = {
  todo: "Belum Dimulai",
  inprogress: "Sedang Dikerjakan",
  done: "Selesai",
};

export const priorityLabels: Record<Priority, string> = {
  Critical: "Kritis",
  High: "Tinggi",
  Medium: "Sedang",
  Low: "Rendah",
};

export const memberById = (id: string) => members.find((m) => m.id === id)!;
export const projectById = (id: string) => projects.find((p) => p.id === id)!;

export function dateFromOffset(offset: number) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

export function formatDate(
  offset: number,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" },
) {
  return dateFromOffset(offset).toLocaleDateString("id-ID", opts);
}

export type DueTone = "overdue" | "soon" | "normal" | "done";

export function dueInfo(task: Pick<Task, "dueOffset" | "status">): {
  label: string;
  tone: DueTone;
} {
  const o = task.dueOffset;
  if (task.status === "done") return { label: "Selesai", tone: "done" };
  if (o < 0) return { label: `Terlambat ${-o} hari`, tone: "overdue" };
  if (o === 0) return { label: "Hari ini", tone: "soon" };
  if (o === 1) return { label: "Besok", tone: "soon" };
  if (o <= 2) return { label: `${o} hari lagi`, tone: "soon" };
  return { label: formatDate(o), tone: "normal" };
}

export function isOverdue(task: Task) {
  return task.status !== "done" && task.dueOffset < 0;
}

export function capacity(member: Member) {
  const pct = Math.round((member.allocated / member.capacity) * 100);
  if (pct >= 90)
    return {
      pct,
      label: "Berlebih",
      bar: "bg-rose-500",
      text: "text-rose-600",
      badge: "bg-rose-50 text-rose-600 ring-rose-100",
    };
  if (pct >= 75)
    return {
      pct,
      label: "Hampir penuh",
      bar: "bg-amber-400",
      text: "text-amber-600",
      badge: "bg-amber-50 text-amber-700 ring-amber-100",
    };
  return {
    pct,
    label: "Aman",
    bar: "bg-emerald-500",
    text: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  };
}
