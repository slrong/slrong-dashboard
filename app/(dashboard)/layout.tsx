import Link from "next/link";
import { logoutAction } from "@/app/login/actions";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/todos", label: "할일" },
  { href: "/memos", label: "메모" },
  { href: "/board", label: "게시판" },
  { href: "/calendar", label: "일정" },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <nav className="flex gap-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-neutral-600 transition hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-neutral-400 transition hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              로그아웃
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
