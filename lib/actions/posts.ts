"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";

const BUCKET = "post-images";
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1시간

export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  images: string[]; // storage 경로 목록
  created_at: string;
  updated_at: string;
}

export interface PostWithSignedImages extends Post {
  imageUrls: string[];
}

async function signImages(paths: string[]): Promise<string[]> {
  if (paths.length === 0) return [];
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);

  if (error) throw error;
  return data.map((d) => d.signedUrl).filter((url): url is string => !!url);
}

export async function getPosts(
  category?: string
): Promise<PostWithSignedImages[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (category && category !== "전체") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;

  const posts = data ?? [];
  return Promise.all(
    posts.map(async (post) => ({
      ...post,
      imageUrls: await signImages(post.images ?? []),
    }))
  );
}

export async function getCategories(): Promise<string[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("posts").select("category");
  if (error) throw error;
  const unique = Array.from(new Set((data ?? []).map((p) => p.category)));
  return unique.sort();
}

export async function getPost(id: string): Promise<PostWithSignedImages | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return { ...data, imageUrls: await signImages(data.images ?? []) };
}

async function uploadImages(files: File[]): Promise<string[]> {
  const validFiles = files.filter((f) => f.size > 0);
  if (validFiles.length === 0) return [];

  const supabase = getSupabaseServerClient();
  const paths: string[] = [];

  for (const file of validFiles) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type });

    if (error) throw error;
    paths.push(path);
  }

  return paths;
}

export async function createPost(formData: FormData) {
  const title = (formData.get("title") as string) ?? "";
  const content = (formData.get("content") as string) ?? "";
  const category = ((formData.get("category") as string) || "일반").trim();
  const files = formData.getAll("images") as File[];

  const images = await uploadImages(files);

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, category, images })
    .select("id")
    .single();

  if (error) throw error;
  revalidatePath("/board");
  revalidatePath("/");
  redirect(`/board/${data.id}`);
}

export async function updatePost(formData: FormData) {
  const id = formData.get("id") as string;
  const title = (formData.get("title") as string) ?? "";
  const content = (formData.get("content") as string) ?? "";
  const category = ((formData.get("category") as string) || "일반").trim();
  const files = formData.getAll("images") as File[];
  const existingImages = formData.getAll("existing_images") as string[];

  const newImages = await uploadImages(files);
  const images = [...existingImages, ...newImages];

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      category,
      images,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/board");
  revalidatePath(`/board/${id}`);
  revalidatePath("/");
  redirect(`/board/${id}`);
}

export async function deletePost(formData: FormData) {
  const id = formData.get("id") as string;

  const supabase = getSupabaseServerClient();
  const { data: post } = await supabase
    .from("posts")
    .select("images")
    .eq("id", id)
    .maybeSingle();

  if (post?.images?.length) {
    await supabase.storage.from(BUCKET).remove(post.images);
  }

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/board");
  revalidatePath("/");
  redirect("/board");
}
