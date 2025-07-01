"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

interface ShadcnProviderProps {
  children: React.ReactNode;
  navigate?: (href: string, options?: Record<string, unknown>) => void;
}

export function ShadcnProvider({ children }: ShadcnProviderProps) {
  const router = useRouter();


  return <div>{children}</div>;
}
