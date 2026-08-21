// ==========================================
// Database Types for Admin Dashboard
// ==========================================

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  line_user_id: string;
  display_name: string | null;
  picture_url: string | null;
  status: "active" | "blocked";
  total_tokens_used: number;
  created_at: string;
  updated_at: string;
}

export interface ChatLog {
  id: string;
  user_id: string | null;
  line_user_id: string;
  message_type: string;
  user_message: string | null;
  ai_response: string | null;
  tokens_used: number;
  status: "success" | "error";
  created_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string | boolean | number;
  updated_at: string;
  updated_by: string | null;
}

// ==========================================
// Dashboard Stats Types
// ==========================================

export interface DashboardStats {
  totalUsers: number;
  activeUsersToday: number;
  totalMessages: number;
  errorRate: number;
}

export interface DailyUsage {
  date: string;
  messages: number;
  errors: number;
}

// ==========================================
// API Request/Response Types
// ==========================================

export interface BroadcastRequest {
  message: string;
  target?: "all" | "active";
}

export interface SendMessageRequest {
  lineUserId: string;
  message: string;
}

export interface N8nWebhookResponse {
  success: boolean;
  message?: string;
  error?: string;
}
