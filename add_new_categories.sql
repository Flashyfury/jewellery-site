-- ============================================================
-- MIGRATION: Add "Classic Indian Collection" & "Matching Set"
-- Run this in your Supabase Dashboard → SQL Editor
-- ============================================================

INSERT INTO categories (name, slug, description, emoji, hero_bg, sort_order) VALUES
  (
    'Classic Indian Collection',
    'classic-indian',
    'Timeless Kundan, Meenakari & Temple pieces inspired by centuries of Indian artistry.',
    '🪔',
    'from-orange-50 via-amber-50 to-yellow-50',
    5
  ),
  (
    'Matching Set',
    'matching-set',
    'Perfectly coordinated necklace, earring & bracelet sets for a complete look.',
    '💎',
    'from-pink-50 via-rose-50 to-fuchsia-50',
    6
  )
ON CONFLICT (slug) DO NOTHING;
