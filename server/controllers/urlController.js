import UrlAnalysis from '../models/UrlAnalysis.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { analyzeUrl } from '../services/urlAnalyzer.js';

export const analyzeUrlEndpoint = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user.id;

    const result = await analyzeUrl(url);
    
    const analysis = new UrlAnalysis({
      userId,
      url,
      result: result.status,
      confidence: result.confidence,
      features: result.features,
    });

    await analysis.save();

    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: {
        'stats.urlsAnalyzed': 1,
        'stats.points': 5,
        [`stats.${result.status}Detected`]: 1,
      },
    });

    res.json({
      status: result.status,
      confidence: result.confidence,
      features: result.features,
    });
  } catch (error) {
    logger.error('URL analysis error:', error);
    res.status(500).json({ message: 'Analysis failed' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const analyses = await UrlAnalysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(analyses);
  } catch (error) {
    logger.error('History fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};