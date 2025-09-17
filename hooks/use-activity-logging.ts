import {
  logAnnouncementView,
  logProfileView,
  logResumeBuild,
  logResumeDownload,
  logResumeOptimize,
  logSmartChatAttachment,
  logSmartChatMessage,
  logUserAction
} from '@/lib/actions/activity';
import { Database } from '@/types/database';
import { useCallback } from 'react';

type ActionType = Database['public']['Enums']['action-type'];

export function useActivityLogging() {
  const logAction = useCallback(async (action: ActionType, detail?: string, link?: string) => {
    try {
      await logUserAction(action, detail, link);
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }, []);

  const logAnnouncement = useCallback(async (announcementId: number, announcementTitle: string) => {
    try {
      await logAnnouncementView(announcementId, announcementTitle);
    } catch (error) {
      console.error('Failed to log announcement view:', error);
    }
  }, []);

  const logResumeCreation = useCallback(async (detail?: string) => {
    try {
      await logResumeBuild(detail);
    } catch (error) {
      console.error('Failed to log resume build:', error);
    }
  }, []);

  const logResumeOptimization = useCallback(async (detail?: string) => {
    try {
      await logResumeOptimize(detail);
    } catch (error) {
      console.error('Failed to log resume optimization:', error);
    }
  }, []);

  const logProfile = useCallback(async () => {
    try {
      await logProfileView();
    } catch (error) {
      console.error('Failed to log profile view:', error);
    }
  }, []);

  const logDownload = useCallback(async (detail?: string) => {
    try {
      await logResumeDownload(detail);
    } catch (error) {
      console.error('Failed to log resume download:', error);
    }
  }, []);

  const logChatMessage = useCallback(async (messageLength: number, messageContent?: string) => {
    try {
      await logSmartChatMessage(messageLength, messageContent);
    } catch (error) {
      console.error('Failed to log chat message:', error);
    }
  }, []);

  const logChatAttachment = useCallback(async (fileName: string, fileSize: number) => {
    try {
      await logSmartChatAttachment(fileName, fileSize);
    } catch (error) {
      console.error('Failed to log chat attachment:', error);
    }
  }, []);

  return {
    logAction,
    logAnnouncement,
    logResumeCreation,
    logResumeOptimization,
    logProfile,
    logDownload,
    logChatMessage,
    logChatAttachment,
  };
} 