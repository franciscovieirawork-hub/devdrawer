"use client";

import { useState, useRef, useEffect } from "react";

interface PlannerCardMenuProps {
  plannerId: string;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export function PlannerCardMenu({
  onRename,
  onDuplicate,
  onDelete,
  isDeleting,
}: PlannerCardMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-all"
        title="More options"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 p-1 rounded-lg border border-[var(--border)] bg-[var(--card-popup)] shadow-lg z-50">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
              onRename();
            }}
            className="w-full px-3 py-2 text-left text-sm text-[var(--foreground)] rounded-md hover:bg-[var(--muted)] transition-colors"
          >
            Rename
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
              onDuplicate();
            }}
            className="w-full px-3 py-2 text-left text-sm text-[var(--foreground)] rounded-md hover:bg-[var(--muted)] transition-colors"
          >
            Duplicate
          </button>
          <div className="h-px bg-[var(--border)] my-1" />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            disabled={isDeleting}
            className="w-full px-3 py-2 text-left text-sm text-[var(--destructive)] rounded-md hover:bg-[var(--muted)] transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
