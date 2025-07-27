# Supabase 部署指南

## 方案選擇

### 方案 1: 資料庫函數（推薦）⭐

**優點：**
- 完全解決競態條件問題
- 資料庫級別的原子性操作
- 更好的性能
- 更安全

**部署步驟：**

1. **創建 migration 文件**
   ```bash
   # 在 supabase/migrations/ 目錄下創建文件
   touch supabase/migrations/20241201_create_redeem_promo_code_function.sql
   ```

2. **複製函數定義**
   將 `supabase/migrations/20241201_create_redeem_promo_code_function.sql` 的內容複製到您的 migration 文件中。

3. **部署 migration**
   ```bash
   supabase db push
   ```

4. **驗證函數**
   ```sql
   -- 在 Supabase SQL Editor 中測試
   SELECT redeem_promo_code('TEST_CODE', 'user-uuid-here');
   ```

### 方案 2: Edge Function（備選）

**優點：**
- 可以添加額外的業務邏輯
- 更好的錯誤處理和日誌記錄
- 可以集成外部服務

**缺點：**
- 無法完全解決競態條件問題
- 需要額外的網絡調用
- 更複雜的部署

**部署步驟：**

1. **創建 Edge Function**
   ```bash
   supabase functions new redeem-promo-code
   ```

2. **複製函數代碼**
   將 `supabase/functions/redeem-promo-code/index.ts` 的內容複製到您的 Edge Function 中。

3. **部署 Edge Function**
   ```bash
   supabase functions deploy redeem-promo-code
   ```

4. **設置環境變數**
   ```bash
   supabase secrets set SUPABASE_URL=your-project-url
   supabase secrets set SUPABASE_ANON_KEY=your-anon-key
   ```

## 推薦部署流程

### 1. 使用資料庫函數（推薦）

```bash
# 1. 確保您在項目根目錄
cd your-project

# 2. 初始化 Supabase（如果還沒有）
supabase init

# 3. 創建 migration 目錄（如果不存在）
mkdir -p supabase/migrations

# 4. 創建 migration 文件
cat > supabase/migrations/20241201_create_redeem_promo_code_function.sql << 'EOF'
-- 複製 database-functions.sql 的內容到這裡
EOF

# 5. 部署到 Supabase
supabase db push

# 6. 驗證部署
supabase db reset  # 在開發環境中重置資料庫
```

### 2. 更新 API 路由

確保您的 `/api/redeem/route.ts` 使用資料庫函數：

```typescript
// 使用資料庫函數
const { data: result, error: transactionError } = await supabase.rpc('redeem_promo_code', {
  p_code: code.trim(),
  p_user_id: currentUser.id
});
```

### 3. 測試部署

1. **創建測試 promo code**
   ```sql
   INSERT INTO promo_codes (code, plan_id, single_use, expire_date) 
   VALUES ('TEST_RACE_CONDITION', 1, true, NOW() + INTERVAL '1 day');
   ```

2. **運行並發測試**
   ```bash
   node test-promo-code-race-condition.js
   ```

## 環境變數設置

### 開發環境

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 生產環境

在 Vercel 或其他部署平台設置環境變數：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-production-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

## 驗證清單

部署完成後，請檢查以下項目：

- [ ] 資料庫函數已成功創建
- [ ] 函數權限已正確設置
- [ ] API 路由可以正常調用函數
- [ ] 並發測試通過
- [ ] 錯誤處理正常工作
- [ ] 日誌記錄正常

## 故障排除

### 常見問題

1. **函數不存在錯誤**
   ```sql
   -- 檢查函數是否存在
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_name = 'redeem_promo_code';
   ```

2. **權限錯誤**
   ```sql
   -- 重新授予權限
   GRANT EXECUTE ON FUNCTION redeem_promo_code(TEXT, UUID) TO authenticated;
   ```

3. **類型錯誤**
   ```sql
   -- 檢查函數簽名
   SELECT pg_get_function_identity_arguments(oid) 
   FROM pg_proc WHERE proname = 'redeem_promo_code';
   ```

### 回滾方案

如果需要回滾：

```sql
-- 刪除函數
DROP FUNCTION IF EXISTS redeem_promo_code(TEXT, UUID);

-- 恢復原始 API 邏輯
-- 將 /api/redeem/route.ts 恢復到原始版本
```

## 監控建議

1. **設置 Supabase 日誌監控**
2. **監控函數執行時間**
3. **檢查錯誤率**
4. **監控並發請求數量**

## 安全注意事項

1. **函數使用 `SECURITY DEFINER`**：確保在正確的權限上下文中執行
2. **輸入驗證**：所有輸入都經過驗證
3. **錯誤處理**：不暴露內部錯誤信息
4. **日誌記錄**：記錄所有重要操作 