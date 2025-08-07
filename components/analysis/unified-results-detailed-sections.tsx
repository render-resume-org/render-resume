import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UnifiedResumeAnalysisResult } from "@/lib/types/resume-unified";
import { Award, Briefcase, Code, FileText, GraduationCap, Lightbulb, AlertTriangle } from "lucide-react";

interface Props {
  analysisResult: UnifiedResumeAnalysisResult;
  allSkills: string[];
}

export function UnifiedResultsDetailedSections({ analysisResult, allSkills }: Props) {
  const { resume, highlights, issues } = analysisResult;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <FileText className="h-6 w-6 mr-2 text-gray-600" />
          詳細內容辨識
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Briefcase className="h-6 w-6 mr-2 text-purple-600" />
            履歷內容
          </CardTitle>
          {resume.summary && <CardDescription>{resume.summary}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {resume.personalInfo?.name && <div>姓名：{resume.personalInfo.name}</div>}
            {resume.personalInfo?.title && <div>職稱：{resume.personalInfo.title}</div>}
            {resume.personalInfo?.email && <div>信箱：{resume.personalInfo.email}</div>}
            {resume.personalInfo?.phone && <div>電話：{resume.personalInfo.phone}</div>}
            {resume.personalInfo?.location && <div>地點：{resume.personalInfo.location}</div>}
          </div>

          {/* Education */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold flex items-center"><GraduationCap className="h-5 w-5 mr-2 text-blue-600" />教育背景</h3>
            <div className="space-y-3 mt-2">
              {resume.education?.map((e, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="font-medium">{e.degree} - {e.school}</div>
                  <div className="text-xs text-gray-500">{e.period}</div>
                  {e.relevant_courses?.length ? (
                    <div className="mt-1 text-sm">課程：{e.relevant_courses.join('、')}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold flex items-center"><Briefcase className="h-5 w-5 mr-2 text-purple-600" />工作經驗</h3>
            <div className="space-y-3 mt-2">
              {resume.experience?.map((x, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="font-medium">{x.title} {x.company ? `- ${x.company}` : ''}</div>
                  <div className="text-xs text-gray-500">{x.period}</div>
                  {x.description && <div className="mt-1 text-sm">{x.description}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold flex items-center"><Code className="h-5 w-5 mr-2 text-green-600" />項目</h3>
            <div className="space-y-3 mt-2">
              {resume.projects?.map((p, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="font-medium">{p.name}</div>
                  {p.description && <div className="mt-1 text-sm">{p.description}</div>}
                  {p.technologies?.length ? (
                    <div className="mt-1 text-xs text-gray-500">技術：{p.technologies.join('、')}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold flex items-center"><Code className="h-5 w-5 mr-2 text-cyan-600" />技能</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {allSkills.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 rounded text-xs">{s}</span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          {resume.achievements?.length ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold flex items-center"><Award className="h-5 w-5 mr-2 text-orange-600" />成就</h3>
              <div className="space-y-2 mt-2">
                {resume.achievements.map((a, i) => (
                  <div key={i} className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-md text-sm">
                    <div className="font-medium">{a.title}{a.organization ? ` - ${a.organization}` : ''}</div>
                    <div className="text-xs text-gray-500">{a.period}</div>
                    {a.description && <div className="mt-1">{a.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl"><Lightbulb className="h-6 w-6 mr-2 text-yellow-500" />履歷亮點</CardTitle>
          <CardDescription>AI 識別的關鍵亮點</CardDescription>
        </CardHeader>
        <CardContent>
          {highlights?.length ? (
            <div className="space-y-3">
              {highlights.map((h, i) => (
                <div key={i} className="p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-md">
                  <div className="font-medium">{h.title}</div>
                  <div className="text-sm mt-1">{h.description}</div>
                  {h.excerpt && <div className="mt-1 text-xs text-gray-500">{h.excerpt}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">尚無亮點</div>
          )}
        </CardContent>
      </Card>

      {/* Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl"><AlertTriangle className="h-6 w-6 mr-2 text-red-500" />需改進之處</CardTitle>
          <CardDescription>AI 建議的重點優化項</CardDescription>
        </CardHeader>
        <CardContent>
          {issues?.length ? (
            <div className="space-y-3">
              {issues.map((it, i) => (
                <div key={i} className="p-3 bg-red-50 dark:bg-red-950/30 rounded-md">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm mt-1">{it.description}</div>
                  <div className="text-sm mt-1"><span className="font-medium">建議：</span>{it.suggested_change}</div>
                  <div className="text-xs mt-1 text-gray-600"><span className="font-medium">缺失：</span>{it.missing_information}</div>
                  <div className="text-xs mt-1 text-gray-600"><span className="font-medium">影響：</span>{it.impact}</div>
                  {it.excerpt && <div className="mt-1 text-xs text-gray-500">{it.excerpt}</div>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">尚無需改進之處</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}