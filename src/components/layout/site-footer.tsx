import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone } from "lucide-react";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  const explore = [
    { href: "/tours", label: tNav("tours") },
    { href: "/tour-requests/new", label: tNav("customTour") },
    { href: "/my-bookings", label: tNav("myBookings") },
  ] as const;

  const company = [{ href: "/about", label: tNav("about") }] as const;

  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-[family-name:var(--font-heading)] text-lg font-bold text-primary">
              Nagare<span className="text-accent">.</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          <FooterColumn title={t("explore")} links={explore} />
          <FooterColumn title={t("company")} links={company} />

          <div>
            <h2 className="text-sm font-semibold text-foreground">{t("contact")}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                <span>Kintsugi Kyoto – Kanazawa</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-accent" aria-hidden />
                <a className="hover:text-foreground" href="mailto:info@nagare.travel">
                  info@nagare.travel
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-accent" aria-hidden />
                <a className="hover:text-foreground" href="tel:+842839999999">
                  +84 28 3999 9999
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Nagare Travel. {t("rights")}</p>
          <p className="font-mono tracking-wide">Outbound · Inbound · Domestic</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
