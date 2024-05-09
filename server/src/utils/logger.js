import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_FILE_PATH = path.join(__dirname, 'log.txt');


export default async (code, userId, errorMessage, level, req) => {
  let ip = 'no-ip';
  if(req !== '') ip = ipHelper(req);    

  // Log mesajını formatla
  const logEntry = `${new Date().toISOString()} - Result Code: ${code}, Level: ${level}, Error Message: ${errorMessage}, IP: ${ip}${userId ? ', User ID: ' + userId : ''}\n`;

  // Dosyaya ekleme yap (append)
  fs.appendFile(LOG_FILE_PATH, logEntry, (err) => {
    if (err) {
      console.error('Logging failed: ', err);
    }
  });
}
