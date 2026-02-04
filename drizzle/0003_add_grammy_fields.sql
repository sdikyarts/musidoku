-- Add Grammy fields to artists table
ALTER TABLE artists ADD COLUMN is_grammy_2026_nominee BOOLEAN DEFAULT FALSE;
ALTER TABLE artists ADD COLUMN is_grammy_2026_winner BOOLEAN DEFAULT FALSE;
