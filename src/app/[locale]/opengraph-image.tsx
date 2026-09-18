import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

// next/og chay tren Edge runtime va nam trong goi Hobby mien phi cua Vercel:
// anh duoc render mot lan roi cache, khong ton cong cu thiet ke ben ngoai.
export const runtime = "edge";
export const alt = "Nagare Travel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "home" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #1b2a4a 0%, #2b3f66 55%, #7a5a2a 100%)",
          color: "#f7f5f1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, letterSpacing: 2 }}>
          <span style={{ fontWeight: 700 }}>NAGARE</span>
          <span style={{ color: "#e0a955" }}>TRAVEL</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.12, maxWidth: 960 }}>
            {t("heroTitle")}
          </div>
          <div style={{ fontSize: 28, color: "rgba(247,245,241,0.78)", maxWidth: 880 }}>
            {t("heroSubtitle")}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#e0a955", letterSpacing: 1 }}>
          Outbound · Inbound · Domestic
        </div>
      </div>
    ),
    size
  );
}
