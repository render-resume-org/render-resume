# Bullet System - 直觀的列點編輯系統

## 🎯 設計目標

提供類似 Notion 的直觀列點編輯體驗：
- **Enter 鍵**：在列點末尾創建新列點，自動對焦
- **Backspace 鍵**：刪除空列點，自動對焦到上一行
- **簡潔 API**：最少的配置，最大的功能
- **零魔法**：行為透明可預測

## 🏗️ 架構設計

```
BulletManager (單例)
├── 管理所有列點實例
├── 處理焦點導航邏輯
└── 提供簡潔的 API

useBulletPoint (Hook)
├── 自動註冊到 BulletManager
├── 處理鍵盤事件
└── 管理焦點狀態

BulletText (組件)
├── 使用 useBulletPoint
├── 保持原有預覽功能
└── 簡潔的 API 接口
```

## 🚀 使用方式

### 基本用法

```tsx
import { BulletText } from './bullet-system';

function OutcomesList({ outcomes, sectionIndex }) {
  return (
    <ul>
      {outcomes.map((text, index) => (
        <li key={index}>
          <BulletText
            text={text}
            groupId={`section-${sectionIndex}-outcomes`}
            index={index}
            onChange={(newText) => updateOutcome(index, newText)}
            onAddBullet={() => addOutcome(index)}
            onRemoveBullet={() => removeOutcome(index)}
          />
        </li>
      ))}
    </ul>
  );
}
```

### 完整功能

```tsx
<BulletText
  text="列點內容"
  groupId="unique-group-id"
  index={0}
  
  // 基本回調
  onChange={(text) => console.log('文本變化:', text)}
  onAddBullet={() => console.log('新增列點')}
  onRemoveBullet={() => console.log('刪除列點')}
  
  // 預覽功能（可選）
  highlightType="set"
  previewOriginal="原始文本"
  previewReplaceWith="預覽文本"
  
  // 樣式
  className="custom-styles"
/>
```

## 📋 API 參考

### BulletText Props

| 參數 | 類型 | 必需 | 說明 |
|------|------|------|------|
| `text` | `string` | ✓ | 列點文本內容 |
| `groupId` | `string` | ✓ | 群組識別符，同組列點可互相導航 |
| `index` | `number` | ✓ | 列點在群組中的索引 |
| `onChange` | `(text: string) => void` | | 文本變化回調 |
| `onAddBullet` | `() => void` | | 新增列點回調 |
| `onRemoveBullet` | `() => void` | | 刪除列點回調 |
| `highlightType` | `'set' \| 'insert'` | | 預覽高亮類型 |
| `previewOriginal` | `string` | | 預覽模式原始文本 |
| `previewReplaceWith` | `string` | | 預覽模式替換文本 |
| `className` | `string` | | 自定義 CSS 類名 |

## 🎮 鍵盤操作

| 按鍵 | 操作 | 行為 |
|------|------|------|
| `Enter` | 在末尾 | 創建新列點並自動對焦 |
| `Enter` | 在中間 | 插入換行符 |
| `Backspace` | 空列點 | 刪除列點並對焦到上一行 |
| `Backspace` | 非空列點 | 正常刪除字符 |

## 🔧 內部機制

1. **註冊系統**：每個 BulletText 自動註冊到 BulletManager
2. **事件處理**：統一的鍵盤事件處理邏輯
3. **焦點管理**：基於索引的簡單對焦機制
4. **生命週期**：自動清理，無內存泄漏

## ✅ 優勢

- **簡單**：只需要 `groupId` 和 `index` 兩個必需參數
- **直觀**：行為符合用戶期望，如 Notion
- **高效**：最少的 DOM 操作和事件監聽
- **可靠**：穩定的狀態管理，無競態條件
- **兼容**：完全兼容現有的預覽功能

## 🚫 不再需要的概念

- ❌ `data-inline-group` 屬性
- ❌ `data-inline-order` 屬性  
- ❌ 複雜的 ID 生成系統
- ❌ 事件派發和監聽
- ❌ `bulletId` 參數
- ❌ 手動焦點管理