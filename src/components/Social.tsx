import { site } from "@/lib/site";

const icons: Record<string, React.ReactNode> = {
  instagram: <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6ZM17.4 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />,
  tiktok: <path d="M14 3h3c.2 2.3 1.6 3.8 4 4v3c-1.5 0-2.9-.5-4-1.3V15a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V3Z" />,
  x: <path d="M4 3h4.6l4.1 5.8L17.6 3H20l-6.2 7.3L20.6 21H16l-4.4-6.2L6.3 21H4l6.5-7.6L4 3Z" />,
  linkedin: <path d="M5 3.5a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6ZM3.5 9h3v11.5h-3V9Zm5.5 0h2.9v1.6c.5-.9 1.7-1.9 3.6-1.9 3.4 0 4 2.2 4 5.1v6.7h-3v-6c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v6.1H9V9Z" />,
  facebook: <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4A20 20 0 0 0 14.3 4c-2.3 0-3.9 1.4-3.9 4v2.5H8v3h2.4V21h3.1Z" />,
};

export function Social({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`} aria-label="Social media">
      {site.socials.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className="grid h-10 w-10 place-items-center rounded-full border border-current/30 transition hover:bg-current/10"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">{icons[s.key]}</svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
