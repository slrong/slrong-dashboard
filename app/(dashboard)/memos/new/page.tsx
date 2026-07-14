import { createMemo } from "@/lib/actions/memos";

export default function NewMemoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">새 메모</h1>
      <form action={createMemo} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="제목"
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-4 py-2 font-medium outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        <textarea
          name="content"
          placeholder="내용을 입력하세요"
          rows={14}
          className="w-full resize-none rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-sm leading-relaxed outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          저장
        </button>
      </form>
    </div>
  );
}
