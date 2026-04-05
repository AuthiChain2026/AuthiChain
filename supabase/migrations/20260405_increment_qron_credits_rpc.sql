-- Atomic credit increment to prevent race conditions in concurrent webhook processing
CREATE OR REPLACE FUNCTION increment_qron_credits(p_user_id UUID, p_credits INT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO qron_credits (user_id, balance, updated_at)
  VALUES (p_user_id, p_credits, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    balance = qron_credits.balance + EXCLUDED.balance,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
