'use client';

import { useState } from 'react';

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [additionalText, setAdditionalText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) { setError('請輸入履歷內容'); return; }

    setIsLoading(true); setError(null); setAnalysisResult('');
    try {
      const res = await fetch('/api/analyze/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText.trim(), text: additionalText.trim() || undefined })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`);
      setAnalysisResult(JSON.stringify(data.data, null, 2));
    } catch (err) {
      console.error('Resume analysis error:', err);
      setError(err instanceof Error ? err.message : '履歷分析失敗');
    } finally { setIsLoading(false); }
  };

  const clearForm = () => { setResumeText(''); setAdditionalText(''); setAnalysisResult(''); setError(null); };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">文字履歷分析器</h2>
          {resumeText && (<div className="text-sm text-gray-500">{resumeText.length} 字元</div>)}
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-2">履歷內容 <span className="text-red-500">*</span></label>
            <textarea id="resumeText" value={resumeText} onChange={(e) => setResumeText(e.target.value)} disabled={isLoading} placeholder="請貼上您的履歷內容，包括個人資訊、工作經驗、項目經歷、技能等..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" rows={12} />
            <div className="text-xs text-gray-500 mt-1">建議包含：個人資訊、工作經驗、項目經歷、技能、教育背景等</div>
          </div>
          <div>
            <label htmlFor="additionalText" className="block text-sm font-medium text-gray-700 mb-2">額外資訊 (可選)</label>
            <textarea id="additionalText" value={additionalText} onChange={(e) => setAdditionalText(e.target.value)} disabled={isLoading} placeholder="輸入任何額外的背景資訊、應徵職位、特殊要求等..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" rows={3} />
          </div>
        </div>
        <div className="mt-6 flex space-x-4">
          <button onClick={handleAnalyze} disabled={isLoading || !resumeText.trim()} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium">
            {isLoading ? (<div className="flex items-center justify-center"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>分析中...</div>) : ('開始分析')}
          </button>
          <button onClick={clearForm} disabled={isLoading} className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 transition-colors">清空</button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md"><div className="flex"><div className="text-red-400 mr-2">⚠️</div><p className="text-red-800">{error}</p></div></div>
        )}
      </div>
      {analysisResult && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800">分析結果</h3><div className="text-sm text-green-600 flex items-center"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>分析完成</div></div>
          <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-200">{analysisResult}</pre>
        </div>
      )}
    </div>
  );
} 