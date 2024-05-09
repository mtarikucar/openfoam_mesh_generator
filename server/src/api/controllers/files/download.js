import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default async (req, res) => {
    const dirName = req.query.filename;
    const directoryPath = path.join(__dirname, "..", "..", "..", "..", "public", dirName);

    if (!fs.existsSync(directoryPath) || !fs.lstatSync(directoryPath).isDirectory()) {
        return res.status(404).send({ message: "Directory not found." });
    }

    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-disposition': `attachment; filename=${dirName}.zip`
    });

    const archive = archiver('zip', { zlib: { level: 9 } }); // Sıkıştırma seviyesi
    archive.on('error', function(err) {
        res.status(500).send({ message: "Could not create zip file: " + err });
    });

    archive.pipe(res);
    archive.directory(directoryPath, false);
    archive.finalize();
}



/**
 * @swagger
 * /files/zip:
 *   get:
 *     summary: Download a Zip Archive of a Directory
 *     description: This endpoint compresses the specified directory into a zip archive and sends it as a download to the client.
 *     parameters:
 *       - in: query
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the directory to be compressed and downloaded.
 *         example: "myFiles"
 *     tags:
 *       - File Operations
 *     responses:
 *       "200":
 *         description: A zip archive of the specified directory.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       "404":
 *         description: Directory not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Directory not found."
 *       "500":
 *         description: Internal server error when trying to create the zip file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Could not create zip file: [error description]"
 */
