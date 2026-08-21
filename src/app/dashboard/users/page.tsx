import { createClient } from "@/lib/supabase/server";
import { UsersTable } from "@/components/users/users-table";
import type { UserProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let users: UserProfile[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users_profile")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      users = data;
    }
  } catch (error) {
    console.error("Failed to fetch users from Supabase:", error);
    users = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Users & Chat Logs</h1>
        <p className="text-sm text-zinc-500 mt-1">
          จัดการผู้ใช้ LINE OA และดูประวัติการสนทนา
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
