import { getTodos, addTodo, toggleTodo, deleteTodo } from "@/lib/actions/todos";

export const dynamic = "force-dynamic";

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">할일</h1>

      <form action={addTodo} className="flex gap-2">
        <input
          type="text"
          name="content"
          placeholder="할 일을 입력하세요"
          className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-4 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          추가
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <form action={toggleTodo}>
              <input type="hidden" name="id" value={todo.id} />
              <input type="hidden" name="is_done" value={String(todo.is_done)} />
              <button
                type="submit"
                className={`h-5 w-5 shrink-0 rounded-full border ${
                  todo.is_done
                    ? "border-neutral-900 bg-neutral-900 dark:border-neutral-100 dark:bg-neutral-100"
                    : "border-neutral-400"
                }`}
                aria-label="완료 토글"
              />
            </form>
            <span
              className={`flex-1 text-sm ${
                todo.is_done
                  ? "text-neutral-400 line-through"
                  : "text-neutral-900 dark:text-neutral-100"
              }`}
            >
              {todo.content}
            </span>
            <form action={deleteTodo}>
              <input type="hidden" name="id" value={todo.id} />
              <button
                type="submit"
                className="text-xs text-neutral-400 hover:text-red-500"
              >
                삭제
              </button>
            </form>
          </li>
        ))}
        {todos.length === 0 && (
          <p className="py-8 text-center text-sm text-neutral-400">
            할 일이 없습니다.
          </p>
        )}
      </ul>
    </div>
  );
}
