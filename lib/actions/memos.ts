"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";

export interface Memo {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function getMemos(): Promise<Memo[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("memos")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getMemo(id: string): Promise<Memo | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("memos")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createMemo(formData: FormData) {
  const title = (formData.get("title") as string) ?? "";
  const content = (formData.get("content") as string) ?? "";

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("memos")
    .insert({ title, content })
    .select("id")
    .single();

  if (error) throw error;
  revalidatePath("/memos");
  revalidatePath("/");
  redirect(`/memos/${data.id}`);
}

export async function updateMemo(formData: FormData) {
  const id = formData.get("id") as string;
  const title = (formData.get("title") as string) ?? "";
  const content = (formData.get("content") as string) ?? "";

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("memos")
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/memos");
  revalidatePath(`/memos/${id}`);
  revalidatePath("/");
}

export async function deleteMemo(formData: FormData) {
  const id = formData.get("id") as string;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("memos").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/memos");
  revalidatePath("/");
  redirect("/memos");
}
