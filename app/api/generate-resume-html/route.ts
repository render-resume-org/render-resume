import { NextRequest, NextResponse } from 'next/server';
import { generatePdfHtml } from '@/features/resume/lib/pdf-renderer';
import { OptimizedResume } from '@/features/resume/types/resume';

export async function POST(request: NextRequest) {
  try {
    const { resumeData, templateId = 'standard' } = await request.json();

    if (!resumeData) {
      return NextResponse.json(
        { error: '需要提供履歷數據' },
        { status: 400 }
      );
    }

    // 使用新的 PDF 渲染器，基於 React 組件進行服務器端渲染
    const fullHtml = generatePdfHtml(resumeData as OptimizedResume, templateId);

    return NextResponse.json({
      success: true,
      html: fullHtml
    });

  } catch (error) {
    console.error('HTML 生成錯誤:', error);
    return NextResponse.json(
      { error: 'HTML 生成失敗', details: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}