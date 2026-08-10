const puppeteer = require("puppeteer");

/**
 * Fungsi untuk men-generate buffer PDF dari data logbook
 * @param {Object} logbook - Data logbook dari database
 * @returns {Promise<Buffer>} - Buffer dari file PDF
 */
const generateLogbookPDF = async (pdfData) => {
  // 1. Buat Template HTML dinamis
  // Rahasia anti-terpotong ada di block <style>
  let htmlContent = `
     <!DOCTYPE html>
     <html lang="id">
     <head>
       <meta charset="UTF-8">
       <style>
         body { font-family: Arial, sans-serif; font-size: 12px; color: #333; }
         .header { text-align: center; margin-bottom: 30px; }

         /* --- CSS RAHASIA ANTI TERPOTONG --- */
         table {
           width: 100%;
           border-collapse: collapse;
           page-break-inside: auto; /* Izinkan tabel membelah halaman */
         }
         tr {
           page-break-inside: avoid; /* JANGAN potong baris di tengah-tengah */
           page-break-after: auto;
         }
         thead {
           display: table-header-group; /* Ulangi header tabel di halaman baru */
         }
         tfoot {
           display: table-footer-group;
         }
         /* ---------------------------------- */

         th, td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
         th { background-color: #f4f4f4; }
       </style>
     </head>
     <body>
       <div class="header">
         <h2>Laporan Logbook Magang</h2>
         <p>Mahasiswa: ${pdfData.student.name} | Mentor: ${pdfData.mentor.name}</p>
       </div>

       <table>
         <thead>
           <tr>
             <th width="15%">Tanggal</th>
             <th width="20%">Judul Kegiatan</th>
             <th width="40%">Deskripsi & Kendala</th>
             <th width="25%">Catatan Mentor</th>
           </tr>
         </thead>
         <tbody>
   `;

  // 2. Loop data logbook menjadi baris tabel
  pdfData.logbooks.forEach(entry => {
  // Format tanggal ke lokal Indonesia
    const dateStr = new Date(entry.activity_date).toLocaleDateString("id-ID");

    // Ambil komentar mentor terbaru (jika ada)
    const feedback = (entry.feedbacks && entry.feedbacks.length > 0) 
      ? entry.feedbacks[entry.feedbacks.length - 1].comment 
      : "-";

    htmlContent += `
       <tr>
         <td>${dateStr}</td>
         <td>${entry.title}</td>
         <td>
           <strong>Deskripsi:</strong><br/>${entry.description}<br/><br/>
           <strong>Kendala:</strong><br/>${entry.obstacles || "-"}
         </td>
         <td>${feedback}</td>
       </tr>
     `;
  });

  htmlContent += `
         </tbody>
       </table>
     </body>
     </html>
   `;

  // 3. Jalankan Puppeteer
  // Pastikan menambah args --no-sandbox untuk deployment di server (seperti Linux/VPS)
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    // Set konten HTML
    // nosemgrep: javascript.puppeteer.security.audit.puppeteer-setcontent-injection.puppeteer-setcontent-injection
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      printBackground: true,
      displayHeaderFooter: false // Matikan jika tidak butuh nomor halaman bawaan browser
    });

    return pdfBuffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  generateLogbookPDF
};
