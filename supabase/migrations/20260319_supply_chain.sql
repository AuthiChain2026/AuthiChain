-- Supply chain events table: tracks the journey of a registered product
CREATE TABLE IF NOT EXISTS supply_chain_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,       -- e.g. 'manufactured', 'shipped', 'received', 'inspected', 'delivered'
  location TEXT,                  -- city, warehouse, port, etc.
  actor TEXT,                     -- who performed this step (manufacturer, carrier, retailer)
  notes TEXT,
  metadata JSONB,                 -- arbitrary extra data (temp, batch #, etc.)
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_supply_chain_product_id ON supply_chain_events(product_id);
CREATE INDEX IF NOT EXISTS idx_supply_chain_user_id ON supply_chain_events(user_id);
CREATE INDEX IF NOT EXISTS idx_supply_chain_occurred_at ON supply_chain_events(occurred_at DESC);

ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view supply chain events for their products" ON supply_chain_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert supply chain events for their products" ON supply_chain_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supply chain events" ON supply_chain_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own supply chain events" ON supply_chain_events
  FOR DELETE USING (auth.uid() = user_id);
