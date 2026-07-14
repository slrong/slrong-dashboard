import { notFound } from "next/navigation";
import { getMemo, updateMemo, deleteMemo } from "@/lib/actions/memos";

export const dynamic = "force-dynamic";

export default async function MemoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memo = await getMemo(id);

  if (!memo) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">메모 수정</h1>
      <form action={updateMemo} className="space-y-3">
        <input type="hidden" name="id" value={memo.id} />
        <input
          type="text"
          name="title"
          defaultValue={memo.title}
          placeholder="제목"
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-4 py-2 font-medium outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        <textarea
          name="content"
          defaultValue={memo.content}
          rows={14}
          className="w-full resize-none rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-sm leading-relaxed outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        <div className="flex justify-between">
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
          >
            저장
          </button>
        </div>
      </form>
      <form action={deleteMemo}>
        <input type="hidden" name="id" value={memo.id} />
        <button
          type="submit"
          className="text-sm text-neutral-400 hover:text-red-500"
        >
          이 메모 삭제
        </button>
      </form>
    </div>
  );
}
