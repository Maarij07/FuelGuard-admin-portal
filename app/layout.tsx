import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShellWrapper } from "./components/shell-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fuel Guard Admin",
  description: "Fuel Guard — IoT-Based Fuel Dispenser Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full flex bg-[#F9FAFB]">
        <ShellWrapper>{children}</ShellWrapper>
      </body>
    </html>
  );
}
