// controllers/authController.js
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser } = require('../src/models/users');

const register = async (req, res) => {
  try {
    // 1. Ambil semua data dari request body, termasuk role
    const { email, password, name, role } = req.body;

    // 2. Validasi input wajib
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Nama, Email, dan Password wajib diisi' });
    }

    // 3. Tentukan dan Validasi Role
    // Jika frontend tidak mengirim data role, otomatis kita set sebagai 'user'
    const validRole = role || 'user'; 

    // Pastikan input role tidak diisi teks sembarangan (mencegah error di database ENUM)
    if (!['user', 'mentor'].includes(validRole)) {
      return res.status(400).json({ message: 'Role tidak valid. Harus "user" atau "mentor".' });
    }

    // 4. Cek apakah email sudah pernah terdaftar
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar, silakan gunakan email lain' });
    }

    // 5. Hash password sebelum disimpan
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 6. Simpan ke database
    const newUser = await createUser({
      name: name,
      email: email,
      password_hash: hashedPassword,
      role: validRole, 
    });

    // 7. Kirim respons sukses ke frontend
    res.status(201).json({
      message: `Registrasi berhasil sebagai ${newUser.role}`,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    }); 

  } catch (error) {
    console.error('Error saat registrasi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan internal pada server' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cek apakah user ada
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 2. Cek apakah password cocok
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 3. Jika berhasil (Nanti kita akan tambahkan JWT di sini)
    res.status(200).json({
      message: 'Login berhasil',
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error server saat login' });
  }
};
  
module.exports = { register, login };