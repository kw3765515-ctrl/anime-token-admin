import { supabase } from "@/integrations/supabase/client";

export interface User {
  userId: number;
  name: string;
  username?: string;
  tokens: number;
  accountCount?: number;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  totalUsers: number;
}

export interface TopupResponse {
  success: boolean;
  newBalance?: number;
  message?: string;
}

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-proxy`;

export async function fetchUsers(): Promise<UsersResponse> {
  const res = await fetch(`${FUNCTION_URL}?action=get-users`, {
    headers: {
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  if (!res.ok) throw new Error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
  return res.json();
}

export async function addTokens(userId: number, amount: number, reason: string): Promise<TopupResponse> {
  const res = await fetch(`${FUNCTION_URL}?action=add-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ userId, amount, reason }),
  });
  if (!res.ok) throw new Error('ไม่สามารถเติมโทเค่นได้');
  return res.json();
}
