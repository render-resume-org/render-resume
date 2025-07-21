# Promo Code 競態條件修復

## 問題描述

原來的 promo code 兌換邏輯存在競態條件問題：

1. **並發兌換**：多個用戶同時兌換同一個一次性 promo code 時，可能都會通過檢查
2. **重複訂閱**：導致創建多個訂閱記錄
3. **狀態不一致**：只有最後一個請求會成功更新 `redeemed_by` 字段

## 解決方案

### 1. 資料庫函數

創建了 `redeem_promo_code` PostgreSQL 函數來處理原子性操作：

```sql
-- 執行 database-functions.sql 中的函數定義
```

### 2. 函數特點

- **原子性操作**：使用 `FOR UPDATE SKIP LOCKED` 鎖定 promo code 記錄
- **事務安全**：所有操作在單個事務中執行
- **錯誤處理**：詳細的錯誤訊息和狀態碼
- **並發控制**：防止多個請求同時處理同一個 promo code

### 3. 部署步驟

#### 步驟 1: 執行資料庫函數

在 Supabase SQL Editor 中執行 `database-functions.sql` 的內容：

```sql
-- 複製並執行 database-functions.sql 中的內容
```

#### 步驟 2: 驗證函數

測試函數是否正常工作：

```sql
-- 測試函數（替換為實際的 promo code 和用戶 ID）
SELECT redeem_promo_code('TEST_CODE', 'user-uuid-here');
```

#### 步驟 3: 檢查權限

確保 `authenticated` 角色有執行權限：

```sql
GRANT EXECUTE ON FUNCTION redeem_promo_code(TEXT, UUID) TO authenticated;
```

### 4. API 更改

更新了 `/api/redeem/route.ts`：

- 移除了手動的檢查和更新邏輯
- 使用 `supabase.rpc('redeem_promo_code', ...)` 調用資料庫函數
- 改進了錯誤處理，根據不同的錯誤類型返回適當的 HTTP 狀態碼

### 5. 錯誤處理

函數會拋出以下異常：

- `CODE_NOT_FOUND`：序號無效或不存在 (404)
- `CODE_EXPIRED`：序號已過期 (410)
- `CODE_ALREADY_REDEEMED`：此序號已被使用 (409)
- `USER_ALREADY_SUBSCRIBED`：用戶已有該方案的有效訂閱 (409)
- `PLAN_NOT_FOUND`：方案不存在 (500)

### 6. 測試建議

#### 並發測試

使用工具（如 Apache Bench 或 curl）進行並發測試：

```bash
# 同時發送多個請求測試同一個 promo code
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/redeem \
    -H "Content-Type: application/json" \
    -d '{"code":"TEST_CODE"}' &
done
wait
```

#### 預期結果

- 只有第一個請求應該成功
- 其他請求應該收到 "此序號已被使用" 錯誤
- 資料庫中應該只有一個訂閱記錄
- `redeemed_by` 字段應該被正確設置

### 7. 回滾方案

如果需要回滾到原來的邏輯：

1. 恢復 `/api/redeem/route.ts` 的原始版本
2. 刪除資料庫函數：

```sql
DROP FUNCTION IF EXISTS redeem_promo_code(TEXT, UUID);
```

### 8. 監控建議

- 監控 promo code 兌換的錯誤率
- 檢查是否有重複的訂閱記錄
- 監控資料庫函數的執行時間

## 安全性改進

1. **防止競態條件**：使用資料庫鎖定機制
2. **原子性操作**：所有相關操作在單個事務中執行
3. **錯誤隔離**：詳細的錯誤處理和日誌記錄
4. **權限控制**：函數使用 `SECURITY DEFINER` 確保正確的權限

這個修復確保了 promo code 兌換的數據一致性和安全性。 