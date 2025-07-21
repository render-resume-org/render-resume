// 測試 Promo Code 競態條件修復
// 使用方法: node test-promo-code-race-condition.js

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000'; // 根據實際環境調整
const TEST_CODE = 'TEST_RACE_CONDITION'; // 測試用的 promo code

async function redeemCode(authToken, code) {
  try {
    const response = await fetch(`${API_BASE}/api/redeem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ code })
    });

    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function testRaceCondition() {
  console.log('🚀 開始測試 Promo Code 競態條件修復...\n');

  // 注意：這個測試需要有效的認證 token
  // 在實際使用時，需要先登入獲取 token
  const authToken = 'YOUR_AUTH_TOKEN_HERE'; // 替換為實際的認證 token

  if (authToken === 'YOUR_AUTH_TOKEN_HERE') {
    console.log('❌ 請先設置有效的認證 token');
    console.log('1. 登入應用獲取 token');
    console.log('2. 更新腳本中的 authToken 變數');
    return;
  }

  console.log(`📝 測試代碼: ${TEST_CODE}`);
  console.log(`🔗 API 端點: ${API_BASE}/api/redeem`);
  console.log('');

  // 並發發送 5 個請求
  const promises = [];
  const results = [];

  console.log('🔄 發送並發請求...');
  
  for (let i = 0; i < 5; i++) {
    const promise = redeemCode(authToken, TEST_CODE).then(result => {
      results.push({
        requestId: i + 1,
        ...result
      });
      return result;
    });
    promises.push(promise);
  }

  // 等待所有請求完成
  await Promise.all(promises);

  console.log('\n📊 測試結果:');
  console.log('='.repeat(50));

  let successCount = 0;
  let errorCount = 0;

  results.forEach((result, index) => {
    const status = result.success ? '✅ 成功' : '❌ 失敗';
    const message = result.success 
      ? `訂閱創建成功 (ID: ${result.data.subscription?.id})`
      : result.data?.error || result.error || '未知錯誤';

    console.log(`請求 ${result.requestId}: ${status} - ${message}`);
    
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  });

  console.log('\n📈 統計:');
  console.log(`- 成功請求: ${successCount}`);
  console.log(`- 失敗請求: ${errorCount}`);
  console.log(`- 總請求數: ${results.length}`);

  // 驗證結果
  console.log('\n🔍 驗證結果:');
  
  if (successCount === 1 && errorCount === 4) {
    console.log('✅ 競態條件修復成功！');
    console.log('   - 只有一個請求成功創建訂閱');
    console.log('   - 其他請求正確地被拒絕');
  } else if (successCount === 0) {
    console.log('⚠️  所有請求都失敗，可能的原因:');
    console.log('   - Promo code 不存在或已過期');
    console.log('   - 用戶已有該方案的有效訂閱');
    console.log('   - 認證 token 無效');
  } else if (successCount > 1) {
    console.log('❌ 競態條件仍然存在！');
    console.log('   - 多個請求成功創建了訂閱');
    console.log('   - 需要檢查資料庫函數是否正確部署');
  } else {
    console.log('❓ 意外的結果，需要進一步調查');
  }

  console.log('\n💡 建議:');
  console.log('1. 檢查資料庫中是否有重複的訂閱記錄');
  console.log('2. 確認 redeem_promo_code 函數已正確部署');
  console.log('3. 檢查 promo code 的狀態和設置');
}

// 如果直接運行此腳本
if (require.main === module) {
  testRaceCondition().catch(console.error);
}

module.exports = { testRaceCondition, redeemCode }; 