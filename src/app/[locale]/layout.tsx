import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Dung dung 3 font trong ban thiet ke (muc CSS cua khung-he-thong-nagare-v1.1.html):
// Bricolage Grotesque cho tieu de, Be Vietnam Pro cho noi dung, JetBrains Mono cho nhan/ma.
// Ca ba deu ho tro subset "vietnamese" de hien thi dau dung tren San.
const bodyFont = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
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

/**
 * metadataBase bat buoc phai co thi Next moi dung duoc duong dan tuong doi cho
 * anh OG. Tren Vercel, VERCEL_PROJECT_PRODUCTION_URL duoc bom san va mien phi.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : new URL("http://localhost:3000");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    metadataBase: siteUrl,
    title: {
      default: "Nagare Travel",
      template: "%s · Nagare Travel",
    },
    description: t("heroSubtitle"),
    applicationName: "Nagare Travel",
    openGraph: {
      type: "website",
      siteName: "Nagare Travel",
      title: t("heroTitle"),
      description: t("heroSubtitle"),
      locale: locale === "ja" ? "ja_JP" : "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: t("heroTitle"),
      description: t("heroSubtitle"),
    },
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  };
}

// P5 Layout: khong khoa zoom (WCAG 1.4.4); themeColor doi theo che do sang/toi.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#191d24" },
  ],
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
    <html
      lang={locale}
      // next-themes ghi class vao <html> truoc khi React hydrate -> can co cai nay.
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        {/* Ca hai deu nam trong goi Hobby mien phi cua Vercel. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
