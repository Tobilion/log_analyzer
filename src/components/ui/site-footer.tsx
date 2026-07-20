"use client"

// site-footer.tsx — "Built by Tobiloba Jagun" footer with hover-reveal links.
// Deps: lucide-react + Tailwind only (no clsx/tailwind-merge needed).

import { useState } from "react"
import { Github, Globe, Linkedin, LucideIcon } from "lucide-react"

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

interface FooterLink {
  icon: LucideIcon
  href: string
  label: string
}

const LINKS: FooterLink[] = [
  { icon: Github, href: "https://github.com/Tobilion", label: "GitHub" },
  { icon: Globe, href: "https://tobiloba-jagun-portfolio.vercel.app/", label: "Portfolio" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/tobiloba-jagun/", label: "LinkedIn" },
]

export const NameReveal = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <span
      className="relative inline-flex h-8 w-44 justify-center align-middle"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-label="Tobiloba Jagun — show links"
        className={cn(
          "relative h-8 w-44 rounded-3xl px-3 flex items-center justify-center",
          "bg-white dark:bg-black text-black dark:text-white",
          "border border-black/10 dark:border-white/10",
          "text-sm font-semibold underline underline-offset-4 decoration-dotted",
          "transition-all duration-300",
          isOpen ? "pointer-events-none opacity-0" : "opacity-100"
        )}
      >
        Tobiloba Jagun
      </button>

      <span className="absolute inset-0 flex h-8 w-44 justify-center overflow-hidden rounded-3xl">
        {LINKS.map((link, index) => {
          const Icon = link.icon
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
              tabIndex={isOpen ? 0 : -1}
              className={cn(
                "flex h-8 flex-1 items-center justify-center",
                "bg-black dark:bg-white text-white dark:text-black",
                "border-r border-white/10 last:border-r-0 dark:border-black/10",
                "hover:bg-gray-900 dark:hover:bg-gray-100",
                index === 0 && "rounded-l-3xl",
                index === LINKS.length - 1 && "rounded-r-3xl",
                "transition-all duration-200",
                index === 1 && "delay-[50ms]",
                index === 2 && "delay-100",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "pointer-events-none -translate-x-full opacity-0"
              )}
            >
              <Icon className="size-4" />
            </a>
          )
        })}
      </span>
    </span>
  )
}

export default function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "w-full border-t border-black/10 dark:border-white/10",
        "flex items-center justify-center gap-2 py-4 px-4",
        "text-sm text-gray-600 dark:text-gray-400",
        className
      )}
    >
      <span>Built by</span>
      <NameReveal />
    </footer>
  )
}
