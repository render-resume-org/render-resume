// Admin configuration - centralized admin management
// TODO: Move to environment variables in production
export const ADMIN_CONFIG = {
  // Admin user IDs - should be moved to environment variables
  ADMIN_IDS: ['049512f1-9b80-4848-9df3-03adcc8f61c9'] as readonly string[],
  
  // Admin permissions
  PERMISSIONS: {
    VIEW_DASHBOARD: 'view_dashboard',
    MANAGE_USERS: 'manage_users',
    MANAGE_ANNOUNCEMENTS: 'manage_announcements',
    MANAGE_SETTINGS: 'manage_settings',
    SEND_EMAILS: 'send_emails',
  },
  
  // Admin roles
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
  }
} as const;

export function isAdmin(userId: string): boolean {
  return ADMIN_CONFIG.ADMIN_IDS.includes(userId);
}

export function hasPermission(userId: string, _permission: string): boolean {
  // For now, all admins have all permissions
  // This can be extended to support role-based permissions
  // The _permission parameter is prefixed with underscore to indicate it's intentionally unused
  return isAdmin(userId);
}