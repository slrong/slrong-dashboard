import { createClient } from "@supabase/supabase-js";

// 서버 전용 클라이언트. service_role 키를 사용하므로 절대 클라이언트(브라우저)에 노출하지 않는다.
export function getSupabaseServerClient() {
  return createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    { auth: { persistSession: false } }
  );
}
