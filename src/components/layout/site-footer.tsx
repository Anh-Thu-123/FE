export function SiteFooter() {
  return (
    <footer className="border-t mt-16 py-8 text-sm text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Nagare Travel. All rights reserved.</p>
        <p>Kintsugi Kyoto - Kanazawa | Outbound / Inbound / Domestic tours</p>
      </div>
    </footer>
  );
}
