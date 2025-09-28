// Smart chat main component
export { default } from './smart-chat';

// Chat panel components
export { default as DesktopChatPanel } from './desktop-chat-panel';
export { default as MobileChatPanel } from './mobile-chat-panel';
export { default as DraggableFab } from './draggable-fab';

// Message and input components
export { default as ChatMessageCard } from './chat-message-card';
export { default as ChatInput } from './chat-input';
export { default as LoadingMessage } from './loading-message';
export { default as CannedMessages } from './canned-messages';

// Suggestion and AI components
export { default as AiSuggestionsSidebar } from './ai-suggestions-sidebar';
export { default as SuggestionCard } from './suggestion-card';
export { default as ExcerptCard } from './excerpt-card';

// Resume editor components
export { ResumeEditorProvider } from './resume-editor-context';
export { default as ResumeEditorPreview } from './resume-editor-preview';
export { default as PreviewActionPanel } from './preview-action-panel';
export { default as ZoomToolbar } from './zoom-toolbar';

// Issue and alert components
export { default as IssueBar } from './issue-bar';
export { default as IssueDropdown } from './issue-dropdown';
export { default as ChatLimitAlert } from './chat-limit-alert';

// User interface components
export { default as UserAvatar } from './user-avatar';

// Re-export types from feature modules
export type { SuggestionTemplate } from './ai-suggestions-sidebar';

