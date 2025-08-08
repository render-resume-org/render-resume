export function validateFileType(fileName: string): boolean {
  const supported = ['pdf','jpg','jpeg','png','gif','webp','txt','md','json','csv'];
  const ext = fileName.split('.').pop()?.toLowerCase();
  return !!ext && supported.includes(ext);
}

export function getFileTypeCategory(fileName: string): 'PDF' | 'IMAGES' | 'DOCUMENTS' | null {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  if (ext === 'pdf') return 'PDF';
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return 'IMAGES';
  if (['txt','md','json','csv'].includes(ext)) return 'DOCUMENTS';
  return null;
}

export function requiresVisionModel(files: File[]): boolean {
  return files.some(file => getFileTypeCategory(file.name) !== 'DOCUMENTS');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes','KB','MB','GB'];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + ' ' + sizes[i];
}

export function getTotalFileSize(files: File[]): number {
  return files.reduce((total, f) => total + f.size, 0);
}
