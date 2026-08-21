"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserProfile } from "@/lib/types";
import { ChatLogDialog } from "./chat-logs";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UsersTableProps {
  users: UserProfile[];
}

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [dmOpen, setDmOpen] = useState(false);
  const [dmTarget, setDmTarget] = useState<UserProfile | null>(null);
  const [dmMessage, setDmMessage] = useState("");
  const [dmLoading, setDmLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [chatLogOpen, setChatLogOpen] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.line_user_id.toLowerCase().includes(search.toLowerCase())
  );

  async function handleToggleBlock(user: UserProfile) {
    const newStatus = user.status === "active" ? "blocked" : "active";

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("users_profile")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );

      toast.success(
        newStatus === "blocked"
          ? `บล็อก ${user.display_name || user.line_user_id} แล้ว`
          : `ปลดบล็อก ${user.display_name || user.line_user_id} แล้ว`
      );
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }

  async function handleBroadcast() {
    if (!broadcastMessage.trim()) return;
    setBroadcastLoading(true);

    try {
      const res = await fetch("/api/n8n/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: broadcastMessage, target: "all" }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("ส่ง Broadcast สำเร็จ");
        setBroadcastOpen(false);
        setBroadcastMessage("");
      } else {
        toast.error(data.error || "ส่งไม่สำเร็จ");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการส่ง Broadcast");
    } finally {
      setBroadcastLoading(false);
    }
  }

  async function handleSendDM() {
    if (!dmMessage.trim() || !dmTarget) return;
    setDmLoading(true);

    try {
      const res = await fetch("/api/n8n/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineUserId: dmTarget.line_user_id,
          message: dmMessage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`ส่งข้อความถึง ${dmTarget.display_name || dmTarget.line_user_id} สำเร็จ`);
        setDmOpen(false);
        setDmMessage("");
        setDmTarget(null);
      } else {
        toast.error(data.error || "ส่งไม่สำเร็จ");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการส่งข้อความ");
    } finally {
      setDmLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Search + Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <Input
          placeholder="ค้นหาผู้ใช้..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500"
        />

        <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
          <DialogTrigger
            render={
              <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="m3 11 18-5v12L3 13v-2z" />
                  <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                </svg>
                Broadcast
              </Button>
            }
          />
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle>📢 ส่ง Broadcast</DialogTitle>
              <DialogDescription className="text-zinc-400">
                ส่งข้อความถึงผู้ใช้ทุกคนผ่าน LINE OA
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="พิมพ์ข้อความ..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              rows={4}
              className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100"
            />
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setBroadcastOpen(false)}
                className="text-zinc-400"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleBroadcast}
                disabled={broadcastLoading || !broadcastMessage.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                {broadcastLoading ? "กำลังส่ง..." : "ส่งข้อความ"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800/50 hover:bg-transparent">
              <TableHead className="text-zinc-400">ผู้ใช้</TableHead>
              <TableHead className="text-zinc-400">LINE User ID</TableHead>
              <TableHead className="text-zinc-400">สถานะ</TableHead>
              <TableHead className="text-zinc-400 text-right">Tokens ใช้ไป</TableHead>
              <TableHead className="text-zinc-400 text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-zinc-500 py-12">
                  {search ? "ไม่พบผู้ใช้ที่ค้นหา" : "ยังไม่มีข้อมูลผู้ใช้"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-zinc-800/50 hover:bg-zinc-800/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                          {(user.display_name || "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-zinc-200">
                        {user.display_name || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-zinc-400">
                    {user.line_user_id}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.status === "active"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                          : "border-rose-500/30 text-rose-400 bg-rose-500/10"
                      }
                    >
                      {user.status === "active" ? "Active" : "Blocked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-zinc-300">
                    {user.total_tokens_used.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setChatLogOpen(true);
                        }}
                        className="text-zinc-400 hover:text-blue-400 h-8 px-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDmTarget(user);
                          setDmOpen(true);
                        }}
                        className="text-zinc-400 hover:text-violet-400 h-8 px-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m22 2-7 20-4-9-9-4Z" />
                          <path d="M22 2 11 13" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleBlock(user)}
                        className={`h-8 px-2 ${user.status === "active"
                          ? "text-zinc-400 hover:text-rose-400"
                          : "text-rose-400 hover:text-emerald-400"
                          }`}
                      >
                        {user.status === "active" ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m4.9 4.9 14.2 14.2" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                            <path d="m9 12 2 2 4-4" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Chat Log Dialog */}
      {selectedUser && (
        <ChatLogDialog
          user={selectedUser}
          open={chatLogOpen}
          onOpenChange={setChatLogOpen}
        />
      )}

      {/* Direct Message Dialog */}
      <Dialog open={dmOpen} onOpenChange={setDmOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>💬 ส่งข้อความ</DialogTitle>
            <DialogDescription className="text-zinc-400">
              ส่งข้อความถึง {dmTarget?.display_name || dmTarget?.line_user_id}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="พิมพ์ข้อความ..."
            value={dmMessage}
            onChange={(e) => setDmMessage(e.target.value)}
            rows={3}
            className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100"
          />
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDmOpen(false)}
              className="text-zinc-400"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleSendDM}
              disabled={dmLoading || !dmMessage.trim()}
              className="bg-violet-600 hover:bg-violet-500 text-white"
            >
              {dmLoading ? "กำลังส่ง..." : "ส่ง"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
