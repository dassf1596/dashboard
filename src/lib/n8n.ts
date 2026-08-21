import type { N8nWebhookResponse } from "./types";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "";

/**
 * Send a request to n8n webhook
 */
async function callN8nWebhook(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<N8nWebhookResponse> {
  if (!N8N_WEBHOOK_URL) {
    console.warn("N8N_WEBHOOK_URL is not configured");
    return {
      success: false,
      error: "n8n webhook URL is not configured",
    };
  }

  try {
    const response = await fetch(`${N8N_WEBHOOK_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}`);
    }

    const data = await response.json();
    return { success: true, message: data.message || "Success" };
  } catch (error) {
    console.error("n8n webhook error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send a broadcast message via n8n → LINE
 */
export async function sendBroadcast(
  message: string,
  target: "all" | "active" = "all"
): Promise<N8nWebhookResponse> {
  return callN8nWebhook("broadcast", { message, target });
}

/**
 * Send a direct message to a specific LINE user via n8n
 */
export async function sendDirectMessage(
  lineUserId: string,
  message: string
): Promise<N8nWebhookResponse> {
  return callN8nWebhook("send-message", { lineUserId, message });
}

/**
 * Notify n8n about a system setting change
 */
export async function notifySettingChange(
  key: string,
  value: unknown
): Promise<N8nWebhookResponse> {
  return callN8nWebhook("setting-changed", { key, value });
}
