const jwt = require("jsonwebtoken");

// Set environment variable SEBELUM file middleware dipanggil
process.env.JWT_SECRET = "rahasia_untuk_testing";

const { requiredAuth } = require("./authMiddleware"); 

describe("Middleware: requiredAuth (menggunakan express-jwt)", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = {}; 
    mockNext = jest.fn();
  });

  it("harus melempar UnauthorizedError ke next() jika tidak ada header authorization", async () => {
    await new Promise((resolve) => {
      // PERUBAHAN: Pakai ...args agar fleksibel
      requiredAuth(mockReq, mockRes, (...args) => {
        mockNext(...args); 
        resolve();     
      });
    });

    expect(mockNext).toHaveBeenCalledTimes(1);
    
    const errorArg = mockNext.mock.calls[0][0]; 
    expect(errorArg).toBeDefined();
    expect(errorArg.name).toBe("UnauthorizedError");
    expect(errorArg.code).toBe("credentials_required");
  });

  it("harus melempar UnauthorizedError ke next() jika token tidak valid", async () => {
    mockReq.headers.authorization = "Bearer token_palsu_yang_ngawur_123";

    await new Promise((resolve) => {
      requiredAuth(mockReq, mockRes, (...args) => {
        mockNext(...args);
        resolve();
      });
    });

    expect(mockNext).toHaveBeenCalledTimes(1);
    
    const errorArg = mockNext.mock.calls[0][0];
    expect(errorArg).toBeDefined();
    expect(errorArg.name).toBe("UnauthorizedError");
    expect(errorArg.code).toBe("invalid_token");
  });

  it("harus memanggil next() tanpa error dan menyimpan data token di req.auth", async () => {
    const dataUser = { id: 99, role: "admin" };
    const validToken = jwt.sign(dataUser, process.env.JWT_SECRET, { 
      algorithm: "HS256" 
    });

    mockReq.headers.authorization = `Bearer ${validToken}`;

    await new Promise((resolve) => {
      requiredAuth(mockReq, mockRes, (...args) => {
        mockNext(...args); // Jika kosong, ...args tidak akan mengirim 'undefined'
        resolve();
      });
    });

    expect(mockNext).toHaveBeenCalledWith(); // Sekarang pasti cocok 100%!
    expect(mockReq.auth.id).toBe(99);
    expect(mockReq.auth.role).toBe("admin");
  });
});