import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secure Sign",
  description: "Generated by create next app",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Navbar */}
          <nav className="fixed top-0 left-0 right-0 bg-gray-300 bg-opacity-70 dark:bg-gray-800 dark:bg-opacity-70 p-4 flex justify-between items-center h-16 z-10 backdrop-blur">
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              Secure Sign
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <ThemeToggle />
            </div>
          </nav>

          {/* Main content */}
          <div className="">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
