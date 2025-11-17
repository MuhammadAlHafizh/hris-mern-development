import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleFileUpload = (file) => {
    if (!file) return null;

    try {
        // Buat folder uploads/medical-certificates jika belum ada
        const uploadDir = path.join(__dirname, '../uploads/medical-certificates');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('📁 Created upload directory:', uploadDir);
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${timestamp}-${randomString}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        console.log('📄 File upload details:', {
            originalName: file.originalname,
            fileName: fileName,
            filePath: filePath,
            size: file.size
        });

        // Simpan file menggunakan diskStorage (file sudah disimpan oleh multer)
        // Kita hanya perlu return filename/path
        const relativePath = `/uploads/medical-certificates/${fileName}`;

        console.log('File uploaded successfully:', relativePath);
        return relativePath;

    } catch (error) {
        console.error('❌ File upload error:', error);
        return null;
    }
};
