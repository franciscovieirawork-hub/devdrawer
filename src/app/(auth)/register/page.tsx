"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "@/hooks/useForm";
import { validatePassword } from "@/lib/password-validation-client";
import { isValidEmail } from "@/lib/email-validation-client";

const initialValues = {
  username: "",
  email: "",
  password: "",
};

function validate(values: typeof initialValues) {
  const errors: Partial<Record<keyof typeof initialValues, string>> = {};
  if (!values.username?.trim()) errors.username = "Username is required.";
  else if (values.username.length < 3)
    errors.username = "Username must be at least 3 characters.";
  else if (!/^[a-zA-Z0-9_]+$/.test(values.username))
    errors.username = "Username can only contain letters, numbers and underscores.";
  if (!values.email?.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(values.email))
    errors.email = "Please enter a valid email address.";
  if (!values.password) errors.password = "Password is required.";
  else {
    const p = validatePassword(values.password);
    if (!p.isValid) errors.password = p.error;
  }
  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm({
    initialValues,
    validate,
    onSubmit: async (values) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        form.setError(data.error || "Something went wrong.");
        return;
      }
      router.push("/dashboard");
    },
  });

  return (
    <div className="w-full">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          Create account
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Start planning your projects today
        </p>
      </div>

      {form.error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm text-center lg:text-left">
          {form.error}
        </div>
      )}

      <form onSubmit={form.handleSubmit} className="space-y-4">
        <div>
          <input
            name="username"
            type="text"
            value={form.values.username}
            onChange={form.handleChange("username")}
            className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
            placeholder="Username"
          />
        </div>

        <div>
          <input
            name="email"
            type="email"
            value={form.values.email}
            onChange={form.handleChange("email")}
            className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
            placeholder="Email"
          />
        </div>

        <div>
          <input
            name="password"
            type="password"
            value={form.values.password}
            onChange={form.handleChange("password")}
            className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
            placeholder="Password (min 10 chars: uppercase, lowercase, number, special)"
          />
        </div>

        <button
          type="submit"
          disabled={form.loading}
          className="w-full h-12 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
        >
          {form.loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[var(--foreground)] hover:underline font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
