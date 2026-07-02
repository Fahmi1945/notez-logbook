const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    // Mencoba melakukan query sederhana untuk mendapatkan jumlah user
    const count = await prisma.user.count();
    console.log("✅ Berhasil terhubung ke database!");
    console.log(`Jumlah user saat ini: ${count}`);
  } catch (error) {
    console.error("❌ Gagal terhubung ke database:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
