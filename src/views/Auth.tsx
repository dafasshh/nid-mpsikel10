import { Footer, Logo } from "../components/Logo";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Gauge,
  Info,
  ShieldCheck,
  SquareKanban,
  UserRound,
  Users,
} from "lucide-react";
import { DEMO_PASSWORD, quickLogins, roleMeta, type Role, type User } from "../auth";

const roleIcons: Record<Role, typeof ShieldCheck> = {
  admin: ShieldCheck,
  manager: Users,
  member: UserRound,
};
const roleIconTone: Record<Role, string> = {
  admin: "bg-violet-50 text-violet-600",
  manager: "bg-indigo-50 text-indigo-600",
  member: "bg-emerald-50 text-emerald-600",
};

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen p-3 sm:p-4">
      <aside className="relative hidden w-[46%] max-w-[640px] flex-col justify-between overflow-hidden rounded-3xl bg-slate-900 p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-indigo-500/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-10 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <Logo size="md" tile />
          <div>
            <p className="font-semibold tracking-tight">SIM Tim</p>
            <p className="text-xs text-slate-400">Manajemen Tim & Alokasi Sumber Daya</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Kelola tim dan alokasi sumber daya dalam satu ruang kerja.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-slate-300">
            Pantau kapasitas setiap anggota, bagi tugas secara adil, dan pastikan setiap tenggat
            terpenuhi.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              { icon: Gauge, text: "Analitik beban kerja dengan ambang kapasitas" },
              { icon: SquareKanban, text: "Papan Kanban interaktif untuk seluruh tim" },
              { icon: ShieldCheck, text: "Hak akses berbasis peran: Admin, Manajer, Anggota" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative grid grid-cols-3 gap-3">
          {[
            { v: "5", l: "Proyek aktif", c: "text-sky-300" },
            { v: "72%", l: "Rata-rata kapasitas", c: "text-emerald-300" },
            { v: "16", l: "Tugas dipantau", c: "text-amber-300" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
            >
              <p className={`text-2xl font-semibold ${s.c}`}>{s.v}</p>
              <p className="mt-1 text-xs text-slate-400">{s.l}</p>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex flex-1 flex-col px-4 pt-10 pb-4">
        <div className="w-full max-w-[460px] m-auto py-6">
          <div className="mb-8 flex flex-col items-start gap-2">
            <Logo size="lg" tile className="px-4 py-3" />
            <p className="text-xs font-medium text-slate-400">
              SIM Tim · Manajemen Tim & Alokasi Sumber Daya
            </p>
          </div>
          {children}
        </div>
        <Footer className="mx-auto mt-8 w-full max-w-[460px] border-t border-slate-200/70 pt-5 lg:max-w-none" />
      </main>
    </div>
  );
}

const inputCls =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100";

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${inputCls} pr-12`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}

export function SignIn({
  users,
  onSignIn,
  onSwitch,
}: {
  users: User[];
  onSignIn: (u: User) => void;
  onSwitch: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError("Masukkan email dan kata sandi Anda.");
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) return setError("Email atau kata sandi tidak sesuai.");
    if (!user.active) return setError("Akun Anda sedang dinonaktifkan. Silakan hubungi Admin.");
    onSignIn(user);
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-semibold tracking-tight">Masuk ke akun Anda</h2>
      <p className="mt-2 text-sm text-slate-500">
        Selamat datang kembali. Silakan masukkan detail akun Anda.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@perusahaan.co.id"
            autoComplete="email"
            className={inputCls}
          />
        </Field>
        <Field label="Kata sandi">
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="Masukkan kata sandi"
            autoComplete="current-password"
          />
        </Field>
        {error && <ErrorBox message={error} />}
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Masuk
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="my-8 flex items-center gap-3 text-xs font-medium text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        atau masuk cepat dengan akun demo
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-2.5">
        {quickLogins.map(({ role, userId }) => {
          const u = users.find((x) => x.id === userId);
          const Icon = roleIcons[role];
          const usable = u && u.active;
          return (
            <button
              key={role}
              type="button"
              disabled={!usable}
              onClick={() => u && onSignIn(u)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_-12px_rgba(15,23,42,0.18)] disabled:pointer-events-none disabled:opacity-50"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${roleIconTone[role]}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                  Masuk sebagai {roleMeta[role].label}
                </span>
                <span className="block truncate text-xs text-slate-500">
                  {usable ? `${u.name} · ${u.email}` : "Akun demo tidak tersedia"}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-900" />
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">
        Kata sandi seluruh akun demo:{" "}
        <span className="font-semibold text-slate-600">{DEMO_PASSWORD}</span>
      </p>

      <p className="mt-8 text-center text-sm text-slate-500">
        Belum punya akun?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-slate-900 underline-offset-4 hover:underline"
        >
          Daftar sekarang
        </button>
      </p>
    </AuthLayout>
  );
}

export function SignUp({
  users,
  allowSignup,
  onSignUp,
  onSwitch,
}: {
  users: User[];
  allowSignup: boolean;
  onSignUp: (u: Omit<User, "id" | "active" | "joined">) => void;
  onSwitch: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password)
      return setError("Lengkapi seluruh kolom yang wajib diisi.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Format email tidak valid.");
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
      return setError("Email ini sudah terdaftar. Silakan masuk.");
    if (password.length < 6) return setError("Kata sandi minimal 6 karakter.");
    if (password !== confirm) return setError("Konfirmasi kata sandi tidak sama.");
    if (!agree) return setError("Anda perlu menyetujui Syarat & Ketentuan.");
    onSignUp({ name: name.trim(), email: email.trim(), password, role });
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-semibold tracking-tight">Buat akun baru</h2>
      <p className="mt-2 text-sm text-slate-500">
        Daftarkan diri Anda dan pilih peran sesuai tanggung jawab di tim.
      </p>

      {!allowSignup ? (
        <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white p-6 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-3 font-semibold">Pendaftaran sedang ditutup</p>
          <p className="mt-1 text-sm text-slate-500">
            Admin telah menonaktifkan pendaftaran akun baru. Silakan hubungi Admin untuk dibuatkan
            akun.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
          <Field label="Nama lengkap">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Andi Wijaya"
              autoComplete="name"
              className={inputCls}
            />
          </Field>
          <Field label="Email kantor">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@perusahaan.co.id"
              autoComplete="email"
              className={inputCls}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kata sandi" hint="Minimal 6 karakter">
              <PasswordInput
                value={password}
                onChange={setPassword}
                placeholder="Kata sandi"
                autoComplete="new-password"
              />
            </Field>
            <Field label="Konfirmasi kata sandi">
              <PasswordInput
                value={confirm}
                onChange={setConfirm}
                placeholder="Ulangi kata sandi"
                autoComplete="new-password"
              />
            </Field>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-slate-700">Pilih peran</legend>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {(Object.keys(roleMeta) as Role[]).map((r) => {
                const Icon = roleIcons[r];
                const selected = role === r;
                return (
                  <label
                    key={r}
                    className={`relative cursor-pointer rounded-2xl border bg-white p-3.5 transition ${
                      selected
                        ? "border-slate-900 ring-4 ring-slate-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={selected}
                      onChange={() => setRole(r)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${roleIconTone[r]}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="mt-3 block text-sm font-semibold">{roleMeta[r].label}</span>
                    <span className="mt-1 block text-[11px] leading-snug text-slate-500">
                      {roleMeta[r].description}
                    </span>
                    {selected && (
                      <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-slate-900 ring-4 ring-slate-100" />
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="flex items-start gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-slate-900"
            />
            Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi SIM Tim.
          </label>

          {error && <ErrorBox message={error} />}
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Buat akun
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-slate-900 underline-offset-4 hover:underline"
        >
          Masuk
        </button>
      </p>
    </AuthLayout>
  );
}
