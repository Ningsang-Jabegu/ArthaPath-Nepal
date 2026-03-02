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
      <body className="antialiased bg-(--color-background) text-(--color-text-primary) transition-colors duration-200">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('arthapath-theme');
                if (theme && theme !== 'system') {
                  document.documentElement.setAttribute('data-theme', theme);
                } else if (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.setAttribute('data-theme', 'dark');
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
