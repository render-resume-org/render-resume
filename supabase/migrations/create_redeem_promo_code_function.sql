-- 創建 redeem_promo_code 函數來處理原子性的 promo code 兌換
-- 這個函數使用資料庫事務來防止競態條件

CREATE OR REPLACE FUNCTION redeem_promo_code(
  p_code TEXT,
  p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_promo_code RECORD;
  v_plan RECORD;
  v_existing_subscription RECORD;
  v_expire_date TIMESTAMP;
  v_subscription_id INTEGER;
  v_result JSON;
BEGIN
  -- 開始事務
  BEGIN
    -- 1. 查找並鎖定 promo code（防止並發修改）
    SELECT * INTO v_promo_code
    FROM promo_codes
    WHERE code = p_code
    FOR UPDATE SKIP LOCKED;
    
    -- 檢查 promo code 是否存在
    IF NOT FOUND THEN
      RAISE EXCEPTION 'CODE_NOT_FOUND' USING HINT = 'Promo code not found';
    END IF;
    
    -- 2. 檢查是否過期
    IF v_promo_code.expire_date IS NOT NULL AND v_promo_code.expire_date < NOW() THEN
      RAISE EXCEPTION 'CODE_EXPIRED' USING HINT = 'Promo code has expired';
    END IF;
    
    -- 3. 檢查是否為一次性代碼且已被兌換
    IF v_promo_code.single_use AND v_promo_code.redeemed_by IS NOT NULL THEN
      RAISE EXCEPTION 'CODE_ALREADY_REDEEMED' USING HINT = 'Promo code already redeemed';
    END IF;
    
    -- 4. 獲取方案信息
    SELECT * INTO v_plan
    FROM plans
    WHERE id = v_promo_code.plan_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'PLAN_NOT_FOUND' USING HINT = 'Plan not found';
    END IF;
    
    -- 5. 檢查用戶是否已有該方案的有效訂閱
    SELECT * INTO v_existing_subscription
    FROM subscriptions
    WHERE user_id = p_user_id
      AND plan_id = v_promo_code.plan_id
      AND is_active = true
      AND (expire_at IS NULL OR expire_at > NOW());
    
    IF FOUND THEN
      RAISE EXCEPTION 'USER_ALREADY_SUBSCRIBED' USING HINT = 'User already has active subscription for this plan';
    END IF;
    
    -- 6. 計算到期日期
    IF v_plan.duration_days IS NOT NULL THEN
      v_expire_date := NOW() + (v_plan.duration_days || ' days')::INTERVAL;
    ELSE
      v_expire_date := NULL;
    END IF;
    
    -- 7. 創建訂閱
    INSERT INTO subscriptions (
      user_id,
      plan_id,
      is_active,
      expire_at,
      created_at
    ) VALUES (
      p_user_id,
      v_promo_code.plan_id,
      true,
      v_expire_date,
      NOW()
    ) RETURNING id INTO v_subscription_id;
    
    -- 8. 如果是一次性代碼，更新 redeemed_by
    IF v_promo_code.single_use THEN
      UPDATE promo_codes
      SET redeemed_by = p_user_id
      WHERE id = v_promo_code.id;
    END IF;
    
    -- 9. 返回創建的訂閱信息
    SELECT json_build_object(
      'id', s.id,
      'user_id', s.user_id,
      'plan_id', s.plan_id,
      'is_active', s.is_active,
      'expire_at', s.expire_at,
      'created_at', s.created_at,
      'plans', json_build_object(
        'id', p.id,
        'title', p.title,
        'type', p.type,
        'daily_usage', p.daily_usage,
        'duration_days', p.duration_days,
        'price', p.price
      )
    ) INTO v_result
    FROM subscriptions s
    JOIN plans p ON s.plan_id = p.id
    WHERE s.id = v_subscription_id;
    
    RETURN v_result;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- 回滾事務並重新拋出異常
      RAISE;
  END;
END;
$$;

-- 授予執行權限
GRANT EXECUTE ON FUNCTION redeem_promo_code(TEXT, UUID) TO authenticated; 