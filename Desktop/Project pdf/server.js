const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const cors = require('cors');
const os = require('os');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend connection
app.use(cors());

// Configure multer for disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir());
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, ''));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB per file limit (better for mobile)
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Endpoint: GET / (Serve frontend)
app.get('/', (req, res) => {
    res.sendFile('c:\\Users\\allab\\Downloads\\ai_studio_code.html');
});

// Endpoint: POST /merge
app.post('/merge', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;

        // Validate at least 2 files are uploaded
        if (!files || files.length < 2) {
            // Clean up files before returning
            if (files) {
                for (const file of files) {
                    await fs.unlink(file.path).catch(() => {});
                }
            }
            return res.status(400).json({ error: 'Please upload at least 2 PDF files to merge.' });
        }

        // Create a new PDF document
        const mergedPdf = await PDFDocument.create();

        // Loop through the files in the exact order received
        for (const file of files) {
            // Load the uploaded PDF from disk instead of memory buffer
            const fileBuffer = await fs.readFile(file.path);
            const pdf = await PDFDocument.load(fileBuffer);
            
            // Copy all pages from the current PDF
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            
            // Add copied pages to the merged PDF
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }

        // Serialize the merged PDF to bytes
        const mergedPdfBytes = await mergedPdf.save();

        // Clean up temporary files immediately after processing
        for (const file of files) {
            await fs.unlink(file.path).catch(() => {});
        }

        // Set response headers for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
        res.setHeader('Content-Length', mergedPdfBytes.length);

        // Send the merged PDF bytes
        const buffer = Buffer.from(mergedPdfBytes);
        res.end(buffer);

    } catch (error) {
        console.error('Error merging PDFs:', error);
        
        // Clean up temporary files on error
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => {});
            }
        }
        
        // Return clear error message
        res.status(500).json({ error: 'An error occurred while merging the files. Please try again.' });
    }
});

// Global error handler for multer limits & custom errors
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size exceeds the 50MB limit.' });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
