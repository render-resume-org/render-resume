import { generatePdfHtmlTemplate } from '@/lib/pdf-styles';
import { toast } from 'sonner';

export interface PdfGenerationOptions {
  filename?: string;
  method?: 'dom-snapshot' | 'traditional';
  resumeElementId?: string;
}

/**
 * PDF 生成服務
 * 統一管理所有 PDF 生成相關的邏輯
 */
export class PdfGenerator {
  /**
   * 從 DOM 元素生成 PDF（推薦方式）
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
   * 傳統方式生成 PDF（備用）
   */
  static async generateTraditional(
    resumeData: unknown, 
    templateId: string, 
    options: PdfGenerationOptions = {}
  ): Promise<void> {
    const { filename = `履歷_${new Date().toISOString().slice(0, 10)}.pdf` } = options;

    // 首先生成 HTML
    const htmlResponse = await fetch('/api/generate-resume-html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData,
        templateId,
      }),
    });

    const htmlResult = await htmlResponse.json();
    
    if (!htmlResult.success) {
      throw new Error(htmlResult.error || 'HTML 生成失敗');
    }

    // 然後生成 PDF
    const pdfResponse = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        htmlContent: htmlResult.html,
        filename,
      }),
    });

    if (!pdfResponse.ok) {
      const errorResult = await pdfResponse.json();
      throw new Error(errorResult.error || 'PDF 生成失敗');
    }

    // 下載 PDF
    await this.downloadPdfFromResponse(pdfResponse, filename);
  }

  /**
   * 自動選擇最佳生成方式
   */
  static async generate(
    resumeDataOrOptions?: unknown, 
    templateId?: string, 
    options: PdfGenerationOptions = {}
  ): Promise<void> {
    try {
      toast.loading('正在生成 PDF...', { id: 'pdf-generation' });

      // 優先使用 DOM 快照方式
      if (document.getElementById(options.resumeElementId || 'resume-content')) {
        await this.generateFromDom(options);
      } else {
        // 備用傳統方式
        toast.loading('使用備用方法生成 PDF...', { id: 'pdf-generation' });
        await this.generateTraditional(resumeDataOrOptions, templateId || 'standard', options);
      }

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