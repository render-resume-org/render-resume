/**
 * 清除智慧問答相關的 sessionStorage 數據
 */
export function clearSessionData() {
  try {
    sessionStorage.removeItem('analysisResult');
    sessionStorage.removeItem('chatHistory');
    sessionStorage.removeItem('chatSuggestions');
    console.log('🧹 清除會話數據完成');
  } catch (error) {
    console.warn('⚠️ 清除會話數據失敗:', error);
  }
}