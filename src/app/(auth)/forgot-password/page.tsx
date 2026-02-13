"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@/hooks/useForm";
import { isValidEmail } from "@/lib/email-validation-client";

const initialValues = { email: "" };

function validate(values: typeof initialValues) {
  const errors: Partial<Record<keyof typeof initialValues, string>> = {};
  if (!values.email?.trim()) errors.email = "Email is required.";
  else if (!isValidEmail(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  return errors;
}

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const form = useForm({
    initialValues,
    validate,
    onSubmit: async (values) => {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        form.setError(data.error || "Something went wrong.");
        return;
      }
      setSent(true);
    },
  });

  if (sent) {
    return (
      <div className="w-full text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          Check your email
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          If an account exists, we&apos;ve sent a password reset link to{" "}
          <strong>{form.values.email}</strong>
        </p>
        <Link
          href="/login"
          className="text-sm text-[var(--foreground)] hover:underline font-medium"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          Forgot password?
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Enter your email and we&apos;ll send you a reset link
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
            name="email"
            type="email"
            value={form.values.email}
            onChange={form.handleChange("email")}
            className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all"
            placeholder="Email"
          />
        </div>

        <button
          type="submit"
          disabled={form.loading}
          className="w-full h-12 bg-[var(--foreground)] text-[var(--background)] text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
        >
          {form.loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        Remember your password?{" "}
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
