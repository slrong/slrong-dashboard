"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
      >
        <h1 className="mb-6 text-center text-lg font-medium text-neutral-900 dark:text-neutral-100">
          내 대시보드
        </h1>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          autoFocus
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-4 py-2.5 text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:text-neutral-100"
        />
        {state?.error && (
          <p className="mt-2 text-sm text-red-500">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full rounded-lg bg-neutral-900 py-2.5 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          {isPending ? "확인 중..." : "입장하기"}
        </button>
      </form>
    </div>
  );
}
