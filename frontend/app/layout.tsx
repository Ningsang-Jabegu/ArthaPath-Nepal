import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
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
  title: "ArthaPath - Investment Planning Simplified",
  description: "Smart investment planning and portfolio management for Nepal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="antialiased transition-colors duration-200"
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-primary)',
        }}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('arthapath-theme');
                const html = document.documentElement;
                if (theme && theme !== 'system') {
                  html.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    html.classList.add('dark');
                  }
                } else {
                  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (isDark) {
                    html.setAttribute('data-theme', 'dark');
                    html.classList.add('dark');
                  }
                }
              })()
            `,
          }}
        />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
