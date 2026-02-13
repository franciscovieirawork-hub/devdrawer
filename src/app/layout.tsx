import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalLoader } from "@/components/GlobalLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevDrawer — Plan, Draw, Build",
  description:
    "Interactive whiteboard and planner for developers. Plan, draw, sketch and organize your software projects.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <GlobalLoader />
          {children}
        </ThemeProvider>
        <div className="absolute bottom-0 left-0 w-full p-4 text-center text-sm text-[var(--muted-foreground)]">
          <p className="text-xs text-[var(--muted-foreground)]">created by <a className="text-[var(--foreground)] hover:underline" href="https://f-vdev.vercel.app/" target="_blank" rel="noopener noreferrer">fvdev</a> for devs.</p>
        </div>
      </body>
    </html>
  );
}
