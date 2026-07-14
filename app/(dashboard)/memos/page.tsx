import Link from "next/link";
import { getMemos } from "@/lib/actions/memos";

export const dynamic = "force-dynamic";

export default async function MemosPage() {
  const memos = await getMemos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">메모</h1>
        <Link
          href="/memos/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          새 메모
        </Link>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {memos.map((memo) => (
          <li key={memo.id}>
            <Link
              href={`/memos/${memo.id}`}
              className="block rounded-lg border border-neutral-200 bg-white p-4 hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
            >
              <p className="truncate font-medium">
                {memo.title || "(제목 없음)"}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                {memo.content || "내용 없음"}
              </p>
            </Link>
          </li>
        ))}
        {memos.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-neutral-400">
            메모가 없습니다.
          </p>
        )}
      </ul>
    </div>
  );
}
