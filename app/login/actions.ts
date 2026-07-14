"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function loginAction(
  _prevState: { error: string } | undefined,
  formData: FormData
): Promise<{ error: string } | undefined> {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { error: "비밀번호를 입력해주세요." };
  }

  const hash = process.env.DASHBOARD_PASSWORD_HASH as string;
  const isValid = await bcrypt.compare(password, hash);

  if (!isValid) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();

  redirect("/");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
