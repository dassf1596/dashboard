"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { UserProfile, ChatLog } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, Loader2, User as UserIcon, Bot } from "lucide-react";

interface ChatLogDialogProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatLogDialog({ user, open, onOpenChange }: ChatLogDialogProps) {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    async function fetchLogs() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("chat_logs")
          .select("*")
          .eq("line_user_id", user.line_user_id)
          .order("created_at", { ascending: false })
          .limit(50);

        setLogs(data || []);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [open, user.line_user_id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Chat Logs — {user.display_name || user.line_user_id}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-center text-zinc-500 py-12">ยังไม่มีประวัติการสนทนา</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg bg-zinc-800/50 border border-zinc-700/30 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        log.status === "success"
                          ? "border-emerald-500/30 text-emerald-400 text-[10px]"
                          : "border-rose-500/30 text-rose-400 text-[10px]"
                      }
                    >
                      {log.status}
                    </Badge>
                    <span className="text-[11px] text-zinc-500">
                      {new Date(log.created_at).toLocaleString("th-TH")}
                    </span>
                  </div>
                  {log.tokens_used > 0 && (
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {log.tokens_used} tokens
                    </span>
                  )}
                </div>

                {/* User message */}
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-1 text-xs text-blue-400 font-medium shrink-0 mt-0.5">
                    <UserIcon className="w-3.5 h-3.5" />
                    User:
                  </div>
                  <p className="text-sm text-zinc-300">
                    {log.user_message || "-"}
                  </p>
                </div>

                {/* AI response */}
                {log.ai_response && (
                  <div className="flex items-start gap-2">
                    <div className="flex items-center gap-1 text-xs text-violet-400 font-medium shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                      AI:
                    </div>
                    <p className="text-sm text-zinc-400">
                      {log.ai_response}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
