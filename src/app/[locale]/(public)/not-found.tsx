import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function PublicNotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
      <p className="font-[family-name:var(--font-heading)] text-7xl font-bold text-gradient-brand">
        404
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-bold">
        {t("title")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("desc")}</p>
      <Button className="mt-7 rounded-full" render={<Link href="/" />}>
        {t("home")}
      </Button>
    </div>
  );
}
