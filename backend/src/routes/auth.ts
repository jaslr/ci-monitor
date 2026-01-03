import { Hono } from 'hono';
import bcrypt from 'bcrypt';
import { query, ensureDb } from '../db/client.js';

export const authRoutes = new Hono();

const SALT_ROUNDS = 10;

// Verify email + password
// This endpoint is PUBLIC (no API secret required)
authRoutes.post('/verify', async (c) => {
  try {
    const pool = await ensureDb();
    if (!pool) {
      return c.json({ error: 'Database unavailable' }, 503);
    }

    const body = await c.req.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string') {
      return c.json({ error: 'Email required' }, 400);
    }

    if (!password || typeof password !== 'string') {
      return c.json({ error: 'Password required' }, 400);
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email exists in allowed_users
    const result = await query<{ id: number; email: string; name: string | null; password_hash: string | null }>(
      'SELECT id, email, name, password_hash FROM allowed_users WHERE LOWER(email) = $1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      // Don't reveal whether email exists or not
      return c.json({ authorized: false, error: 'Invalid credentials' }, 401);
    }

    const user = result.rows[0];

    // Check password
    if (!user.password_hash) {
      return c.json({ authorized: false, error: 'Password not set' }, 401);
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return c.json({ authorized: false, error: 'Invalid credentials' }, 401);
    }

    // Update last login timestamp
    await query(
      'UPDATE allowed_users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    return c.json({
      authorized: true,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Auth verification error:', err);
    return c.json({ error: 'Internal error' }, 500);
  }
});

// Set password for a user (requires API secret - admin only)
authRoutes.post('/set-password', async (c) => {
  try {
    const pool = await ensureDb();
    if (!pool) {
      return c.json({ error: 'Database unavailable' }, 503);
    }

    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await query(
      'UPDATE allowed_users SET password_hash = $1 WHERE LOWER(email) = $2',
      [passwordHash, normalizedEmail]
    );

    if (result.rowCount === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ success: true, message: 'Password set' });
  } catch (err) {
    console.error('Set password error:', err);
    return c.json({ error: 'Internal error' }, 500);
  }
});

// List allowed users (requires API secret - admin only)
authRoutes.get('/users', async (c) => {
  try {
    const pool = await ensureDb();
    if (!pool) {
      return c.json({ error: 'Database unavailable' }, 503);
    }

    const result = await query<{ id: number; email: string; name: string | null; created_at: string; last_login_at: string | null }>(
      'SELECT id, email, name, created_at, last_login_at FROM allowed_users ORDER BY created_at'
    );

    return c.json({ users: result.rows });
  } catch (err) {
    console.error('Error fetching users:', err);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Add a new allowed user (requires API secret - admin only)
authRoutes.post('/users', async (c) => {
  try {
    const pool = await ensureDb();
    if (!pool) {
      return c.json({ error: 'Database unavailable' }, 503);
    }

    const body = await c.req.json();
    const { email, name } = body;

    if (!email || typeof email !== 'string') {
      return c.json({ error: 'Email required' }, 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await query<{ id: number; email: string; name: string | null }>(
      'INSERT INTO allowed_users (email, name) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET name = $2 RETURNING id, email, name',
      [normalizedEmail, name || null]
    );

    return c.json({ user: result.rows[0] }, 201);
  } catch (err) {
    console.error('Error adding user:', err);
    return c.json({ error: 'Failed to add user' }, 500);
  }
});

// Remove an allowed user (requires API secret - admin only)
authRoutes.delete('/users/:email', async (c) => {
  try {
    const pool = await ensureDb();
    if (!pool) {
      return c.json({ error: 'Database unavailable' }, 503);
    }

    const email = c.req.param('email').toLowerCase().trim();

    const result = await query(
      'DELETE FROM allowed_users WHERE LOWER(email) = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ message: 'User removed' });
  } catch (err) {
    console.error('Error removing user:', err);
    return c.json({ error: 'Failed to remove user' }, 500);
  }
});
