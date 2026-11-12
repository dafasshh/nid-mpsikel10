import { RotateCcw, ShieldCheck, Trash2, UserRound, Users } from "lucide-react";
import { roleMeta, userInitials, type Role, type Settings, type User } from "../auth";
import { Card } from "../components/ui";

export function UserAvatar({ name, role }: { name: string; role: Role }) {
  const tone = {
    admin: "bg-violet-100 text-violet-700",
    manager: "bg-indigo-100 text-indigo-700",
    member: "bg-emerald-100 text-emerald-700",
  }[role];
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${tone}`}
    >
      {userInitials(name)}
    </span>
  );
}

export function UsersView({
  users,
  currentId,
  query,
  settings,
  onUpdate,
  onDelete,
  onSettings,
  onReset,
}: {
  users: User[];
  currentId: string;
  query: string;
  settings: Settings;
  onUpdate: (id: string, patch: Partial<User>) => void;
  onDelete: (id: string) => void;
  onSettings: (s: Settings) => void;
  onReset: () => void;
}) {
  const q = query.trim().toLowerCase();
  const list = users.filter((u) => !q || `${u.name} ${u.email}`.toLowerCase().includes(q));
  const count = (r: Role) => users.filter((u) => u.role === r).length;

  const stats = [
    {
      label: "Total pengguna",
      value: users.length,
      note: `${users.filter((u) => u.active).length} aktif`,
      icon: Users,
      tone: "bg-slate-100 text-slate-700",
    },
    {
      label: "Admin",
      value: count("admin"),
      note: "Akses penuh sistem",
      icon: ShieldCheck,
      tone: "bg-violet-50 text-violet-600",
    },
    {
      label: "Manajer Proyek",
      value: count("manager"),
      note: "Pengelola proyek",
      icon: Users,
      tone: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Anggota Tim",
      value: count("member"),
      note: "Pelaksana tugas",
      icon: UserRound,
      tone: "bg-emerald-50 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon, tone }) => (
          <Card key={label} className="p-6">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="mt-6 text-sm font-medium text-slate-500">{label}</p>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-4xl font-semibold tracking-tight tabular-nums">{value}</p>
              <p className="text-xs font-medium text-slate-500">{note}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Kelola Pengguna</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Atur peran dan status akses setiap akun
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">Pengguna</th>
                  <th className="px-3 py-3">Peran</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Bergabung</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((u) => {
                  const self = u.id === currentId;
                  return (
                    <tr key={u.id} className="transition hover:bg-slate-50/60">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={u.name} role={u.role} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900">
                              {u.name}
                              {self && (
                                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="truncate text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <select
                          value={u.role}
                          disabled={self}
                          onChange={(e) => onUpdate(u.id, { role: e.target.value as Role })}
                          aria-label={`Peran ${u.name}`}
                          className={`h-8 rounded-full px-3 text-xs font-semibold outline-none ring-1 ring-inset disabled:cursor-not-allowed ${roleMeta[u.role].tone}`}
                        >
                          {(Object.keys(roleMeta) as Role[]).map((r) => (
                            <option key={r} value={r}>
                              {roleMeta[r].label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3.5">
                        <button
                          type="button"
                          disabled={self}
                          onClick={() => onUpdate(u.id, { active: !u.active })}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition disabled:cursor-not-allowed ${
                            u.active
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${u.active ? "bg-emerald-500" : "bg-slate-400"}`}
                          />
                          {u.active ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>
                      <td className="px-3 py-3.5 text-xs text-slate-500">
                        {new Date(u.joined).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          type="button"
                          disabled={self}
                          onClick={() => window.confirm(`Hapus akun ${u.name}?`) && onDelete(u.id)}
                          aria-label={`Hapus ${u.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                      Tidak ada pengguna yang cocok dengan “{query}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold tracking-tight">Pengaturan Sistem</h2>
            <p className="mt-0.5 text-sm text-slate-500">Konfigurasi akses ruang kerja</p>
            <div className="mt-5 flex items-start justify-between gap-4 rounded-2xl border border-slate-100 p-4">
              <div>
                <p className="text-sm font-semibold">Pendaftaran akun baru</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Izinkan pengguna mendaftar sendiri melalui halaman Daftar.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.allowSignup}
                aria-label="Pendaftaran akun baru"
                onClick={() => onSettings({ ...settings, allowSignup: !settings.allowSignup })}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${settings.allowSignup ? "bg-slate-900" : "bg-slate-200"}`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${settings.allowSignup ? "left-[22px]" : "left-0.5"}`}
                />
              </button>
            </div>
            <div className="mt-3 flex items-start justify-between gap-4 rounded-2xl border border-slate-100 p-4">
              <div>
                <p className="text-sm font-semibold">Pulihkan data demo</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Kembalikan daftar pengguna ke kondisi awal purwarupa.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  window.confirm("Pulihkan seluruh data pengguna ke kondisi awal?") && onReset()
                }
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Pulihkan
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold tracking-tight">Matriks Hak Akses</h2>
            <ul className="mt-4 space-y-3">
              {(Object.keys(roleMeta) as Role[]).map((r) => (
                <li key={r} className="rounded-2xl bg-slate-50 p-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${roleMeta[r].tone}`}
                  >
                    {roleMeta[r].label}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {roleMeta[r].description}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
