import Link from "next/link";
import { getTodos } from "@/lib/actions/todos";
import { getMemos } from "@/lib/actions/memos";
import { getPosts } from "@/lib/actions/posts";
import { getUpcomingEvents } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const calendarConfigured = !!process.env.GOOGLE_CALENDAR_ICS_URL;
  const [todos, memos, posts, events] = await Promise.all([
    getTodos(),
    getMemos(),
    getPosts(),
    calendarConfigured ? getUpcomingEvents(3) : Promise.resolve([]),
  ]);

  const pendingTodos = todos.filter((t) => !t.is_done);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">할일</h2>
          <Link href="/todos" className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
            전체보기
          </Link>
        </div>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          남은 할 일 {pendingTodos.length}개
        </p>
        <ul className="mt-3 space-y-1">
          {pendingTodos.slice(0, 4).map((t) => (
            <li key={t.id} className="truncate text-sm">
              · {t.content}
            </li>
          ))}
          {pendingTodos.length === 0 && (
            <li className="text-sm text-neutral-400">모두 완료했어요 🎉</li>
          )}
        </ul>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">최근 메모</h2>
          <Link href="/memos" className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
            전체보기
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {memos.slice(0, 3).map((m) => (
            <li key={m.id}>
              <Link href={`/memos/${m.id}`} className="block truncate text-sm hover:underline">
                {m.title || "(제목 없음)"}
              </Link>
            </li>
          ))}
          {memos.length === 0 && <li className="text-sm text-neutral-400">메모가 없습니다.</li>}
        </ul>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:col-span-2 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">최근 게시글</h2>
          <Link href="/board" className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
            전체보기
          </Link>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <li key={p.id}>
              <Link
                href={`/board/${p.id}`}
                className="block rounded-lg border border-neutral-100 p-3 text-sm hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-600"
              >
                <span className="text-xs text-neutral-400">{p.category}</span>
                <p className="mt-1 truncate font-medium">{p.title}</p>
              </Link>
            </li>
          ))}
          {posts.length === 0 && <li className="text-sm text-neutral-400">게시글이 없습니다.</li>}
        </ul>
      </section>

      {calendarConfigured && (
        <section className="rounded-xl border border-neutral-200 bg-white p-5 sm:col-span-2 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">다가오는 일정</h2>
            <Link href="/calendar" className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
              전체보기
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {events.map((e) => (
              <li key={e.key} className="truncate text-sm">
                · {e.title}
              </li>
            ))}
            {events.length === 0 && (
              <li className="text-sm text-neutral-400">예정된 일정이 없습니다.</li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
