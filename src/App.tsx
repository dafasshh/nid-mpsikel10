import { Footer } from "./components/Logo";
import { useEffect, useState } from "react";
import { initialTasks, type Status, type Task, type View } from "./data";
import {
  loadSession,
  loadSettings,
  loadUsers,
  resetUsers,
  roleMeta,
  saveSession,
  saveSettings,
  saveUsers,
  type Settings,
  type User,
} from "./auth";
import { Header } from "./components/Header";
import { MobileNav, Sidebar } from "./components/Sidebar";
import { Dashboard } from "./views/Dashboard";
import { Kanban } from "./views/Kanban";
import { ProjectsView, ReportsView, TeamView, WorkloadView } from "./views/Secondary";
import { SignIn, SignUp } from "./views/Auth";
import { UsersView } from "./views/Users";
import { MemberDashboard } from "./views/MemberDashboard";

const titles: Record<View, { title: string; subtitle: string }> = {
  dashboard: { title: "Dasbor", subtitle: "Ringkasan kinerja tim dan proyek" },
  mydash: { title: "Dasbor", subtitle: "Ringkasan tugas pribadi Anda" },
  users: { title: "Pengguna", subtitle: "Kelola akun, peran, dan pengaturan sistem" },
  projects: { title: "Proyek", subtitle: "Seluruh proyek klien yang sedang berjalan" },
  team: { title: "Tim", subtitle: "Anggota, peran, dan ketersediaan" },
  tasks: { title: "Tugas", subtitle: "Seret kartu antarkolom untuk memperbarui status" },
  workload: { title: "Beban Kerja", subtitle: "Perencanaan kapasitas untuk minggu ini" },
  reports: { title: "Laporan", subtitle: "Metrik dan tren penyelesaian pekerjaan" },
};

export default function App() {
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [sessionId, setSessionId] = useState<string | null>(loadSession);
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [authPage, setAuthPage] = useState<"signin" | "signup">("signin");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");

  const user = users.find((u) => u.id === sessionId && u.active) ?? null;
  const views = user ? roleMeta[user.role].views : [];
  const [view, setView] = useState<View>(() => (user ? roleMeta[user.role].home : "dashboard"));

  useEffect(() => saveUsers(users), [users]);
  useEffect(() => saveSettings(settings), [settings]);

  // Keep the current view inside the role's permitted pages (e.g. after a role change).
  useEffect(() => {
    if (user && !views.includes(view)) setView(roleMeta[user.role].home);
  }, [user, views, view]);

  const navigate = (v: View) => {
    if (!views.includes(v)) return;
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const signIn = (u: User) => {
    saveSession(u.id);
    setSessionId(u.id);
    setQuery("");
    setView(roleMeta[u.role].home);
  };

  const signOut = () => {
    saveSession(null);
    setSessionId(null);
    setAuthPage("signin");
  };

  const signUp = (data: Omit<User, "id" | "active" | "joined">) => {
    const created: User = {
      ...data,
      id: `u${Date.now()}`,
      active: true,
      joined: new Date().toISOString().slice(0, 10),
    };
    setUsers((prev) => [...prev, created]);
    signIn(created);
  };

  const moveTask = (id: string, status: Status) =>
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (!task || task.status === status) return prev;
      // Anggota Tim may only change the status of tasks assigned to them.
      if (user?.role === "member" && !(user.memberId && task.assignees.includes(user.memberId)))
        return prev;
      return [...prev.filter((t) => t.id !== id), { ...task, status }];
    });

  const addTask = (task: Omit<Task, "id">) =>
    setTasks((prev) => [{ ...task, id: `t${Date.now()}` }, ...prev]);

  if (!user) {
    return authPage === "signin" ? (
      <SignIn users={users} onSignIn={signIn} onSwitch={() => setAuthPage("signup")} />
    ) : (
      <SignUp
        users={users}
        allowSignup={settings.allowSignup}
        onSignUp={signUp}
        onSwitch={() => setAuthPage("signin")}
      />
    );
  }

  const isMember = user.role === "member";

  return (
    <div className="flex min-h-screen">
      <Sidebar view={view} views={views} onNavigate={navigate} onLogout={signOut} />
      <main className="min-w-0 flex-1 px-4 pb-24 sm:pb-10 sm:pr-8 sm:pl-2">
        <Header
          {...titles[view]}
          query={query}
          onQuery={setQuery}
          tasks={tasks}
          onNavigate={navigate}
          user={user}
          onLogout={signOut}
          canSeeTasks={views.includes("tasks")}
        />
        {view === "dashboard" && (
          <Dashboard tasks={tasks} onNavigate={navigate} userName={user.name} />
        )}
        {view === "mydash" && (
          <MemberDashboard
            tasks={tasks}
            name={user.name}
            memberId={user.memberId}
            onMove={moveTask}
            onNavigate={navigate}
          />
        )}
        {view === "users" && (
          <UsersView
            users={users}
            currentId={user.id}
            query={query}
            settings={settings}
            onUpdate={(id, patch) =>
              setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
            }
            onDelete={(id) => setUsers((prev) => prev.filter((u) => u.id !== id))}
            onSettings={setSettings}
            onReset={() => {
              const fresh = resetUsers();
              setUsers(fresh);
              if (!fresh.some((u) => u.id === user.id)) signOut();
            }}
          />
        )}
        {view === "tasks" && (
          <Kanban
            key={user.id}
            tasks={tasks}
            query={query}
            onClearQuery={() => setQuery("")}
            onMove={moveTask}
            onAdd={addTask}
            canAdd={!isMember}
            restrictTo={isMember ? (user.memberId ?? "") : undefined}
          />
        )}
        {view === "projects" && <ProjectsView tasks={tasks} query={query} />}
        {view === "team" && <TeamView tasks={tasks} />}
        {view === "workload" && <WorkloadView tasks={tasks} />}
        {view === "reports" && <ReportsView tasks={tasks} />}
        <Footer className="mt-10 border-t border-slate-200/70 pt-6" />
      </main>
      <MobileNav view={view} views={views} onNavigate={navigate} />
    </div>
  );
}
