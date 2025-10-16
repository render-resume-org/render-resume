import { logResumeDownload } from '@/features/account/services/action-logs';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { domSnapshot, filename = 'resume.pdf' } = await request.json();

    if (!domSnapshot) {
      return NextResponse.json({ error: '需要提供 DOM 快照' }, { status: 400 });
    }

    let browser;

    // 根據環境使用不同的 Chromium 配置
    if (process.env.NODE_ENV === 'production') {
      // Vercel 環境：使用 @sparticuz/chromium-min
      // 從 GitHub CDN 下載 Chromium binary（第一次啟動會自動下載並快取到 /tmp）
      const executablePath = await chromium.executablePath(
        'https://github.com/Sparticuz/chromium/releases/download/v133.0.0/chromium-v133.0.0-pack.tar'
      );

      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          '--font-render-hinting=none',
          '--disable-font-subpixel-positioning',
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
    } else {
      // 本地開發環境：使用系統安裝的 Chrome/Chromium
      const possiblePaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
      ];

      let executablePath = '';
      for (const path of possiblePaths) {
        if (existsSync(path)) {
          executablePath = path;
          break;
        }
      }

      if (!executablePath) {
        throw new Error('找不到 Chrome/Chromium 執行檔，請確認已安裝 Chrome 或 Chromium');
      }

      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--font-render-hinting=none',
        ],
        executablePath,
        headless: true,
      });
    }

    const page = await browser.newPage();

    // 設置 HTML 內容並等待載入完成
    await page.setContent(domSnapshot, {
      waitUntil: 'load', // 使用 'load' 而非 'networkidle0' 以提升效能
      timeout: 30000,
    });

    // 等待字體完全載入
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 生成 PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
      preferCSSPageSize: false,
    });

    await browser.close();

    // 記錄下載活動
    try {
      await logResumeDownload(`生成了 PDF 檔案：${filename}`);
    } catch (error) {
      console.error('Failed to log download activity:', error);
    }

    return new Response(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (error) {
    console.error('PDF 生成錯誤:', error);
    return NextResponse.json(
      { error: 'PDF 生成失敗', details: error instanceof Error ? error.message : '未知錯誤' },
      { status: 500 }
    );
  }
}
