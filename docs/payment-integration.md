# 應援科技金流串接文檔

## 概述

本文檔說明如何串接應援科技的定期定額金流 API，用於處理訂閱付費功能。

## API 配置

- **測試環境 API Base URL**: `https://payment-api.testing.oen.tw`
- **Merchant ID**: `ruby0322`

## 支付流程

### 1. 建立支付頁面

**API Endpoint**: `POST /checkout-subscription`

**請求參數**:
```json
{
  "merchantId": "ruby0322",
  "planId": 1,
  "planName": "Pro 方案",
  "amount": 299,
  "userId": "user_uuid",
  "userEmail": "user@example.com",
  "returnUrl": "https://yourdomain.com/payment/success",
  "notifyUrl": "https://yourdomain.com/api/payment/callback",
  "cancelUrl": "https://yourdomain.com/payment/fail"
}
```

**回應格式**:
```json
{
  "success": true,
  "paymentUrl": "https://payment-page-url",
  "orderId": "order_12345"
}
```

### 2. 支付回調處理

**Callback Endpoint**: `POST /api/payment/callback`

**回調參數**:
```json
{
  "orderId": "order_12345",
  "merchantId": "ruby0322",
  "planId": 1,
  "userId": "user_uuid",
  "status": "success",
  "amount": 299
}
```

## 實作的 API Routes

### 1. 建立支付 (`/api/payment/checkout`)

- 驗證用戶身份
- 檢查方案是否存在且可購買
- 發送請求到應援科技 API
- 返回支付頁面 URL

### 2. 支付回調 (`/api/payment/callback`)

- 驗證 merchantId
- 處理支付成功/失敗狀態
- 創建訂閱記錄
- 計算到期日期

### 3. 支付結果頁面

- **成功頁面**: `/payment/success`
- **失敗頁面**: `/payment/fail`

## 前端功能

### 訂閱頁面新增功能

1. **價格顯示**: 顯示方案價格（如果有）
2. **升級按鈕**: 
   - 有價格的方案顯示「升級到此方案」按鈕
   - 無價格的方案顯示「非公開販售」
3. **升級邏輯**: 只允許升級到更高級的方案

### 支付流程

1. 用戶點擊「升級到此方案」
2. 發送請求到 `/api/payment/checkout`
3. 重定向到應援科技支付頁面
4. 用戶完成支付
5. 重定向回應用的成功/失敗頁面

## 測試步驟

### 1. 準備測試數據

在資料庫 `plans` 表中添加測試方案：

```sql
INSERT INTO plans (title, type, daily_usage, duration_days, price) 
VALUES 
('測試 Pro 方案', 'pro', 10, 30, 299),
('測試 Premium 方案', 'premium', 50, 90, 899);
```

### 2. 測試支付流程

1. 登入應用
2. 前往 `/pricing` 頁面
3. 點擊有價格的方案的「升級到此方案」按鈕
4. 檢查是否正確重定向到支付頁面
5. 測試支付成功和失敗的情況

### 3. 測試回調處理

可以使用工具（如 Postman）手動發送回調請求來測試：

```bash
curl -X POST https://yourdomain.com/api/payment/callback \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "test_order_123",
    "merchantId": "ruby0322",
    "planId": 1,
    "userId": "user_uuid",
    "status": "success",
    "amount": 299
  }'
```

## 注意事項

1. **安全性**: 在生產環境中，應該添加回調簽名驗證
2. **錯誤處理**: 確保所有錯誤情況都有適當的處理
3. **日誌記錄**: 記錄所有支付相關的操作和錯誤
4. **重複支付**: 檢查是否已有相同的訂單 ID
5. **方案驗證**: 確保用戶只能升級到更高級的方案

## 資料庫變更

需要在 `subscriptions` 表中添加以下欄位：

```sql
ALTER TABLE subscriptions 
ADD COLUMN order_id VARCHAR(255),
ADD COLUMN amount INTEGER;
```

## 環境變數

需要設定以下環境變數：

```env
# 應援科技 API 配置
PAYMENT_API_BASE=https://payment-api.testing.oen.tw
MERCHANT_ID=ruby0322
``` 