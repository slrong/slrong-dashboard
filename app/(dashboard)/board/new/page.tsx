import { createPost } from "@/lib/actions/posts";

export default function NewPostPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">글쓰기</h1>
      <form action={createPost} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            name="title"
            placeholder="제목"
            required
            className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-4 py-2 font-medium outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            type="text"
            name="category"
            placeholder="카테고리 (예: 일상)"
            defaultValue="일반"
            className="w-40 rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </div>
        <textarea
          name="content"
          placeholder="내용을 입력하세요"
          rows={12}
          className="w-full resize-none rounded-lg border border-neutral-300 bg-transparent px-4 py-3 text-sm leading-relaxed outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          className="w-full text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          등록
        </button>
      </form>
    </div>
  );
}
