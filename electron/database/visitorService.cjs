const { getDb } = require("./db.cjs");

function getAll() {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM visitors ORDER BY created_at DESC",
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

function getById(id) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM visitors WHERE id = ?",
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

function search(query) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    const pattern = `%${query}%`;
    db.all(
      "SELECT * FROM visitors WHERE name LIKE ? OR company LIKE ? OR phone LIKE ? ORDER BY created_at DESC",
      [pattern, pattern, pattern],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

function create(data) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    const { name, company, phone, photo } = data;
    db.run(
      "INSERT INTO visitors (name, company, phone, photo) VALUES (?, ?, ?, ?)",
      [name, company || null, phone || null, photo || null],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      }
    );
  });
}

function update(id, data) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    const { name, company, phone, photo } = data;
    db.run(
      "UPDATE visitors SET name = ?, company = ?, phone = ?, photo = ? WHERE id = ?",
      [name, company || null, phone || null, photo || null, id],
      function (err) {
        if (err) reject(err);
        else resolve({ id, ...data });
      }
    );
  });
}

function deleteVisitor(id) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM visitors WHERE id = ?",
      [id],
      function (err) {
        if (err) reject(err);
        else resolve({ id, deleted: this.changes > 0 });
      }
    );
  });
}

module.exports = { getAll, getById, search, create, update, delete: deleteVisitor };
