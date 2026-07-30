import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import ClientLayout from "@/components/LayoutClient";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#ee6b4d",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Motive | Micro-Motive Games",
  description:
    "A local-first workspace for discovering, refining, and exporting the small motives that make you come alive.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
