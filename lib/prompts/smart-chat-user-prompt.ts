export interface SmartChatIssue {
  id: string;
  title: string;
  description: string;
  status: string; // 'pending' | 'in_progress' | 'completed'
  completedSuggestion?: { title: string; description: string; category: string };
}

export interface SmartChatMessage {
  type: 'ai' | 'user' | 'file';
  content: string;
  timestamp: Date;
  suggestion?: {
    title: string;
    description: string;
    category: string;
    patchOps?: Array<{ op: 'set' | 'insert' | 'remove'; path: string; value?: unknown; index?: number }>;
  };
  excerpt?: {
    title: string;
    content: string;
    source: string;
    issue_id?: string;
  };
  quickResponses?: string[];
  excerptId?: string;
}

export interface SmartChatUserPromptOptions {
  issues: SmartChatIssue[];
  messages: SmartChatMessage[];
  resumeDiff?: string | null;
  currentResume?: unknown;
}

export function generateSmartChatUserPrompt(options: SmartChatUserPromptOptions): string {
  const { issues, messages, resumeDiff, currentResume } = options;
  const safeIssues: SmartChatIssue[] = Array.isArray(issues) ? issues : [];
  const safeMessages: SmartChatMessage[] = Array.isArray(messages) ? messages : [];

  // Aggregate conversation history internally
  const conversationHistory = safeMessages
    .map(msg => {
      let messageText = `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`;
      
      if (msg.suggestion) {
        messageText += `\n[建議] ${msg.suggestion.title}: ${msg.suggestion.description}`;
        if (msg.suggestion.patchOps && msg.suggestion.patchOps.length > 0) {
          messageText += `\n[操作] ${JSON.stringify(msg.suggestion.patchOps, null, 2)}`;
        }
      }
      
      if (msg.excerpt) {
        messageText += `\n[引用] ${msg.excerpt.title}: ${msg.excerpt.content}`;
        if (msg.excerpt.source) {
          messageText += `\n[來源] ${msg.excerpt.source}`;
        }
      }
      
    //   if (msg.quickResponses && msg.quickResponses.length > 0) {
    //     messageText += `\n[快速回覆] ${msg.quickResponses.join(', ')}`;
    //   }
      
      return messageText;
    })
    .join('\n\n');

  // Get last user message
  const lastUserMessage = safeMessages
    .filter(m => m.type === 'user')
    .pop()?.content;

  const latestMessageSection = lastUserMessage 
    ? `最新訊息：${lastUserMessage}`
    : '最新訊息：用戶沒有輸入文字，只是上傳了圖片';

  const inProgressIssues = safeIssues.filter(i => i.status === 'in_progress');
  const pendingIssues = safeIssues.filter(i => i.status === 'pending');
  const completedIssues = safeIssues.filter(i => i.status === 'completed');

  const inProgressSection = inProgressIssues.length > 0
    ? `${inProgressIssues
        .map((issue, index) => `${index + 1}. ${issue.title}
           - 描述：${issue.description}
           - ID：${issue.id}
        `)
        .join('\n')}`
    : '';

  const pendingSection = pendingIssues.length > 0
    ? `${pendingIssues
        .map((issue, index) => `${index + 1}. ${issue.title}
           - 描述：${issue.description}
           - ID：${issue.id}
        `)
        .join('\n')}`
    : '';

  const completedSection = completedIssues.length > 0
    ? `${completedIssues
        .map((issue, index) => `${index + 1}. ${issue.title}
           - 描述：${issue.description}
           - ID：${issue.id}
        `)
        .join('\n')}`
    : '';


  return `
You are receiving a comprehensive user context for Smart Chat resume optimization. This context includes conversation history, issue tracking, resume changes, and current resume state. Please process this information to provide relevant resume optimization guidance.
Always reference the conversation history to understand the current discussion context, prioritize in-progress issues, and consider any resume modifications the user has made.

<conversation_history>
${conversationHistory}

${latestMessageSection}
</conversation_history>

<in_progress_section>
進行中的履歷問題：
${inProgressSection}
以上進行中的問題必須優先處理，在這些問題完成前，嚴禁切換至其他話題。
</in_progress_section>

<pending_section>
待處理的履歷問題：
${pendingSection}
</pending_section>

<completed_section>
已完成的履歷問題：
${completedSection}
</completed_section>

<resume_diff_section>
${resumeDiff && resumeDiff.trim().length > 0 
  ? `以下為「本輪用戶對履歷的實際修改差異」，以 git 風格 diff 呈現（+ 表示新增、- 表示刪除）。請僅將其作為上下文參考，避免逐字複誦：

\`\`\`diff
${resumeDiff}
\`\`\``
  : '本輪用戶沒有對履歷進行實際修改'}
</resume_diff_section>

<current_resume_section>
${currentResume 
  ? `以下為「目前最新的履歷 JSON」供你參考。請以此為準，不要依賴舊版：

\`\`\`json
${typeof currentResume === 'string' ? currentResume : JSON.stringify(currentResume, null, 2)}
\`\`\``
  : ''}
</current_resume_section>
`.trim();
}


