const db = require('../config/db');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query(
      `SELECT u.*, j.nama_jorong 
       FROM user_admin u 
       LEFT JOIN jorong j ON u.id_jorong = j.id_jorong 
       WHERE u.username = ?`, 
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Username tidak terdaftar.' });
    }
    const user = rows[0];
    
    if (user.password === password) {
      return res.json({
        success: true,
        user: { 
          id_user: user.id_user,
          username: user.username, 
          role: user.role,
          nama_jorong: user.nama_jorong || 'Semua Jorong'
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Password salah.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};
