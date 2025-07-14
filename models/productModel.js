const db = require('./db');

exports.getAll = async () => {
  const [rows] = await db.promise().query('SELECT * FROM products');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.promise().query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async ({ nama_game, diamond, harga, gambar }) => {
  const [result] = await db.promise().query(
    'INSERT INTO products (nama_game, diamond, harga, gambar) VALUES (?, ?, ?, ?)',
    [nama_game, diamond, harga, gambar]
  );
  return result;
};

exports.update = async (id, { nama_game, diamond, harga, gambar }) => {
  const [result] = await db.promise().query(
    'UPDATE products SET nama_game = ?, diamond = ?, harga = ?, gambar = ? WHERE id = ?',
    [nama_game, diamond, harga, gambar, id]
  );
  return result;
};

exports.delete = async (id) => {
  const [result] = await db.promise().query('DELETE FROM products WHERE id = ?', [id]);
  return result;
};
