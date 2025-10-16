/**
 * PDF 專用樣式模板
 * 集中管理 PDF 生成時需要的 CSS 樣式
 */

export const PDF_BASE_STYLES = `
/* 確保 PDF 專用樣式 */
body {
  margin: 0;
  padding: 0;
  background: white;
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/* A4 頁面尺寸 */
.pdf-container {
  width: 100%;
  height: auto;
  margin: 0;
  background: white;
  box-sizing: border-box;
  padding: 0;
}

/* 隱藏不需要的元素 */
button, [role="button"] {
  display: none !important;
}

/* 確保列印樣式 */
@media print {
  .pdf-container {
    width: 100%;
    height: auto;
    margin: 0;
    box-shadow: none;
    padding: 0;
  }
}
`;

export const PDF_FONT_STYLES = `
/* 字體載入 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700&display=swap');

/* 確保中文字體正確顯示 */
.font-inter { font-family: 'Inter', 'Noto Sans TC', sans-serif !important; }
.font-noto-tc { font-family: 'Noto Sans TC', sans-serif !important; }
.font-sans { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important; }
.font-serif { font-family: 'Times New Roman', Times, Georgia, 'Noto Serif TC', serif !important; }

/* 強制 serif 字體顯示 - 完全匹配預覽 - 最高優先級 */
div.font-serif,
div.font-serif *,
.font-serif,
.font-serif * {
  font-family: 'Times New Roman', Times, Georgia, 'Noto Serif TC', serif !important;
}

/* 強制 sans-serif 字體顯示 - 最高優先級 */
div.font-sans,
div.font-sans *,
.font-sans,
.font-sans * {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
}

/* 確保履歷內容使用正確的字體 - 針對 #resume-content */
#resume-content.font-serif,
#resume-content.font-serif *,
#resume-content.font-serif h1,
#resume-content.font-serif h2,
#resume-content.font-serif h3,
#resume-content.font-serif p,
#resume-content.font-serif span,
#resume-content.font-serif div {
  font-family: 'Times New Roman', Times, Georgia, 'Noto Serif TC', serif !important;
}

#resume-content.font-sans,
#resume-content.font-sans *,
#resume-content.font-sans h1,
#resume-content.font-sans h2,
#resume-content.font-sans h3,
#resume-content.font-sans p,
#resume-content.font-sans span,
#resume-content.font-sans div {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
}
`;

export const PDF_LAYOUT_STYLES = `
/* 移除可能的互動元素樣式 */
.hover\\:bg-gray-50:hover { background-color: transparent !important; }
.cursor-pointer { cursor: default !important; }

/* 確保內容適合 A4 */
.px-16 { padding-left: 15mm; padding-right: 15mm; }
.py-12 { padding-top: 15mm; padding-bottom: 15mm; }

/* 頁面分割處理 */
.page-break-inside-avoid {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* 確保內容不會強制分頁 */
.pdf-container {
  height: auto !important;
  min-height: auto !important;
}

/* 確保履歷內容不會強制最小高度 */
#resume-content {
  height: auto !important;
  min-height: auto !important;
}

/* Flexbox */
.flex { display: flex; }
.flex-wrap { flex-wrap: wrap; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.flex-1 { flex: 1 1 0%; }
.flex-shrink-0 { flex-shrink: 0; }

/* 網格和佈局 */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

export const PDF_UTILITY_STYLES = `
/* 確保顏色正確顯示 */
.text-gray-900 { color: rgb(17 24 39) !important; }
.text-gray-600 { color: rgb(75 85 99) !important; }
.text-gray-500 { color: rgb(107 114 128) !important; }
.text-gray-400 { color: rgb(156 163 175) !important; }
.text-cyan-600 { color: rgb(8 145 178) !important; }
.text-blue-600 { color: rgb(37 99 235) !important; }
.text-emerald-600 { color: rgb(5 150 105) !important; }
.text-purple-600 { color: rgb(147 51 234) !important; }
.text-orange-600 { color: rgb(234 88 12) !important; }
.bg-cyan-600 { background-color: rgb(8 145 178) !important; }
.bg-blue-600 { background-color: rgb(37 99 235) !important; }
.bg-emerald-600 { background-color: rgb(5 150 105) !important; }
.bg-purple-600 { background-color: rgb(147 51 234) !important; }
.bg-orange-600 { background-color: rgb(234 88 12) !important; }

/* 背景色 */
.bg-white { background-color: white; }
.bg-cyan-100 { background-color: rgb(207 250 254); }

/* 字體大小和行高 */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }

/* 字體粗細 */
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.font-medium { font-weight: 500; }

/* 文字對齊 */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

/* 文字變換 */
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }

/* 字符間距 */
.tracking-wide { letter-spacing: 0.025em; }
.tracking-widest { letter-spacing: 0.1em; }

/* 間距 */
.mb-8 { margin-bottom: 2rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-1\\.5 { margin-bottom: 0.375rem; }
.mt-12 { margin-top: 3rem; }
.mt-1 { margin-top: 0.25rem; }
.ml-4 { margin-left: 1rem; }
.ml-2 { margin-left: 0.5rem; }
.mr-2 { margin-right: 0.5rem; }
.mr-1 { margin-right: 0.25rem; }

/* 間距相關 */
.space-y-6 > * + * { margin-top: 1.5rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-1 > * + * { margin-top: 0.25rem; }
.space-x-2 > * + * { margin-left: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-2 { gap: 0.5rem; }
.gap-1 { gap: 0.25rem; }

/* 內邊距 */
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.pb-1 { padding-bottom: 0.25rem; }
.pl-4 { padding-left: 1rem; }

/* 其他實用類別 */
.rounded-full { border-radius: 9999px; }
.list-disc { list-style-type: disc; }
.list-inside { list-style-position: inside; }
.leading-relaxed { line-height: 1.625; }
.border-b { border-bottom: 1px solid; }
.border-black { border-color: black; }
.border-l-2 { border-left: 2px solid; }
.border-cyan-200 { border-color: rgb(165 243 252); }
.w-fit { width: fit-content; }
.w-4 { width: 1rem; }
.h-4 { height: 1rem; }

/* 履歷專用樣式 */
.resume-section-title { 
  border-bottom: 1px solid black; 
  padding-bottom: 0.25rem; 
  margin-bottom: 1rem; 
}
`;

/**
 * 生成完整的 PDF 樣式字串
 */
export function generatePdfStyles(): string {
  return [
    PDF_BASE_STYLES,
    PDF_FONT_STYLES, 
    PDF_LAYOUT_STYLES,
    PDF_UTILITY_STYLES
  ].join('\n');
}

/**
 * 生成完整的 HTML 模板
 */
export function generatePdfHtmlTemplate(resumeContent: string): string {
  return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume PDF</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${generatePdfStyles()}
  </style>
</head>
<body>
  <div class="pdf-container">
    ${resumeContent}
  </div>
</body>
</html>
  `.trim();
}