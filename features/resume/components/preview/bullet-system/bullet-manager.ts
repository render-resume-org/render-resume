/**
 * BulletManager - 中央化管理所有列點的焦點和導航
 * 
 * 設計原則：
 * - 簡單：使用數字索引而非複雜的 ID 系統
 * - 可預測：焦點移動邏輯透明易懂
 * - 高效：最少的 DOM 查詢和事件處理
 */

export interface BulletPoint {
  id: string;
  groupId: string;
  index: number;
  element: HTMLElement;
  isEmpty: () => boolean;
  focus: (position?: 'start' | 'end') => void;
}

export interface BulletGroup {
  id: string;
  bullets: Map<number, BulletPoint>;
}

class BulletManagerClass {
  private groups = new Map<string, BulletGroup>();
  
  /**
   * 註冊一個列點到指定群組
   */
  register(bullet: BulletPoint): void {
    if (!this.groups.has(bullet.groupId)) {
      this.groups.set(bullet.groupId, {
        id: bullet.groupId,
        bullets: new Map()
      });
    }
    
    const group = this.groups.get(bullet.groupId)!;
    group.bullets.set(bullet.index, bullet);
  }
  
  /**
   * 註銷一個列點
   */
  unregister(groupId: string, index: number): void {
    const group = this.groups.get(groupId);
    if (group) {
      group.bullets.delete(index);
      if (group.bullets.size === 0) {
        this.groups.delete(groupId);
      }
    }
  }
  
  /**
   * 移動焦點到下一個列點（用於 Enter 鍵）
   */
  focusNext(groupId: string, currentIndex: number): boolean {
    const group = this.groups.get(groupId);
    if (!group) return false;
    
    const nextIndex = currentIndex + 1;
    const nextBullet = group.bullets.get(nextIndex);
    
    if (nextBullet) {
      nextBullet.focus('start');
      return true;
    }
    
    return false;
  }
  
  /**
   * 移動焦點到上一個列點（用於刪除空列點）
   */
  focusPrevious(groupId: string, currentIndex: number): boolean {
    const group = this.groups.get(groupId);
    if (!group) return false;
    
    const prevIndex = currentIndex - 1;
    const prevBullet = group.bullets.get(prevIndex);
    
    if (prevBullet) {
      prevBullet.focus('end');
      return true;
    }
    
    return false;
  }
  
  /**
   * 獲取群組中的所有列點（按索引排序）
   */
  getBulletsInGroup(groupId: string): BulletPoint[] {
    const group = this.groups.get(groupId);
    if (!group) return [];
    
    return Array.from(group.bullets.entries())
      .sort(([a], [b]) => a - b)
      .map(([, bullet]) => bullet);
  }
  
  /**
   * 調試用：打印當前狀態
   */
  debug(): void {
    console.log('BulletManager State:', {
      groups: Array.from(this.groups.entries()).map(([id, group]) => ({
        id,
        bulletCount: group.bullets.size,
        bulletIndexes: Array.from(group.bullets.keys()).sort()
      }))
    });
  }
}

// 單例實例
export const BulletManager = new BulletManagerClass();