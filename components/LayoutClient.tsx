"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}
