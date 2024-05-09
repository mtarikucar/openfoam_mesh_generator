import logger from '../logger.js';

export default (code, req, errorMessage) => {
  let userId = req?.user?._id || '';

  // Varsayılan mesaj, dil dosyalarından kurtulduk
  let defaultMessage = 'An unexpected error has occurred.';
  
  // Hata mesajı, varsayılan veya gönderilen hata mesajı
  const finalMessage = errorMessage || defaultMessage;

  // Loglama seviyesi, hata koduna göre ayarlanabilir
  const logLevel = code.startsWith('5') ? 'Server Error' : 'Client Error';

  // Loglama fonksiyonunu çağır
  logger(code, userId, finalMessage, logLevel, req);

  // Sadece İngilizce mesaj döndür
  return {
    'resultMessage': finalMessage,
    'resultCode': code
  };
};
