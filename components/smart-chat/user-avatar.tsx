import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: {
    avatar_url?: string;
    display_name?: string;
    email?: string;
  } | null;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const initial = user?.display_name?.[0] || user?.email?.[0] || 'U';
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={user?.avatar_url} alt={user?.display_name || user?.email || "User"} />
      <AvatarFallback className="bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400 text-sm font-medium">
        {initial.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar; 