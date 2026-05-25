const db = require("../config/database");

async function createUser({ email, passwordHash, fullName, role = "analyst", isActive = true }) {
  const query = `
    INSERT INTO users (email, password, full_name, role, is_active, password_changed_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id, email, full_name, role, is_active, password_changed_at, created_at, updated_at
  `;

  const values = [email, passwordHash, fullName || null, role, isActive];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async function findUserByEmail(email) {
  const query = `
    SELECT id, email, password, full_name, role, is_active, password_changed_at, created_at, updated_at
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const { rows } = await db.query(query, [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const query = `
    SELECT id, email, full_name, role, is_active, password_changed_at, created_at, updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
}

async function findUserCredentialsById(id) {
  const query = `
    SELECT id, email, password, full_name, role, is_active, password_changed_at, created_at, updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
}

async function listUsers() {
  const query = `
    SELECT id, email, full_name, role, is_active, password_changed_at, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `;

  const { rows } = await db.query(query);
  return rows;
}

async function updateProfile(id, { email, fullName }) {
  const query = `
    UPDATE users
    SET email = $2,
        full_name = $3,
        updated_at = NOW()
    WHERE id = $1
    RETURNING id, email, full_name, role, is_active, password_changed_at, created_at, updated_at
  `;

  const { rows } = await db.query(query, [id, email, fullName || null]);
  return rows[0] || null;
}

async function updatePassword(id, passwordHash) {
  const query = `
    UPDATE users
    SET password = $2,
        password_changed_at = NOW(),
        updated_at = NOW()
    WHERE id = $1
    RETURNING id, email, full_name, role, is_active, password_changed_at, created_at, updated_at
  `;

  const { rows } = await db.query(query, [id, passwordHash]);
  return rows[0] || null;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserCredentialsById,
  listUsers,
  updateProfile,
  updatePassword,
};
