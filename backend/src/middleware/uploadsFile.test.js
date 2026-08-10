const upload = require("./uploadsFile");

describe("uploadsFile Middleware", () => {
  it("Harus menerima file dengan ekstensi dan MIME type yang valid (PNG, JPG, JPEG, PDF)", (done) => {
    const validFiles = [
      { originalname: "document.pdf", mimetype: "application/pdf" },
      { originalname: "image.png", mimetype: "image/png" },
      { originalname: "photo.jpg", mimetype: "image/jpeg" },
      { originalname: "photo2.jpeg", mimetype: "image/jpeg" },
    ];

    let passedCount = 0;
    validFiles.forEach((file) => {
      upload.fileFilter({}, file, (err, acceptFile) => {
        expect(err).toBeNull();
        expect(acceptFile).toBe(true);
        passedCount++;
        if (passedCount === validFiles.length) done();
      });
    });
  });

  it("Harus menolak file dengan format yang tidak didukung (GIF, WEBP, TXT, DOCX, ZIP, EXE)", (done) => {
    const invalidFiles = [
      { originalname: "animation.gif", mimetype: "image/gif" },
      { originalname: "graphic.webp", mimetype: "image/webp" },
      { originalname: "notes.txt", mimetype: "text/plain" },
      { originalname: "document.docx", mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { originalname: "archive.zip", mimetype: "application/zip" },
      { originalname: "virus.exe", mimetype: "application/x-msdownload" },
      // Kasus e.g. nama file .txt tapi mimetype application/pdf
      { originalname: "fake.txt", mimetype: "application/pdf" },
    ];

    let rejectedCount = 0;
    invalidFiles.forEach((file) => {
      upload.fileFilter({}, file, (err, acceptFile) => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toContain("Hanya file PDF, PNG, JPG, dan JPEG yang diizinkan");
        expect(acceptFile).toBe(false);
        rejectedCount++;
        if (rejectedCount === invalidFiles.length) done();
      });
    });
  });
});
