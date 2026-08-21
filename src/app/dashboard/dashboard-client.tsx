"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import type { DashboardStats, DailyUsage, ChatLog } from "@/lib/types";
import { Users, Activity, MessageSquare, AlertTriangle } from "lucide-react";

interface DashboardClientProps {
  data: {
    stats: DashboardStats;
    dailyUsage: DailyUsage[];
    recentLogs: ChatLog[];
  };
}

export function DashboardClient({ data }: DashboardClientProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Overview</h1>
        <p className="text-sm text-zinc-500 mt-1">
          ภาพรวมการใช้งานระบบ
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={data.stats.totalUsers}
          description="ผู้ใช้ LINE OA ทั้งหมด"
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Active Today"
          value={data.stats.activeUsersToday}
          description="ผู้ใช้งานวันนี้"
          icon={<Activity className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Total Messages"
          value={data.stats.totalMessages}
          description="ข้อความ/AI Requests"
          icon={<MessageSquare className="w-5 h-5" />}
          color="violet"
        />
        <StatCard
          title="Error Rate"
          value={`${data.stats.errorRate}%`}
          description="AI Error / Failed Flows"
          icon={<AlertTriangle className="w-5 h-5" />}
          color="rose"
        />
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UsageChart data={data.dailyUsage} />
        </div>
        <div>
          <RecentActivity logs={data.recentLogs} />
        </div>
      </div>
    </div>
  );
}
