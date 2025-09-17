import { PatchOpUnion } from '@/components/smart-chat/types';

/**
 * 将 patchOps 解析成人类可读的操作指示
 */
export function parsePatchOpsToHumanReadable(patchOps: PatchOpUnion[]): string[] {
  return patchOps.map((op, index) => {
    const pathParts = parsePath(op.path);
    
    switch (op.op) {
      case 'set':
        return `${index + 1}. 將 ${pathParts.humanReadable} 改成「${op.value}」`;
      
      case 'insert':
        return `${index + 1}. 在 ${pathParts.humanReadable} 中新增「${op.value}」`;
      
      case 'remove':
        return `${index + 1}. 將 ${pathParts.humanReadable} 刪除`;
      
      default:
        return `${index + 1}. 未知操作：${JSON.stringify(op)}`;
    }
  });
}

/**
 * 解析路径并转换为人类可读格式
 */
function parsePath(path: string): { humanReadable: string } {
  // 移除数组索引，转换为人类可读格式
  const humanReadable = path
    .replace(/\[(\d+)\]/g, (match, index) => {
      const numIndex = parseInt(index);
      return `第${numIndex + 1}個`;
    })
    .replace(/\./g, '的')
    .replace(/^summary$/, '摘要')
    .replace(/^experience$/, '工作經驗')
    .replace(/^projects$/, '專案經驗')
    .replace(/^education$/, '教育背景')
    .replace(/^skills$/, '技能專長')
    .replace(/^title$/, '職位標題')
    .replace(/^company$/, '公司名稱')
    .replace(/^duration$/, '工作期間')
    .replace(/^achievements$/, '（舊）成就項目')
    .replace(/^outcomes$/, '列點')
    .replace(/^responsibilities$/, '職責描述')
    .replace(/^details$/, '詳細資訊')
    .replace(/^description$/, '描述')
    .replace(/^name$/, '姓名')
    .replace(/^degree$/, '學位')
    .replace(/^school$/, '學校')
    .replace(/^major$/, '主修')
    .replace(/^gpa$/, 'GPA')
    .replace(/^certifications$/, '證照')
    .replace(/^languages$/, '語言能力')
    .replace(/^interests$/, '興趣愛好');

  return { humanReadable };
}

/**
 * 获取操作类型的简短描述
 */
export function getOperationTypeDescription(op: PatchOpUnion): string {
  switch (op.op) {
    case 'set':
      return '修改';
    case 'insert':
      return '新增';
    case 'remove':
      return '刪除';
    default:
      return '未知';
  }
}
