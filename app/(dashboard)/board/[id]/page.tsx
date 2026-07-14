import { notFound } from "next/navigation";
import { getPost, updatePost, deletePost } from "@/lib/actions/posts";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">글 수정</h1>
      <form action={updatePost} className="space-y-3">
        <input type="hidden" name="id" value={post.id} />
        {post.images.map((path) => (
          <input key={path} type="hidden" name="existing_images" value={path} />
        ))}

        <div className="flex gap-2">
          <input
            type="text"
            name="title"
            defaultValue={post.title}
            required
            className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-4 py-2 font-medium outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
          <input
            type="text"
            name="category"
            defaultValue={post.category}
            className="w-40 rounded-lg border border-neutral-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
          />
        </div>

        {post.imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.imageUrls.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                className="h-24 w-24 rounded-lg object-cover"
              />
            ))}
          </div>
        )}

        <textarea
          name="content"
          defaultValue={post.content}
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
          저장
        </button>
      </form>
      <form action={deletePost}>
        <input type="hidden" name="id" value={post.id} />
        <button
          type="submit"
          className="text-sm text-neutral-400 hover:text-red-500"
        >
          이 글 삭제
        </button>
      </form>
    </div>
  );
}
