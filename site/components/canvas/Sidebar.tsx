import Link from "next/link";

/**
 * The rail. Wordmark, four chips, a copyright line at the foot.
 *
 * It is the only furniture on the page, which is the point: everything that
 * would normally be a header, a hero and a nav has been reduced to this, so
 * the board is what the visitor actually looks at. Four words of navigation
 * and four lines of prose is the whole budget.
 */
const NAV = [
  { label: "Work", href: "/", colour: "#1b2ed4" },
  { label: "Services", href: "/services", colour: "#f5a623" },
  { label: "Studio", href: "/studio", colour: "#8c2f3b" },
  { label: "Contact", href: "/contact", colour: "#1f3d2f" },
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[200px] flex-col justify-between border-r border-black/10 bg-white px-5 py-6 md:flex">
      <div>
        <Link href="/" className="block leading-[1.15]">
          <span className="block text-[13px] font-medium tracking-tight text-black">
            AMBER
          </span>
          <span className="block text-[13px] font-medium tracking-tight text-black/45">
            \ STUDIO
          </span>
        </Link>

        <nav className="mt-9 flex flex-col gap-1.5">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="group flex items-center gap-2.5 rounded-[3px] px-1 py-1 transition-colors hover:bg-black/[0.04]"
            >
              <span
                aria-hidden="true"
                className="size-[13px] shrink-0 rounded-[3px]"
                style={{ backgroundColor: n.colour }}
              />
              <span className="text-[11px] text-black/70 transition-colors group-hover:text-black">
                {n.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <p className="font-mono text-[9px] leading-relaxed tracking-[0.1em] text-black/35 uppercase">
        Amber Studio 2026
        <br />© All rights reserved
      </p>
    </aside>
  );
}
