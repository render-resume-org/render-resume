"use client";

import { Database } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export type UserWithSubscription = Database["public"]["Tables"]["users"]["Row"] & {
  subscription?: {
    plan_title: string;
    plan_type: string;
    is_active: boolean;
    expire_at: string | null;
  } | null;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  paidUsers: number;
  freeUsers: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseAdminDataOptions {
  page?: number;
  limit?: number;
  search?: string;
  filter?: 'all' | 'active' | 'paid' | 'free';
}

export function useAdminData(options: UseAdminDataOptions = {}) {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    paidUsers: 0,
    freeUsers: 0,
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    page = 1,
    limit = 10,
    search = '',
    filter = 'all'
  } = options;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(filter !== 'all' && { filter }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '獲取用戶數據失敗');
      }

      setUsers(data.users);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      const errorMessage = err instanceof Error ? err.message : "獲取用戶數據失敗";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, filter]);

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '刪除用戶失敗');
      }

      toast.success('用戶已成功刪除');
      // 重新獲取數據
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      const errorMessage = err instanceof Error ? err.message : "刪除用戶失敗";
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateUser = async (userId: string, updates: Partial<UserWithSubscription>) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, ...updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '更新用戶失敗');
      }

      toast.success('用戶已成功更新');
      // 重新獲取數據
      await fetchUsers();
      return data.user;
    } catch (err) {
      console.error("Error updating user:", err);
      const errorMessage = err instanceof Error ? err.message : "更新用戶失敗";
      toast.error(errorMessage);
      throw err;
    }
  };

  // 當選項改變時重新獲取數據
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    stats,
    pagination,
    loading,
    error,
    refetch: fetchUsers,
    deleteUser,
    updateUser,
  };
}

