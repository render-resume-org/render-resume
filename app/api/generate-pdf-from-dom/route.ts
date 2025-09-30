import { logResumeDownload } from '@/features/account/services/action-logs';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { domSnapshot, filename = 'resume.pdf' } = await request.json();

    if (!domSnapshot) {
      return NextResponse.json({ error: '需要提供 DOM 快照' }, { status: 400 });
    }

    let executablePath = '';
    let launchArgs = [];
    let headless: boolean | 'shell' = true;

    // @sparticuz/chromium 只能在 Vercel (Linux x64) 運行，本地（macOS/Windows）要用系統的 Chrome/Chromium。
    if (process.env.NODE_ENV === 'production') {
      // ✅ Vercel 環境
      executablePath = await chromium.executablePath();
      launchArgs = chromium.args;
      headless = true;
    } else {
      // ✅ 本地環境 (macOS/Linux)
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

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
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