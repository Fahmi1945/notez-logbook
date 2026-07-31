const bcrypt = require("bcrypt");
const { findUserById, updateUser } = require("../../models/userModel");

// 1. Ambil Profil User
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Diambil dari token JWT via middleware
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "NOT_FOUND", message: "User tidak ditemukan" });
    }

    return res.status(200).json({ message: "Berhasil mengambil profil", user });
  } catch (error) {
    console.error("Error di getProfile:", error);
    return res.status(500).json({ error: "SERVER_ERROR", message: "Gagal mengambil profil" });
  }
};

// 2. Edit Nama / Data Profil
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "VALIDATION_ERROR", message: "Nama wajib diisi" });
    }

    const updatedUser = await updateUser(userId, { name });

    return res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error di updateProfile:", error);
    return res.status(500).json({ error: "SERVER_ERROR", message: "Gagal memperbarui profil" });
  }
};

// 3. Ganti Password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        error: "VALIDATION_ERROR", 
        message: "Password lama dan password baru harus diisi" 
      });
    }

    // 1. Ambil data user lengkap dari database
    const user = await findUserById(userId); 
    if (!user) {
      return res.status(404).json({ error: "NOT_FOUND", message: "User tidak ditemukan" });
    }

    // 2. Cocokkan password lama yang diinput dengan password di database
    // (Nah, di sini variabel 'user' akhirnya KITA PAKAI!)
    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        error: "UNAUTHORIZED", 
        message: "Password lama yang Anda masukkan salah!" 
      });
    }
    
    // 3. Jika cocok, Hash password baru & simpan ke database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    await updateUser(userId, { password_hash: hashedPassword });

    return res.status(200).json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Error di changePassword:", error);
    return res.status(500).json({ 
      error: "SERVER_ERROR", 
      message: "Gagal mengubah password" 
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};