"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreatePlannerPopover } from "@/components/CreatePlannerPopover";
import { PlannerCardMenu } from "@/components/PlannerCardMenu";
import Footer from "@/components/Footer";

interface Planner {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  username: string;
}

type SortBy = "date" | "name";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, plannersRes] = await Promise.all([
        fetch("/api/me"),
        fetch("/api/planner"),
      ]);

      if (!userRes.ok) {
        router.push("/login");
        return;
      }

      const userData = await userRes.json();
      const plannersData = await plannersRes.json();

      setUser(userData.user);
      setPlanners(plannersData.planners || []);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (renaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renaming]);

  const sortedPlanners = [...planners].sort((a, b) => {
    if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/planner/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPlanners((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  async function handleDuplicate(id: string) {
    setDuplicating(id);
    try {
      const res = await fetch(`/api/planner/${id}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setPlanners((prev) => [data.planner, ...prev]);
        router.push(`/planner/${data.planner.id}`);
      }
    } finally {
      setDuplicating(null);
    }
  }

  function handleRenameClick(id: string) {
    const planner = planners.find((p) => p.id === id);
    if (planner) {
      setRenaming(id);
      setRenameValue(planner.title);
    }
  }

  async function handleRenameSave(id: string) {
    const newTitle = renameValue.trim();
    if (!newTitle) {
      setRenaming(null);
      return;
    }

    try {
      const res = await fetch(`/api/planner/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (res.ok) {
        const data = await res.json();
        setPlanners((prev) =>
          prev.map((p) => (p.id === id ? { ...p, title: data.planner.title } : p))
        );
      }
    } finally {
      setRenaming(null);
      setRenameValue("");
    }
  }

  function handleCreated(planner: { id: string; title: string }) {
    router.push(`/planner/${planner.id}`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--foreground)] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Hello, {user?.username}
          </h2>
          <p className="text-[var(--muted-foreground)] mt-1">Your planners</p>
        </div>
        <CreatePlannerPopover onCreated={handleCreated} />
      </div>

      {/* Sort controls */}
      {planners.length > 0 && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-[var(--muted-foreground)]">Sort by</span>
          <button
            onClick={() => setSortBy("date")}
            className={`h-7 px-3 text-xs font-medium rounded-lg transition-colors ${
              sortBy === "date"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            Date
          </button>
          <button
            onClick={() => setSortBy("name")}
            className={`h-7 px-3 text-xs font-medium rounded-lg transition-colors ${
              sortBy === "name"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            Name
          </button>
        </div>
      )}

      {/* Content */}
      {planners.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)]">
          <svg
            className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <p className="text-[var(--muted-foreground)] mb-1">
            No planners yet
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Click <span className="font-medium text-[var(--foreground)]">New Planner</span> to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPlanners.map((planner) => (
            <div
              key={planner.id}
              className="group relative p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30 transition-all"
            >
              {renaming === planner.id ? (
                <input
                  ref={renameInputRef}
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRenameSave(planner.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRenameSave(planner.id);
                    } else if (e.key === "Escape") {
                      setRenaming(null);
                      setRenameValue("");
                    }
                  }}
                  className="w-full px-2 py-1 text-sm font-semibold text-[var(--card-foreground)] bg-[var(--background)] border border-[var(--accent)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  placeholder={planner.title}
                />
              ) : (
                <>
                  <Link
                    href={`/planner/${planner.id}`}
                    className="block"
                  >
                    <h3 className="font-semibold text-[var(--card-foreground)] pr-8">
                      {planner.title}
                    </h3>
                    {planner.description && (
                      <p className="text-sm text-[var(--muted-foreground)] mt-1.5 line-clamp-2">
                        {planner.description}
                      </p>
                    )}
                    <p className="text-xs text-[var(--muted-foreground)] mt-4">
                      {new Date(planner.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </Link>

                  {/* Menu */}
                  <div className="absolute top-3 right-3">
                    <PlannerCardMenu
                      plannerId={planner.id}
                      onRename={() => handleRenameClick(planner.id)}
                      onDuplicate={() => handleDuplicate(planner.id)}
                      onDelete={() => handleDelete(planner.id)}
                      isDeleting={deleting === planner.id}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
}
