import { generatePdfHtmlTemplate } from '@/utils/pdf-styles';
import { toast } from 'sonner';

export interface PdfGenerationOptions {
  filename?: string;
  resumeElementId?: string;
}

/**
 * PDF 生成服務
 * 統一管理所有 PDF 生成相關的邏輯
 */
export class PdfGenerator {
  /**
   * 從 DOM 元素生成 PDF
   */
  static async generateFromDom(options: PdfGenerationOptions = {}): Promise<void> {
    const { 
      filename = `我的履歷.pdf`,
      resumeElementId = 'resume-content' 
    } = options;

    const resumeElement = document.getElementById(resumeElementId);
    if (!resumeElement) {
      throw new Error('找不到履歷元素');
    }

    // 生成 DOM 快照
    const domSnapshot = generatePdfHtmlTemplate(resumeElement.outerHTML);

    // 調用 API 生成 PDF
    const response = await fetch('/api/generate-pdf-from-dom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domSnapshot,
        filename,
      }),
    });

    if (!response.ok) {
      const errorResult = await response.json();
      throw new Error(errorResult.error || 'PDF 生成失敗');
    }

    // 下載 PDF
    await this.downloadPdfFromResponse(response, filename);
  }

  /**
   * 生成 PDF（主要方法）
   */
  static async generate(options: PdfGenerationOptions = {}): Promise<void> {
    try {
      toast.loading('正在生成 PDF...', { id: 'pdf-generation' });

      await this.generateFromDom(options);

      toast.success('PDF 已成功下載！', { id: 'pdf-generation' });
    } catch (error) {
      console.error('PDF 生成錯誤:', error);
      toast.error(
        `PDF 生成失敗: ${error instanceof Error ? error.message : '未知錯誤'}`, 
        { id: 'pdf-generation' }
      );
      throw error;
    }
  }

  /**
   * 處理 PDF 下載回應
   */
  private static async downloadPdfFromResponse(response: Response, filename: string): Promise<void> {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
} 