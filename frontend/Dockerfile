# 1. Gunakan Node.js versi 20
FROM node:20-slim

# 2. Tentukan folder kerja
WORKDIR /app

# 3. Copy seluruh kode dari komputer ke dalam container
COPY . .

# 4. JALUR KERAS: Hapus paksa node_modules bawaan Windows (jika ikut masuk), 
# lalu install ulang secara bersih agar sesuai dengan sistem Linux Alpine
# RUN rm -rf node_modules package-lock.json
RUN npm install

# 5. Build aplikasi
RUN npm run build

# 6. Buka port 3000
EXPOSE 3000

# 7. Jalankan aplikasi
USER node
CMD ["npm", "start"]