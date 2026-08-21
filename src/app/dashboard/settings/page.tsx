import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export const dynamic = "force-dynamic";

// Default settings
const DEFAULT_SETTINGS = {
  ai_enabled: true,
  system_prompt: "คุณคือผู้ช่วย AI ที่เป็นมิตรและช่วยเหลือลูกค้า ตอบคำถามอย่างสุภาพ กระชับ และเป็นประโยชน์ ใช้ภาษาไทยในการตอบ",
  selected_model: "gpt-4o",
};

export default async function SettingsPage() {
  let settings = DEFAULT_SETTINGS;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("system_settings")
      .select("key, value");

    if (data && data.length > 0) {
      const settingsMap: Record<string, string> = {};
      data.forEach((row: { key: string; value: string }) => {
        settingsMap[row.key] = row.value;
      });

      settings = {
        ai_enabled: settingsMap.ai_enabled
          ? JSON.parse(settingsMap.ai_enabled)
          : DEFAULT_SETTINGS.ai_enabled,
        system_prompt: settingsMap.system_prompt
          ? JSON.parse(settingsMap.system_prompt)
          : DEFAULT_SETTINGS.system_prompt,
        selected_model: settingsMap.selected_model
          ? JSON.parse(settingsMap.selected_model)
          : DEFAULT_SETTINGS.selected_model,
      };
    }
  } catch {
    // Use defaults if Supabase is not configured
  }

  return <SettingsClient initialSettings={settings} />;
}
