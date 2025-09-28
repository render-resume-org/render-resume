'use server';

import { createClient } from "@/lib/supabase/server";
import { AnnouncementTable } from "@/types/database";

export async function getActiveAnnouncements(): Promise<AnnouncementTable[]> {
  const supabase = await createClient();
  
  const { data: announcements, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }

  return announcements || [];
}

export async function getAnnouncementById(id: number): Promise<AnnouncementTable | null> {
  const supabase = await createClient();
  
  const { data: announcement, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching announcement:', error);
    return null;
  }

  return announcement;
}

export async function incrementAnnouncementViews(id: number): Promise<void> {
  const supabase = await createClient();
  
  // First get the current views count
  const { data: announcement, error: fetchError } = await supabase
    .from('announcements')
    .select('views')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching announcement views:', fetchError);
    return;
  }

  // Then increment the views count
  const currentViews = announcement?.views || 0;
  const { error: updateError } = await supabase
    .from('announcements')
    .update({ views: currentViews + 1 })
    .eq('id', id);

  if (updateError) {
    console.error('Error incrementing announcement views:', updateError);
  }
}

export interface PaginatedAnnouncements {
  announcements: AnnouncementTable[];
  totalCount: number;
  hasMore: boolean;
}

export async function getAnnouncementsPaginated(
  page: number = 1,
  limit: number = 5
): Promise<PaginatedAnnouncements> {
  const supabase = await createClient();
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 获取总数
  const { count } = await supabase
    .from('announcements')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // 获取分页数据
  const { data: announcements, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching paginated announcements:', error);
    return {
      announcements: [],
      totalCount: 0,
      hasMore: false,
    };
  }

  const totalCount = count || 0;
  const hasMore = totalCount > page * limit;

  return {
    announcements: announcements || [],
    totalCount,
    hasMore,
  };
} 