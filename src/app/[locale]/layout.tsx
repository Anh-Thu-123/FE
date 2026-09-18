import type { Metadata } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Dung dung 3 font trong ban thiet ke (muc CSS cua khung-he-thong-nagare-v1.1.html):
// Bricolage Grotesque cho tieu de, Be Vietnam Pro cho noi dung, JetBrains Mono cho nhan/ma.
// Ca ba deu ho tro subset "vietnamese" de hien thi dau dung tren San.
const bodyFont = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
const displayFont = Bricolage_Grotesque({
  subsets: ["vietnamese", "latin"],
  variable: "--font-display",
  display: "swap",
});
const monoFont = JetBrains_Mono({
  subsets: ["vietnamese", "latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nagare Travel",
  description: "Nagare Travel - dong chay nhung hanh trinh Nhat Ban",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <NextIntlClientProvider locale={locale}>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
