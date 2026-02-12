"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token, router]);

  if (status === "loading") {
    return (
      <div className="w-full text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start mb-4">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border)]" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--foreground)] animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          Verifying email...
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Please wait while we verify your email address.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full text-center lg:text-left">
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          Email verified!
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          Your email has been verified successfully. Redirecting to dashboard...
        </p>
        <Link
          href="/dashboard"
          className="text-sm text-[var(--foreground)] hover:underline font-medium"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full text-center lg:text-left">
      <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--foreground)] mb-2">
        Verification failed
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mb-6">
        This verification link is invalid or has expired.
      </p>
      <Link
        href="/login"
        className="text-sm text-[var(--foreground)] hover:underline font-medium"
      >
        Go to login
      </Link>
    </div>
  );
}
