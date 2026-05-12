const db = require("../config/database");

async function createUser({ email, passwordHash, fullName, role = "analyst", isActive = true }) {
  const query = `
    INSERT INTO users (email, password, full_name, role, is_active)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, full_name, role, is_active, created_at, updated_at
  `;

  const values = [email, passwordHash, fullName || null, role, isActive];
  const { rows } = await db.query(query, values);
  return rows[0];
}

async function findUserByEmail(email) {
  const query = `
    SELECT id, email, password, full_name, role, is_active, created_at, updated_at
    FROM users
    WHERE email = $1
    LIMIT 1
  `;

  const { rows } = await db.query(query, [email]);
  return rows[0] || null;
}

async function findUserById(id) {
  const query = `
    SELECT id, email, full_name, role, is_active, created_at, updated_at
    FROM users
    WHERE id = $1
    LIMIT 1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
}

async function listUsers() {
  const query = `
    SELECT id, email, full_name, role, is_active, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `;

  const { rows } = await db.query(query);
  return rows;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  listUsers,
};