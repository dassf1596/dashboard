"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChatLog } from "@/lib/types";
import { Clock } from "lucide-react";

interface RecentActivityProps {
  logs: ChatLog[];
}

export function RecentActivity({ logs }: RecentActivityProps) {
  return (
    <Card className="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-zinc-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400" />
          กิจกรรมล่าสุด
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              ยังไม่มีกิจกรรม
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    log.status === "success" ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-300 truncate">
                      {log.line_user_id}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${
                        log.status === "success"
                          ? "border-emerald-500/30 text-emerald-400"
                          : "border-rose-500/30 text-rose-400"
                      }`}
                    >
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">
                    {log.user_message || "-"}
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    {new Date(log.created_at).toLocaleString("th-TH")}
                  </p>
                </div>
                {log.tokens_used > 0 && (
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {log.tokens_used} tokens
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
