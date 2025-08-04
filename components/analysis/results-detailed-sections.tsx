import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { Award, Briefcase, Code, FileText, Folder, Github, Globe, GraduationCap, Linkedin, Mail, MapPin, Phone, User, UserCircle } from "lucide-react";

interface ResultsDetailedSectionsProps {
  analysisResult: ResumeAnalysisResult;
  allSkills: string[];
}

export function ResultsDetailedSections({ analysisResult }: ResultsDetailedSectionsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <FileText className="h-6 w-6 mr-2 text-gray-600" />
          詳細內容分析
        </h2>
      </div>

      {/* Resume Highlights Section */}
      {analysisResult.highlights && analysisResult.highlights.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Award className="h-6 w-6 mr-2 text-green-600" />
              履歷亮點
            </CardTitle>
            <CardDescription>
              AI 識別出的履歷優勢與亮點
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResult.highlights.map((highlight, index) => (
                <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    {highlight.title}
                  </h4>
                  <p className="text-green-700 dark:text-green-300 mb-2">
                    {highlight.description}
                  </p>
                                      {highlight.excerpt && (
                      <div className="text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 p-2 rounded italic">
                        &ldquo;{highlight.excerpt}&rdquo;
                      </div>
                    )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resume Issues Section */}
      {analysisResult.issues && analysisResult.issues.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="h-6 w-6 mr-2 text-orange-600" />
              需改進之處
            </CardTitle>
            <CardDescription>
              AI 識別出的需要改進或補強的履歷內容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResult.issues.map((issue, index) => (
                <div key={index} className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    {issue.title}
                  </h4>
                  <p className="text-orange-700 dark:text-orange-300 mb-3">
                    {issue.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-orange-800 dark:text-orange-200">建議改進：</span>
                      <p className="text-orange-700 dark:text-orange-300">{issue.suggested_change}</p>
                    </div>
                    
                    {issue.missing_information && (
                      <div>
                        <span className="font-medium text-orange-800 dark:text-orange-200">缺失資訊：</span>
                        <p className="text-orange-700 dark:text-orange-300">{issue.missing_information}</p>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-orange-800 dark:text-orange-200">影響：</span>
                      <p className="text-orange-700 dark:text-orange-300">{issue.impact}</p>
                    </div>
                    
                    {issue.excerpt && (
                      <div className="text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/40 p-2 rounded italic">
                        &ldquo;{issue.excerpt}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Section */}
      {analysisResult.resume?.personalInfo && Object.keys(analysisResult.resume.personalInfo).length > 0 && (
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
                {analysisResult.resume.personalInfo.name && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">姓名</span>
                      <p className="text-gray-900 dark:text-white">{analysisResult.resume.personalInfo.name}</p>
                    </div>
                  </div>
                )}
                {analysisResult.resume.personalInfo.title && (
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">專業頭銜</span>
                      <p className="text-gray-900 dark:text-white">{analysisResult.resume.personalInfo.title}</p>
                    </div>
                  </div>
                )}
                {analysisResult.resume.personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">電子郵件</span>
                      <p className="text-gray-900 dark:text-white">
                        <a href={`mailto:${analysisResult.resume.personalInfo.email}`} className="text-indigo-600 hover:text-indigo-800">
                          {analysisResult.resume.personalInfo.email}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {analysisResult.resume.personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">電話</span>
                      <p className="text-gray-900 dark:text-white">{analysisResult.resume.personalInfo.phone}</p>
                    </div>
                  </div>
                )}
                {analysisResult.resume.personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">地點</span>
                      <p className="text-gray-900 dark:text-white">{analysisResult.resume.personalInfo.location}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 線上資料 */}
              <div className="space-y-4">
                {analysisResult.resume.personalInfo.links?.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">LinkedIn</span>
                      <p className="text-gray-900 dark:text-white">
                        <a 
                          href={analysisResult.resume.personalInfo.links.linkedin.startsWith('http') ? analysisResult.resume.personalInfo.links.linkedin : `https://${analysisResult.resume.personalInfo.links.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 break-all"
                        >
                          {analysisResult.resume.personalInfo.links.linkedin}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {analysisResult.resume.personalInfo.links?.github && (
                  <div className="flex items-center">
                    <Github className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">GitHub</span>
                      <p className="text-gray-900 dark:text-white">
                        <a 
                          href={analysisResult.resume.personalInfo.links.github.startsWith('http') ? analysisResult.resume.personalInfo.links.github : `https://${analysisResult.resume.personalInfo.links.github}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 break-all"
                        >
                          {analysisResult.resume.personalInfo.links.github}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {analysisResult.resume.personalInfo.links?.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">個人網站</span>
                      <p className="text-gray-900 dark:text-white">
                        <a 
                          href={analysisResult.resume.personalInfo.links.website.startsWith('http') ? analysisResult.resume.personalInfo.links.website : `https://${analysisResult.resume.personalInfo.links.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 break-all"
                        >
                          {analysisResult.resume.personalInfo.links.website}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
                {analysisResult.resume.personalInfo.links?.portfolio && (
                  <div className="flex items-center">
                    <Folder className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">作品集</span>
                      <p className="text-gray-900 dark:text-white">
                        <a 
                          href={analysisResult.resume.personalInfo.links.portfolio.startsWith('http') ? analysisResult.resume.personalInfo.links.portfolio : `https://${analysisResult.resume.personalInfo.links.portfolio}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 break-all"
                        >
                          {analysisResult.resume.personalInfo.links.portfolio}
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Section */}
      {analysisResult.resume?.summary && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="h-6 w-6 mr-2 text-blue-600" />
              個人簡介
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">{analysisResult.resume.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Experience Section */}
      {analysisResult.resume?.experience && analysisResult.resume.experience.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Briefcase className="h-6 w-6 mr-2 text-purple-600" />
              工作經驗
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysisResult.resume.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-purple-200 pl-4">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{exp.title}</h4>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exp.period}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{exp.description}</p>
                  {exp.outcomes && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                      <span className="font-medium text-purple-800 dark:text-purple-200">成果與貢獻：</span>
                      <p className="text-purple-700 dark:text-purple-300">{exp.outcomes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education Section */}
      {analysisResult.resume?.education && analysisResult.resume.education.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <GraduationCap className="h-6 w-6 mr-2 text-indigo-600" />
              教育背景
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResult.resume.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-indigo-200 pl-4">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{edu.degree}</h4>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">{edu.school}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{edu.period}</p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">GPA: {edu.gpa}</p>
                  )}
                  {edu.relevant_courses && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">相關課程：{edu.relevant_courses}</p>
                  )}
                  {edu.outcomes && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded mt-2">
                      <span className="font-medium text-indigo-800 dark:text-indigo-200">學業成果：</span>
                      <p className="text-indigo-700 dark:text-indigo-300">{edu.outcomes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Section */}
      {analysisResult.resume?.projects && analysisResult.resume.projects.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Code className="h-6 w-6 mr-2 text-green-600" />
              專案經驗
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysisResult.resume.projects.map((project, index) => (
                <div key={index} className="border-l-4 border-green-200 pl-4">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{project.name}</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{project.description}</p>
                  {project.technologies && (
                    <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                      <span className="font-medium">技術：</span>{project.technologies}
                    </p>
                  )}
                  {project.outcomes && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                      <span className="font-medium text-green-800 dark:text-green-200">專案成果：</span>
                      <p className="text-green-700 dark:text-green-300">{project.outcomes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills Section */}
      {analysisResult.resume?.skills && analysisResult.resume.skills.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Code className="h-6 w-6 mr-2 text-orange-600" />
              技能專長
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisResult.resume.skills.map((skillGroup, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{skillGroup.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}