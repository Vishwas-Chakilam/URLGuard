import logger from '../utils/logger.js';

const extractFeatures = (url) => {
  const urlObj = new URL(url);
  
  return {
    urlLength: url.length,
    domainAge: Math.floor(Math.random() * 1000), // Mock domain age
    hasSpecialChars: /[^a-zA-Z0-9-.]/.test(urlObj.hostname),
    tldsCount: urlObj.hostname.split('.').length - 1,
  };
};

export const analyzeUrl = async (url) => {
  try {
    logger.info(`Analyzing URL: ${url}`);
    
    const features = extractFeatures(url);
    
    // Mock ML model prediction
    const isMalicious = Math.random() > 0.7;
    const confidence = Math.random() * 40 + 60; // 60-100% confidence

    return {
      status: isMalicious ? 'malicious' : 'safe',
      confidence,
      features,
    };
  } catch (error) {
    logger.error('URL analysis error:', error);
    throw error;
  }
};