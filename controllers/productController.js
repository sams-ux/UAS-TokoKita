const fs = require('fs');
const path = require('path');
const db = require('../models/db');

// Create product
exports.createProduct = async (req, res) => {
  const { nama_game, diamond, harga } = req.body;
  const gambar = req.file ? req.file.filename : null;

  if (!nama_game || !diamond || !harga)
    return res.status(400).json({ message: 'Nama game, diamond, dan harga wajib diisi' });

  try {
    await db.promise().query(
      'INSERT INTO products (game_name, diamond_amount, price, image_url) VALUES (?, ?, ?, ?)',
      [nama_game, diamond, harga, gambar]
    );

    res.status(201).json({ message: 'Produk berhasil dibuat' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Read all products
exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Read single product
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nama_game, diamond, harga } = req.body;
  const gambar = req.file ? req.file.filename : null;

  if (!nama_game || !diamond || !harga)
    return res.status(400).json({ message: 'Nama game, diamond, dan harga wajib diisi' });

  try {
    // Ambil produk lama dulu
    const [rows] = await db.promise().query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    const oldProduct = rows[0];

    // Jika ada gambar baru dan gambar lama ada, hapus gambar lama
    if (gambar && oldProduct.image_url) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', oldProduct.image_url);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Tentukan gambar yang akan disimpan
    const imageToSave = gambar || oldProduct.image_url || null;

    const [result] = await db.promise().query(
      'UPDATE products SET game_name = ?, diamond_amount = ?, price = ?, image_url = ? WHERE id = ?',
      [nama_game, diamond, harga, imageToSave, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.json({ message: 'Produk berhasil diupdate' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // Ambil produk dulu untuk dapatkan nama gambar
    const [rows] = await db.promise().query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    const product = rows[0];

    // Hapus gambar dari folder uploads jika ada
    if (product.image_url) {
      const imagePath = path.join(__dirname, '..', 'uploads', product.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Hapus data produk dari DB
    const [result] = await db.promise().query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
