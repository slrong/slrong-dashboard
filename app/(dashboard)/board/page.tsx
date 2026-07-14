import Link from "next/link";
import { getPosts, getCategories } from "@/lib/actions/posts";

export const dynamic = "force-dynamic";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category || "전체";
  const [posts, categories] = await Promise.all([
    getPosts(activeCategory),
    getCategories(),
  ]);
  const tabs = ["전체", ...categories];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">게시판</h1>
        <Link
          href="/board/new"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          글쓰기
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={tab === "전체" ? "/board" : `/board?category=${encodeURIComponent(tab)}`}
            className={`rounded-full px-3 py-1 text-sm ${
              activeCategory === tab
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/board/${post.id}`}
              className="block overflow-hidden rounded-lg border border-neutral-200 bg-white hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
            >
              {post.imageUrls[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.imageUrls[0]}
                  alt=""
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-4">
                <span className="text-xs text-neutral-400">
                  {post.category}
                </span>
                <p className="mt-1 truncate font-medium">{post.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                  {post.content}
                </p>
              </div>
            </Link>
          </li>
        ))}
        {posts.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-neutral-400">
            게시글이 없습니다.
          </p>
        )}
      </ul>
    </div>
  );
}
