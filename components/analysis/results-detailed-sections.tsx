import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { Award, Briefcase, Code, FileText, Folder, Github, Globe, GraduationCap, Linkedin, Mail, MapPin, Phone, User, UserCircle } from "lucide-react";

interface ResultsDetailedSectionsProps {
  analysisResult: ResumeAnalysisResult;
  allSkills: string[];
}

export function ResultsDetailedSections({ analysisResult, allSkills }: ResultsDetailedSectionsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <FileText className="h-6 w-6 mr-2 text-gray-600" />
          詳細內容辨識
        </h2>
      </div>
      {/* Profile Section */}
      {analysisResult.profile && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <UserCircle className="h-6 w-6 mr-2 text-indigo-600" />
              個人基本資料
            </CardTitle>
            <CardDescription>
              AI 從履歷中提取的個人基本資訊
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                {analysisResult.profile.name && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">姓名</span>
                      <p className="text-gray-900 dark:text-white">{analysisResult.profile.name}</p>
                    </div>
                  </div>
                )}
                {analysisResult.profile.title && (
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">專業頭銜</span>
                      <p className="text-gray-900 dark:text-white">{analysisResult.profile.title}</p>
                    </div>
                  </div>
                )}
                {analysisResult.profile.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">電子郵件</span>
                      <p className="text-gray-900 dark:text-white">
                        <a href={`mailto:${analysisResult.profile.email}`} className="text-indigo-600 hover:text-indigo-800">
                          {analysisResult.profile.email}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {analysisResult.profile.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">電話</span>
                      <p className="text-gray-900 dark:text-white">{analysisResult.profile.phone}</p>
                    </div>
                  </div>
                )}
                {analysisResult.profile.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">地點</span>
                      <p className="text-gray-900 dark:text-white">{analysisResult.profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
              {/* 線上資料 */}
              <div className="space-y-4">
                {analysisResult.profile.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">LinkedIn</span>
                      <p className="text-gray-900 dark:text-white">
                        <a 
                          href={analysisResult.profile.linkedin.startsWith('http') ? analysisResult.profile.linkedin : `https://${analysisResult.profile.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 break-all"
                        >
                          {analysisResult.profile.linkedin}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {analysisResult.profile.github && (
                  <div className="flex items-center">
                    <Github className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">GitHub</span>
                      <p className="text-gray-900 dark:text-white">
                        <a 
                          href={analysisResult.profile.github.startsWith('http') ? analysisResult.profile.github : `https://${analysisResult.profile.github}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 break-all"
                        >
                          {analysisResult.profile.github}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {analysisResult.profile.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">個人網站</span>
                      <p className="text-gray-900 dark:text-white">
                        <a 
                          href={analysisResult.profile.website.startsWith('http') ? analysisResult.profile.website : `https://${analysisResult.profile.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 break-all"
                        >
                          {analysisResult.profile.website}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {analysisResult.profile.portfolio && (
                  <div className="flex items-center">
                    <Folder className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">作品集</span>
                      <p className="text-gray-900 dark:text-white">
                        <a 
                          href={analysisResult.profile.portfolio.startsWith('http') ? analysisResult.profile.portfolio : `https://${analysisResult.profile.portfolio}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 break-all"
                        >
                          {analysisResult.profile.portfolio}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* 個人簡介 */}
            {analysisResult.profile.brief_introduction && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">個人簡介</h4>
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  {analysisResult.profile.brief_introduction}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Compact Overview */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
          <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
            {analysisResult.education_background.length}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-300">學歷</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center">
          <User className="h-5 w-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
            {analysisResult.work_experiences.length}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-300">經歷</div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
          <Briefcase className="h-5 w-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-green-700 dark:text-green-400">
            {analysisResult.projects.length}
          </div>
          <div className="text-xs text-green-600 dark:text-green-300">項目</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-center">
          <Award className="h-5 w-5 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-orange-700 dark:text-orange-400">
            {analysisResult.achievements.length}
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-300">成就</div>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-3 text-center">
          <Code className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mx-auto mb-1" />
          <div className="text-lg font-bold text-cyan-700 dark:text-cyan-400">
            {allSkills.length}
          </div>
          <div className="text-xs text-cyan-600 dark:text-cyan-300">技能</div>
        </div>
      </div>
      {/* Education Background Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
            教育背景
          </CardTitle>
          <CardDescription>{analysisResult.education_summary}</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisResult.education_background.length > 0 ? (
            <div className="space-y-6">
              {analysisResult.education_background.map((edu, eduIndex) => (
                <div key={eduIndex} className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {edu.degree} - {edu.major}
                      </h4>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {edu.institution}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded">
                      {edu.duration}
                    </span>
                  </div>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      GPA: {edu.gpa}
                    </p>
                  )}
                  {edu.courses && edu.courses.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">相關課程：</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {edu.courses.map((course, courseIndex) => (
                          <span
                            key={courseIndex}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">學術成就：</span>
                      <ul className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {edu.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start mt-1">
                            <span className="text-blue-500 mr-2">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <GraduationCap className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到教育背景</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                AI無法從您的履歷中識別出教育背景資訊
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <User className="h-6 w-6 mr-2 text-purple-600" />
            工作經驗
          </CardTitle>
          <CardDescription>{analysisResult.work_experiences_summary}</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisResult.work_experiences.length > 0 ? (
            <div className="space-y-6">
              {analysisResult.work_experiences.map((exp, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {exp.position}
                      </h4>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {exp.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">技術棧：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {exp.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {exp.contribution && (
                      <div>
                        <span className="font-medium text-gray-600 dark:text-gray-400">主要貢獻：</span>
                        <p className="text-gray-800 dark:text-gray-200 mt-1">{exp.contribution}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <User className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到工作經驗</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                AI無法從您的履歷中識別出工作經歷描述
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Briefcase className="h-6 w-6 mr-2 text-green-600" />
            項目分析
          </CardTitle>
          <CardDescription>{analysisResult.projects_summary}</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisResult.projects.length > 0 ? (
            <div className="grid gap-6">
              {analysisResult.projects.map((project, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </h4>
                    {project.duration && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded">
                        {project.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {project.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">技術棧</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies && project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">角色</span>
                      <p className="text-gray-800 dark:text-gray-200 mt-1">{project.role}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600 dark:text-gray-400">主要貢獻</span>
                      <p className="text-gray-800 dark:text-gray-200 mt-1">{project.contribution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <Briefcase className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到項目信息</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                AI無法從您的履歷中識別出項目經驗，請檢查履歷內容是否包含項目描述
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Award className="h-6 w-6 mr-2 text-orange-600" />
            成就與亮點
          </CardTitle>
          <CardDescription>{analysisResult.achievements_summary}</CardDescription>
        </CardHeader>
        <CardContent>
          {analysisResult.achievements.length > 0 ? (
            <div className="grid gap-3">
              {analysisResult.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 flex-1">
                    {achievement}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <Award className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到成就信息</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                AI無法從您的履歷中識別出成就亮點，請檢查履歷內容是否包含量化的工作成果
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Code className="h-6 w-6 mr-2 text-green-600" />
            技能分析
          </CardTitle>
          <CardDescription>
            {analysisResult.expertise_summary || "從項目技術棧和專業技能中提取的綜合技能清單"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allSkills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {allSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <Code className="h-12 w-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到技能信息</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                AI無法從您的履歷中識別出技能專長，請檢查履歷內容是否包含技能描述
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 