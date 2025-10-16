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

    let executablePath = '';
    let launchArgs: string[] = [];
    let headless: boolean | 'shell' = true;

    // @sparticuz/chromium-min 只能在 Vercel (Linux x64) 運行，本地（macOS/Windows）要用系統的 Chrome/Chromium。
    if (process.env.NODE_ENV === 'production') {
      // Vercel 環境
      // executablePath() 可以接受以下參數：
      // 1. undefined：使用內建預設路徑（最簡單，推薦）
      // 2. 本地路徑：例如 "/opt/chromium"（需要自行上傳 Brotli 檔案到 Lambda Layer）
      // 3. 遠端 URL：例如 "https://example.com/chromiumPack.tar"（從遠端下載 Chromium）
      const REMOTE_PATH = process.env.CHROMIUM_REMOTE_EXEC_PATH; // 可選：可以留空使用預設值
      executablePath = await chromium.executablePath(REMOTE_PATH);
      launchArgs = [
        ...chromium.args,
        '--font-render-hinting=none',
        '--disable-font-subpixel-positioning',
      ];
      headless = true;
    } else {
      // 本地環境 (macOS/Linux)
      const possiblePaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
      ];

      for (const path of possiblePaths) {
        if (existsSync(path)) {
          executablePath = path;
          break;
        }
      }

      launchArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--font-render-hinting=none',
      ];
    }

    const browser = await puppeteer.launch({
      args: launchArgs,
      executablePath,
      headless,
    });

    const page = await browser.newPage();
    await page.setContent(domSnapshot, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // 等待額外時間確保字體完全載入和渲染
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
      preferCSSPageSize: false,
    });

    await browser.close();

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
