const { getDb } = require("./db.cjs");

function getAll() {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT v.*, vis.name AS visitor_name, vis.company AS visitor_company, vis.phone AS visitor_phone, vis.photo AS visitor_photo
       FROM visits v
       JOIN visitors vis ON v.visitor_id = vis.id
       ORDER BY v.created_at DESC`,
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
      `SELECT v.*, vis.name AS visitor_name, vis.company AS visitor_company, vis.phone AS visitor_phone, vis.photo AS visitor_photo
       FROM visits v
       JOIN visitors vis ON v.visitor_id = vis.id
       WHERE v.id = ?`,
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

function getByVisitorId(visitorId) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT v.*, vis.name AS visitor_name, vis.company AS visitor_company
       FROM visits v
       JOIN visitors vis ON v.visitor_id = vis.id
       WHERE v.visitor_id = ?
       ORDER BY v.created_at DESC`,
      [visitorId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

function search(query, dateRange) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    let sql = `SELECT v.*, vis.name AS visitor_name, vis.company AS visitor_company, vis.phone AS visitor_phone, vis.photo AS visitor_photo
               FROM visits v
               JOIN visitors vis ON v.visitor_id = vis.id
               WHERE 1=1`;
    const params = [];

    if (query) {
      const pattern = `%${query}%`;
      sql += " AND (vis.name LIKE ? OR v.pass_id LIKE ? OR v.employee_to_meet LIKE ? OR v.purpose LIKE ?)";
      params.push(pattern, pattern, pattern, pattern);
    }

    if (dateRange?.from) {
      sql += " AND v.visit_date >= ?";
      params.push(dateRange.from);
    }

    if (dateRange?.to) {
      sql += " AND v.visit_date <= ?";
      params.push(dateRange.to);
    }

    sql += " ORDER BY v.created_at DESC";

    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function create(data) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    const { pass_id, visitor_id, employee_to_meet, visit_date, visit_time, purpose, status } = data;
    db.run(
      "INSERT INTO visits (pass_id, visitor_id, employee_to_meet, visit_date, visit_time, purpose, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [pass_id, visitor_id, employee_to_meet, visit_date, visit_time, purpose || null, status || 'active'],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      }
    );
  });
}

function updateStatus(id, status) {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE visits SET status = ? WHERE id = ?",
      [status, id],
      function (err) {
        if (err) reject(err);
        else resolve({ id, status, updated: this.changes > 0 });
      }
    );
  });
}

function generatePassId() {
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT s.pass_prefix, s.pass_start_number, p.current_number FROM settings s, pass_sequence p WHERE s.id = 1 AND p.id = 1",
      [],
      (err, row) => {
        if (err) return reject(err);

        const prefix = row?.pass_prefix || "VIS";
        const number = row?.current_number || row?.pass_start_number || 1;
        const passId = `${prefix}-${String(number).padStart(4, "0")}`;

        db.run(
          "UPDATE pass_sequence SET current_number = ?, prefix = ? WHERE id = 1",
          [number + 1, prefix],
          (err) => {
            if (err) reject(err);
            else resolve(passId);
          }
        );
      }
    );
  });
}

module.exports = { getAll, getById, getByVisitorId, search, create, updateStatus, generatePassId };
