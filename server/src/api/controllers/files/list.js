import { log } from 'console';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export default async (req, res) => {
  try {
    const directoryPath = path.join(__dirname,"..","..","..","..","public");


  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).send({ message: "Unable to scan files!" });
    }
    const fileInfos = files.map(file => {
      return { name: file, url: `/files/${file}` };
    });
    res.send(fileInfos);
  });

  
  } catch (error) {
    console.error('Error during mesh generation:', error);
    res.status(500).send(error.message);
  }
}


/**
 * @swagger
 * /files/list:
 *   get:
 *     summary: List Files in a Directory
 *     description: Retrieves a list of files from a specified directory and returns their names and URLs for download.
 *     tags:
 *       - File Operations
 *     responses:
 *       "200":
 *         description: Successfully retrieved file list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the file.
 *                     example: "example.txt"
 *                   url:
 *                     type: string
 *                     description: URL to download the file.
 *                     example: "/files/example.txt"
 *       "500":
 *         description: Unable to scan files or internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to scan files!"
 */
