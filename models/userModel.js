const db = require('./db');

exports.findByUsername = async (username) => {
  const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
  return rows;
};

exports.createUser = async (username, hashedPassword) => {
  const [result] = await db.promise().query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  return result;
};
