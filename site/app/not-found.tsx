import Link from "next/link"

export default function NotFound() {
  return (
    <div className="u-100vh u-v-center-center vertical-m bg-background">
      <h1 className="text-xl u-text-semibold">Nothing on the desk here</h1>
      <p className="text-sm text-muted-foreground">
        This file has been moved or never existed. The work is all back on the desk.
      </p>
      <Link href="/" className="text-sm underline" style={{ color: "var(--amber-blue)" }}>
        Back to Amber Studio
      </Link>
    </div>
  )
}
