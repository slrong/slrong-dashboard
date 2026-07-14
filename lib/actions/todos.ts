"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";

export interface Todo {
  id: string;
  content: string;
  is_done: boolean;
  created_at: string;
}

export async function getTodos(): Promise<Todo[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("is_done", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function addTodo(formData: FormData) {
  const content = formData.get("content");
  if (typeof content !== "string" || content.trim().length === 0) return;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("todos")
    .insert({ content: content.trim() });

  if (error) throw error;
  revalidatePath("/todos");
  revalidatePath("/");
}

export async function toggleTodo(formData: FormData) {
  const id = formData.get("id") as string;
  const isDone = formData.get("is_done") === "true";

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("todos")
    .update({ is_done: !isDone, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/todos");
  revalidatePath("/");
}

export async function deleteTodo(formData: FormData) {
  const id = formData.get("id") as string;

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/todos");
  revalidatePath("/");
}
