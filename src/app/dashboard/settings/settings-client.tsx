"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Bot,
  Cpu,
  FileText,
  Save,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface SettingsClientProps {
  initialSettings: {
    ai_enabled: boolean;
    system_prompt: string;
    selected_model: string;
  };
}

const AI_MODELS = [
  { value: "gpt-4o", label: "GPT-4o", provider: "OpenAI" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini", provider: "OpenAI" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku", provider: "Anthropic" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "Google" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "Google" },
];

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [aiEnabled, setAiEnabled] = useState(initialSettings.ai_enabled);
  const [systemPrompt, setSystemPrompt] = useState(initialSettings.system_prompt);
  const [selectedModel, setSelectedModel] = useState(initialSettings.selected_model);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  async function saveSetting(key: string, value: unknown) {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("system_settings")
        .update({
          value: JSON.stringify(value),
          updated_at: new Date().toISOString(),
        })
        .eq("key", key);

      if (error) throw error;
      setLastSaved(new Date());
      toast.success("บันทึกสำเร็จ");
    } catch {
      toast.error("บันทึกไม่สำเร็จ กรุณาลองใหม่");
    }
  }

  async function handleToggleAI(checked: boolean) {
    setAiEnabled(checked);
    await saveSetting("ai_enabled", checked);
  }

  async function handleModelChange(model: string | null) {
    if (!model) return;
    setSelectedModel(model);
    await saveSetting("selected_model", model);
  }

  async function handleSavePrompt() {
    setSaving(true);
    await saveSetting("system_prompt", systemPrompt);
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          ควบคุมระบบ AI และการตั้งค่าต่างๆ
        </p>
      </div>

      {/* AI Toggle */}
      <Card className="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-zinc-200 flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" />
                AI System
                <Badge
                  variant="outline"
                  className={
                    aiEnabled
                      ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                      : "border-rose-500/30 text-rose-400 bg-rose-500/10"
                  }
                >
                  {aiEnabled ? "ONLINE" : "OFFLINE"}
                </Badge>
              </CardTitle>
              <CardDescription className="text-zinc-400 mt-1">
                เปิด-ปิดระบบ AI ตอบกลับอัตโนมัติ
              </CardDescription>
            </div>
            <Switch
              checked={aiEnabled}
              onCheckedChange={handleToggleAI}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`p-3 rounded-lg text-sm flex items-center gap-2.5 ${
            aiEnabled
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-amber-500/10 border border-amber-500/20 text-amber-300"
          }`}>
            {aiEnabled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AI กำลังทำงานปกติ — ระบบจะตอบกลับข้อความอัตโนมัติ</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>AI ถูกปิดชั่วคราว — ระบบจะไม่ตอบกลับอัตโนมัติ (ใช้ตอบมือแทน)</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Model Selection */}
      <Card className="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-200 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-violet-400" />
            AI Model
          </CardTitle>
          <CardDescription className="text-zinc-400">
            เลือกโมเดล AI ที่ต้องการใช้งาน
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label className="text-zinc-300">Model</Label>
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100 h-11">
                <SelectValue placeholder="เลือกโมเดล" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {AI_MODELS.map((model) => (
                  <SelectItem
                    key={model.value}
                    value={model.value}
                    className="text-zinc-200 focus:bg-zinc-700 focus:text-zinc-100"
                  >
                    <div className="flex items-center gap-2">
                      <span>{model.label}</span>
                      <span className="text-xs text-zinc-500">
                        ({model.provider})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-zinc-800/50" />

      {/* System Prompt Editor */}
      <Card className="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-200 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            System Prompt
          </CardTitle>
          <CardDescription className="text-zinc-400">
            แก้ไข System Prompt ที่ AI ใช้ในการตอบกลับ — n8n จะดึงค่านี้ไปใช้อัตโนมัติ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={8}
            placeholder="กรอก System Prompt สำหรับ AI..."
            className="bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 font-mono text-sm resize-y"
          />

          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              {systemPrompt.length} ตัวอักษร
              {lastSaved && (
                <span className="ml-3">
                  บันทึกล่าสุด: {lastSaved.toLocaleString("th-TH")}
                </span>
              )}
            </div>
            <Button
              onClick={handleSavePrompt}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  บันทึก System Prompt
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
