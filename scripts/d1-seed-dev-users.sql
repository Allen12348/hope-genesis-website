-- Dev/preview D1 users — same emails & passwords as prisma/seed.ts (`npm run db:seed`).
--
-- Local:  npm run db:seed:d1:local
-- Remote: npm run db:seed:d1:remote
--
-- Passwords (cost 12 bcrypt, verify with node + bcryptjs if you change them):
--   admin@localhost   → ChangeMe_Admin123!
--   staff@localhost   → ChangeMe_Staff123!
--   viewer@localhost  → ChangeMe_Viewer123!
--
-- Uses REPLACE so you can re-run after fixing bad hashes (previous file had wrong hashes).

INSERT OR REPLACE INTO "User" ("id", "email", "passwordHash", "name", "role", "createdAt", "updatedAt")
VALUES
  (
    'seed-user-admin',
    'admin@localhost',
    '$2b$12$QHim3xeJ2eM3XkQKeAqv7u8BGGCuDwEPe1Z0T5sGmgO4qJrycDz4G',
    'Site Admin',
    'ADMIN',
    datetime('now'),
    datetime('now')
  ),
  (
    'seed-user-staff',
    'staff@localhost',
    '$2b$12$Wl/o9b/SCfBpOmVWTLktGudvOI6O5gp.fu62pTmuZOzgTE80XEv/2',
    'Staff User',
    'STAFF',
    datetime('now'),
    datetime('now')
  ),
  (
    'seed-user-viewer',
    'viewer@localhost',
    '$2b$12$00zpyIFkyBM/9hjTl.zweOfpGqr4G79BS09EZF4k1N7mcgRhJnlT2',
    'Read-only',
    'VIEWER',
    datetime('now'),
    datetime('now')
  );
