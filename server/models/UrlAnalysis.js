import mongoose from 'mongoose';

const urlAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    enum: ['safe', 'malicious'],
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  features: {
    urlLength: Number,
    domainAge: Number,
    hasSpecialChars: Boolean,
    tldsCount: Number,
    // Add more ML features as needed
  },
}, {
  timestamps: true,
});

const UrlAnalysis = mongoose.model('UrlAnalysis', urlAnalysisSchema);

export default UrlAnalysis;