// import { logResumeDownload } from '@/features/account/services/action-logs';
// import chromium from '@sparticuz/chromium-min';
// import { existsSync } from 'fs';
// import { NextRequest, NextResponse } from 'next/server';
// import puppeteer from 'puppeteer-core';

// Temporary placeholder to make this a valid module
export {};

// export async function POST(request: NextRequest) {
//   try {
//     const { htmlContent, filename = 'resume.pdf', useDomSnapshot = false } = await request.json();

//     if (!htmlContent) {
//       return NextResponse.json(
//         { error: '需要提供 HTML 內容' },
//         { status: 400 }
//       );
//     }

//     // 設定 Chromium 執行路徑
//     let executablePath = '';
//     let launchArgs = [];
    
//     if (process.env.NODE_ENV === 'production') {
//       // 生產環境使用 @sparticuz/chromium-min
//       executablePath = await chromium.executablePath('/opt/aws/utils/chromium');
//       launchArgs = chromium.args;
//     } else {
//       // 開發環境使用系統安裝的 Chrome/Chromium
//       // macOS 常見路徑
//       const possiblePaths = [
//         '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
//         '/Applications/Chromium.app/Contents/MacOS/Chromium',
//         '/usr/bin/chromium-browser',
//         '/usr/bin/google-chrome-stable',
//         '/usr/bin/google-chrome',
//       ];
      
//       for (const path of possiblePaths) {
//         if (existsSync(path)) {
//           executablePath = path;
//           break;
//         }
//       }
      
//       launchArgs = [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-web-security',
//         '--disable-features=VizDisplayCompositor',
//       ];
//     }
    
//     const browser = await puppeteer.launch({
//       args: launchArgs,
//       executablePath,
//       headless: true,
//     });

//     const page = await browser.newPage();
    
//     if (useDomSnapshot) {
//       // 使用 DOM 快照模式 - 直接使用客戶端提供的 HTML
//       await page.setContent(htmlContent, {
//         waitUntil: 'networkidle0',
//         timeout: 30000,
//       });
//     } else {
//       // 傳統模式 - 使用伺服器端生成的 HTML
//       await page.setContent(htmlContent, {
//         waitUntil: 'networkidle0',
//         timeout: 30000,
//       });
//     }

//     // 確保頁面完全載入
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // 設定頁面視口大小為 A4
//     await page.setViewport({
//       width: 794, // A4 寬度 (210mm)
//       height: 1123, // A4 高度 (297mm)
//       deviceScaleFactor: 1,
//     });

//     // 生成 PDF
//     const pdfBuffer = await page.pdf({
//       format: 'A4',
//       printBackground: true,
//       margin: {
//         top: '15mm',
//         right: '15mm',
//         bottom: '15mm',
//         left: '15mm',
//       },
//       preferCSSPageSize: true,
//       scale: 1.0,
//       displayHeaderFooter: false,
//     });

//     await browser.close();

//     // Log download activity
//     try {
//       await logResumeDownload(`生成了 PDF 檔案：${filename}`);
//     } catch (error) {
//       console.error('Failed to log download activity:', error);
//     }

//     // 返回 PDF 文件
//     return new Response(Buffer.from(pdfBuffer), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
//         'Cache-Control': 'no-cache',
//       },
//     });

//   } catch (error) {
//     console.error('PDF 生成錯誤:', error);
//     return NextResponse.json(
//       { 
//         error: 'PDF 生成失敗', 
//         details: error instanceof Error ? error.message : '未知錯誤',
//         stack: error instanceof Error ? error.stack : undefined
//       },
//       { status: 500 }
//     );
//   }
// }