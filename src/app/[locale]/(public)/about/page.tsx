import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/public/reveal";
import { GrowthChart } from "@/components/public/growth-chart";
import {
  Users,
  Wallet,
  CalendarClock,
  TrendingUp,
  Music4,
  Palette,
  Camera,
  Wifi,
  MapPin,
  Phone,
  Mail,
  Globe,
} from "lucide-react";

export const revalidate = 3600;

export default async function AboutPage() {
  const t = await getTranslations("about");

  const stats = [
    { icon: CalendarClock, label: t("statExperience"), value: "3" },
    { icon: Wallet, label: t("statCapital"), value: "800 triệu ₫" },
    { icon: Users, label: t("statStaff"), value: "22" },
    { icon: TrendingUp, label: t("statTours"), value: "127" },
  ];

  const org = [
    { name: t("orgBgd"), desc: t("orgBgdDesc") },
    { name: t("orgOps"), desc: t("orgOpsDesc") },
    { name: t("orgSales"), desc: t("orgSalesDesc") },
  ];

  const ecosystem = [
    { name: t("ecoOutbound"), desc: t("ecoOutboundDesc") },
    { name: t("ecoInbound"), desc: t("ecoInboundDesc") },
    { name: t("ecoDomestic"), desc: t("ecoDomesticDesc") },
  ];

  const services = [
    { icon: Music4, name: t("svcIdol"), desc: t("svcIdolDesc") },
    { icon: Palette, name: t("svcWorkshop"), desc: t("svcWorkshopDesc") },
    { icon: Camera, name: t("svcPhoto"), desc: t("svcPhotoDesc") },
    { icon: Wifi, name: t("svcSim"), desc: t("svcSimDesc") },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-accent/5 to-background">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, oklch(0.7 0.13 75 / 25%), transparent 45%), radial-gradient(circle at 85% 75%, oklch(0.36 0.09 255 / 20%), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 text-center">
          <Reveal>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-4">{t("kicker")}</p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-heading)]">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">{t("heroSubtitle")}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border bg-card/70 backdrop-blur p-5">
                  <s.icon className="h-6 w-6 text-primary mx-auto mb-2" strokeWidth={1.5} />
                  <div className="text-2xl font-bold font-[family-name:var(--font-heading)]">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="mx-auto max-w-5xl px-4 py-16 grid md:grid-cols-2 gap-8">
        <Reveal>
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-3">{t("visionTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("visionBody")}</p>
            </CardContent>
          </Card>
        </Reveal>
        <Reveal delay={0.1}>
          <Card className="h-full border-accent/40">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-3">{t("missionTitle")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("missionBody")}</p>
            </CardContent>
          </Card>
        </Reveal>
      </section>

      {/* Growth chart */}
      <section className="mx-auto max-w-5xl px-4 py-16 border-t">
        <Reveal>
          <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] mb-1">{t("growthTitle")}</h2>
          <p className="text-muted-foreground mb-8">{t("growthLede")}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <GrowthChart />
        </Reveal>
      </section>

      {/* Org structure */}
      <section className="mx-auto max-w-5xl px-4 py-16 border-t">
        <Reveal>
          <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] mb-8">{t("orgTitle")}</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {org.map((o, i) => (
            <Reveal key={o.name} delay={i * 0.1}>
              <div className="rounded-xl border p-5 h-full bg-card">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono font-bold mb-3">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-1">{o.name}</h3>
                <p className="text-sm text-muted-foreground">{o.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Ecosystem */}
      <section className="mx-auto max-w-5xl px-4 py-16 border-t">
        <Reveal>
          <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] mb-8">{t("ecosystemTitle")}</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {ecosystem.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.1}>
              <div className="rounded-xl border p-5 h-full bg-gradient-to-br from-secondary to-transparent">
                <h3 className="font-semibold mb-1.5">{e.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{e.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Signature services */}
      <section className="mx-auto max-w-5xl px-4 py-16 border-t">
        <Reveal>
          <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] mb-8">{t("servicesTitle")}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <div className="rounded-xl border p-5 h-full text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-card">
                <s.icon className="h-7 w-7 text-brand mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="font-semibold text-sm mb-1">{s.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-5xl px-4 py-16 border-t pb-24">
        <Reveal>
          <h2 className="text-2xl font-semibold font-[family-name:var(--font-heading)] mb-8">{t("contactTitle")}</h2>
          <div className="rounded-2xl border bg-primary text-primary-foreground p-8 grid sm:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 mt-0.5 opacity-80" />
              <p className="text-sm leading-relaxed">{t("contactAddress")}</p>
            </div>
            <div className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 mt-0.5 opacity-80" />
              <div className="text-sm">
                <div className="opacity-70">{t("contactHotline")}</div>
                <div className="font-semibold">0378 131 063</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 mt-0.5 opacity-80" />
              <div className="text-sm">
                <div className="opacity-70">{t("contactEmail")}</div>
                <div className="font-semibold">contact@nagare-vietnhat.com</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Globe className="h-5 w-5 shrink-0 mt-0.5 opacity-80" />
              <div className="text-sm">
                <div className="opacity-70">{t("contactFanpage")}</div>
                <div className="font-semibold">Du lịch Nagare Việt Nhật</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
