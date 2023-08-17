
const apiKeys = {
    'ahmadd': { limit: 1000000 }, // Batasan khusus untuk API key 'ahmad'
    'madzz': { limit: Infinity } // Tidak ada batasan untuk API key kedua
  };
  
  const usageTracker = {}; // Objek untuk melacak penggunaan API key
  
  // Middleware untuk memeriksa API key dan batasan
  const checkApiKey = (req, res, next) => {
    const providedApiKey = req.query.ApiKey;
  
    const apiKeyData = apiKeys[providedApiKey];
  
    if (apiKeyData) {
      if (!usageTracker[providedApiKey]) {
        usageTracker[providedApiKey] = 1;
      } else {
        usageTracker[providedApiKey]++;
      }
  
      if (usageTracker[providedApiKey] > apiKeyData.limit) {
        res.status(429).json({ error: 'API key usage limit exceeded' });
      } else {
        next();
      }
    } else {
      res.status(401).json({ error: 'Invalid API key' });
    }
  };
  

  module.exports = checkApiKey