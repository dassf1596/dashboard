import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import type { DailyUsage, ChatLog } from "@/lib/types";

export const dynamic = "force-dynamic";

// Generate last 30 days date slots with actual counts from chat logs
function getDailyUsageFromLogs(logs: ChatLog[]): DailyUsage[] {
  const days = 30;
  const result: DailyUsage[] = [];
  const now = new Date();

  // Create date map for fast lookup
  const countMap = new Map<string, { messages: number; errors: number }>();

  logs.forEach((log) => {
    const logDate = new Date(log.created_at).toISOString().split("T")[0];
    const current = countMap.get(logDate) || { messages: 0, errors: 0 };
    current.messages += 1;
    if (log.status === "error") {
      current.errors += 1;
    }
    countMap.set(logDate, current);
  });

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const stats = countMap.get(key) || { messages: 0, errors: 0 };

    result.push({
      date: d.toLocaleDateString("th-TH", { day: "2-digit", month: "short" }),
      messages: stats.messages,
      errors: stats.errors,
    });
  }

  return result;
}

export default async function DashboardPage() {
  let stats = {
    totalUsers: 0,
    activeUsersToday: 0,
    totalMessages: 0,
    errorRate: 0,
  };
  let dailyUsage: DailyUsage[] = [];
  let recentLogs: ChatLog[] = [];

  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch real data from Supabase in parallel
    const [usersResult, activeResult, messagesResult, errorsResult, logsResult, thirtyDaysLogsResult] =
      await Promise.all([
        supabase.from("users_profile").select("id", { count: "exact", head: true }),
        supabase
          .from("chat_logs")
          .select("line_user_id", { count: "exact", head: true })
          .gte("created_at", today),
        supabase.from("chat_logs").select("id", { count: "exact", head: true }),
        supabase
          .from("chat_logs")
          .select("id", { count: "exact", head: true })
          .eq("status", "error"),
        supabase
          .from("chat_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("chat_logs")
          .select("created_at, status")
          .gte("created_at", thirtyDaysAgo.toISOString()),
      ]);

    const totalUsers = usersResult.count || 0;
    const totalMessages = messagesResult.count || 0;
    const totalErrors = errorsResult.count || 0;

    stats = {
      totalUsers,
      activeUsersToday: activeResult.count || 0,
      totalMessages,
      errorRate: totalMessages > 0 ? Number(((totalErrors / totalMessages) * 100).toFixed(1)) : 0,
    };

    recentLogs = (logsResult.data as ChatLog[]) || [];
    dailyUsage = getDailyUsageFromLogs((thirtyDaysLogsResult.data as ChatLog[]) || []);
  } catch (error) {
    console.error("Failed to fetch dashboard data from Supabase:", error);
    dailyUsage = getDailyUsageFromLogs([]);
  }

  return (
    <DashboardClient
      data={{
        stats,
        dailyUsage,
        recentLogs,
      }}
    />
  );
}
