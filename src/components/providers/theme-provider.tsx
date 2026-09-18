"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes da la dependency va sonner.tsx da goi useTheme(), nhung truoc day
 * khong co provider nao nen bang mau `.dark` trong globals.css khong bao gio
 * duoc kich hoat. Provider nay bat che do toi len va dong bo voi cai dat he thong.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      // Nagare dung mot ban sac sang duy nhat. Bang mau .dark van con trong
      // globals.css - doi defaultTheme="system" + enableSystem la bat lai duoc.
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
