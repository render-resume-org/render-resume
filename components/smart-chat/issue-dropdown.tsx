"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Copy, Trash2 } from "lucide-react";

export interface IssueItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in_progress" | "completed";
}

interface IssueDropdownProps {
  issues: IssueItem[];
  value?: string;
  onChange?: (issueId: string) => void;
  onQuote?: (issue: IssueItem) => void;
  onRemove?: (issueId: string) => void;
  className?: string;
}

export function IssueDropdown({ issues, value, onChange, onQuote, onRemove, className }: IssueDropdownProps) {
  const getStatusVariant = (status: IssueItem["status"]) => {
    switch (status) {
      case "completed":
        return "default" as const;
      case "in_progress":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const getStatusText = (status: IssueItem["status"]) => {
    switch (status) {
      case "pending":
        return "未完成";
      case "in_progress":
        return "進行中";
      case "completed":
        return "已完成";
    }
  };

  const getIndicatorBarColor = (status: IssueItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-300";
      case "in_progress":
        return "bg-orange-300";
      case "completed":
        return "bg-cyan-500";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={issues?.length ? "選擇要處理的 issue" : "目前沒有 issue"} />
        </SelectTrigger>
        <SelectContent className="max-h-96 w-80 p-0">
          {issues?.length ? (
            <div className="p-2 space-y-2">
              {issues.map((issue) => (
                <SelectItem 
                  key={issue.id} 
                  value={issue.id} 
                  className="p-0 h-auto focus:bg-transparent focus:ring-0"
                >
                  <Card className="w-full overflow-hidden relative cursor-pointer select-none border-0 shadow-none hover:bg-gray-50 transition-colors">
                    {/* Left indicator bar */}
                    <div className={`w-1.5 rounded-l-lg ${getIndicatorBarColor(issue.status)} h-full absolute left-0 top-0`} />
                    
                    <div className="flex-1 flex flex-col pl-2">
                      {/* Header */}
                      <div className="flex items-center justify-between min-h-[2.5rem] max-w-full px-4 py-2">
                        <div className="flex-1 min-w-0 w-0">
                          <CardTitle className="text-sm truncate overflow-hidden whitespace-nowrap max-w-full">
                            {issue.title}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          {onQuote && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onQuote(issue);
                              }}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors rounded-lg"
                              title="引用此問題進行討論"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {onRemove && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(issue.id);
                              }}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg"
                              title="移除此問題"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <CardContent className="pt-2 pb-0 px-4">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {issue.description}
                        </p>
                      </CardContent>
                      
                      {/* Footer */}
                      <CardFooter className="flex items-center justify-between px-4 pb-2 pt-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-gray-700`}>
                            {getStatusText(issue.status)}
                          </span>
                          <Badge variant={getStatusVariant(issue.status)} className="text-[10px]">
                            {issue.category}
                          </Badge>
                        </div>
                      </CardFooter>
                    </div>
                  </Card>
                </SelectItem>
              ))}
            </div>
          ) : (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">無項目</div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

export default IssueDropdown;


