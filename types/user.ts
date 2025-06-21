export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  currentPlan?: {
    id: number;
    title: string;
    type: string;
    daily_usage: number;
    expire_at: string | null;
  } | null;
}

export interface Plan {
  id: number;
  code: string;
  title: string;
  type: string;
  daily_usage: number;
  duration_days: number | null;
  created_at: string;
}

export interface Subscription {
  id: number;
  user_id: string;
  plan_id: number;
  is_active: boolean;
  expire_at: string | null;
  created_at: string;
  plans?: Plan;
} 