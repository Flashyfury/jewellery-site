-- ============================================================
-- MIGRATION: Separate Categories Table
-- Run this in your Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Create the categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,   -- used in URLs: /collections/{slug}
  description TEXT,
  emoji TEXT,
  hero_bg TEXT DEFAULT 'from-stone-50 via-neutral-50 to-gray-50',
  hero_image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- 3. Seed the default 4 categories
INSERT INTO categories (name, slug, description, emoji, hero_bg, sort_order) VALUES
  ('Rings',      'rings',      'From statement cocktail rings to stackable everyday pieces.',        '💍', 'from-amber-50 via-yellow-50 to-stone-50',   1),
  ('Necklaces',  'necklaces',  'Delicate chains and bold pendants for every neckline.',              '✨', 'from-slate-50 via-gray-50 to-neutral-50',   2),
  ('Earrings',   'earrings',   'Dainty hoops, architectural drops, and chic studs.',                '👂', 'from-stone-50 via-amber-50 to-yellow-50',   3),
  ('Bracelets',  'bracelets',  'Layer them up or let one piece shine.',                             '⭕', 'from-neutral-50 via-stone-50 to-gray-50',   4)
ON CONFLICT (slug) DO NOTHING;

-- 4. Add category_id foreign key column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 5. (Optional) Migrate existing category text data to the new FK
UPDATE products p
SET category_id = c.id
FROM categories c
WHERE p.category = c.slug
  AND p.category IS NOT NULL;

-- 6. (Optional) Drop the old text column once migration looks good
-- ALTER TABLE products DROP COLUMN IF EXISTS category;

-- 7. Create an index for efficient category filtering
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
