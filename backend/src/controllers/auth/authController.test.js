const { registerUser, loginUser } = require('./authController'); // Sesuaikan path jika berbeda
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../../models/userModel');

// 1. MOCKING: Memalsukan library dan model agar tidak pakai database asli
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../models/userModel');

describe('AuthController Unit Tests', () => {
  // Setup objek Request (req) dan Response (res) palsu sebelum setiap tes dijalankan
  let req, res;

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // ✨ 2. TAMBAHKAN INI: Mengembalikan console.error seperti semula setelah tes selesai
  afterAll(() => {
    console.error.mockRestore();
  });
  
  beforeEach(() => {
    jest.clearAllMocks(); // Bersihkan memori mock tiap mulai tes baru
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(), // Bisa di-chaining seperti res.status().json()
      json: jest.fn(),
    };
    process.env.JWT_SECRET = 'rahasia-negara'; // Set env palsu untuk tes
  });

  // ==========================================
  // UNIT TEST UNTUK: registerUser
  // ==========================================
  describe('registerUser', () => {
    it('harus error 400 jika ada input yang kosong', async () => {
      req.body = { name: 'Fahmi' }; // Sengaja tidak kirim email, password, role

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'VALIDATION_ERROR',
        message: 'Field name, email, password, dan role wajib diisi.',
      });
    });

    it('harus error 409 jika email sudah terdaftar', async () => {
      req.body = { name: 'Fahmi', email: 'test@gmail.com', password: '123', role: 'USER' };
      
      // Pura-puranya database membalas ada user yang ditemukan
      findUserByEmail.mockResolvedValue({ id: 1, email: 'test@gmail.com' }); 

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'EMAIL_CONFLICT',
      }));
    });

    it('harus sukses 201 jika pendaftaran berhasil', async () => {
      req.body = { name: 'Fahmi', email: 'baru@gmail.com', password: '123', role: 'USER' };
      
      // Pura-puranya email belum ada di database
      findUserByEmail.mockResolvedValue(null); 
      // Pura-puranya bcrypt berhasil nge-hash
      bcrypt.hash.mockResolvedValue('password_hash_palsu');
      // Pura-puranya database berhasil membuat user
      createUser.mockResolvedValue({
        id: 1, name: 'Fahmi', email: 'baru@gmail.com', role: 'USER', created_at: '2026-01-01'
      });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Akun berhasil dibuat.',
        user: expect.any(Object),
      }));
      // Pastikan fungsi bcrypt dipanggil dengan benar
      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
    });

    it('harus error 500 jika terjadi server error', async () => {
      req.body = { name: 'Fahmi', email: 'baru@gmail.com', password: '123', role: 'USER' };
      
      // Paksa database untuk menghasilkan error
      findUserByEmail.mockRejectedValue(new Error('Database jebol'));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'INTERNAL_SERVER_ERROR',
      }));
    });
  });

  // ==========================================
  // UNIT TEST UNTUK: loginUser
  // ==========================================
  describe('loginUser', () => {
    it('harus error 400 jika input kosong', async () => {
      req.body = { email: 'test@gmail.com' }; // Sengaja password kosong

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: 'VALIDATION_ERROR',
      }));
    });

    it('harus error 401 jika email tidak ditemukan di database', async () => {
      req.body = { email: 'salah@gmail.com', password: '123' };
      
      findUserByEmail.mockResolvedValue(null); // User ga ada

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Email atau password salah',
      }));
    });

    it('harus error 401 jika password salah', async () => {
      req.body = { email: 'test@gmail.com', password: 'salah_password' };
      
      findUserByEmail.mockResolvedValue({ id: 1, email: 'test@gmail.com', password_hash: 'hashasli' });
      bcrypt.compare.mockResolvedValue(false); // Pura-puranya bcrypt bilang passwordnya beda

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('harus sukses 200 dan mengembalikan token jika berhasil login', async () => {
      req.body = { email: 'test@gmail.com', password: 'password_benar' };
      
      findUserByEmail.mockResolvedValue({ id: 1, email: 'test@gmail.com', role: 'USER', password_hash: 'hashasli' });
      bcrypt.compare.mockResolvedValue(true); // Pura-puranya password cocok
      jwt.sign.mockReturnValue('token-palsu-12345'); // Pura-puranya berhasil bikin token

      await loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Login Berhasil',
        token: 'token-palsu-12345',
        user: expect.any(Object),
      }));
    });
  });
});