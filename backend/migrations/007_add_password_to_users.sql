-- Add password hash to allowed_users for proper authentication
ALTER TABLE allowed_users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Update the existing user with a password
-- Password: The one from .env AUTH_PASSWORD_HASH
UPDATE allowed_users
SET password_hash = '$2b$10$placeholder'
WHERE email = 'jasonleslieroberts@gmail.com';
