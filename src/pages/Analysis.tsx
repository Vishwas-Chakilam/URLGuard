import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useUrlHistory } from '../contexts/UrlHistoryContext';
import RiskBreakdown from '../components/analysis/RiskBreakdown';

export default function Analysis() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<'safe' | 'malicious' | null>(null);
  const [features, setFeatures] = useState<any>(null);
  const { addAnalysis } = useUrlHistory();

  const handleAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockResult: 'safe' | 'malicious' = Math.random() > 0.5 ? 'safe' : 'malicious';
    
    const mockFeatures = {
      urlLength: url.length,
      domainAge: Math.floor(Math.random() * 365),
      hasSpecialChars: /[^a-zA-Z0-9-.]/.test(new URL(url).hostname),
      tldsCount: url.split('.').length - 1,
    };

    setResult(mockResult);
    setFeatures(mockFeatures);
    setIsAnalyzing(false);
    
    addAnalysis({
      url,
      status: mockResult,
      timestamp: new Date(),
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">URL Analysis</h1>
      
      <form onSubmit={handleAnalysis} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-2">
            Enter URL to analyze
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
            required
            placeholder="https://example.com"
          />
        </div>
        
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze URL'}
        </button>
      </form>

      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing URL...</p>
        </motion.div>
      )}

      {result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="p-6 rounded-lg border dark:border-gray-700">
            <div className="flex items-center justify-center mb-4">
              {result === 'safe' ? (
                <CheckCircleIcon className="h-12 w-12 text-green-500" />
              ) : (
                <XCircleIcon className="h-12 w-12 text-red-500" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">
              {result === 'safe' ? 'URL appears to be safe' : 'Potentially malicious URL detected'}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400">
              {result === 'safe'
                ? 'Our analysis suggests this URL is safe to visit.'
                : 'We recommend avoiding this URL as it may be harmful.'}
            </p>
          </div>

          {features && <RiskBreakdown features={features} />}
        </motion.div>
      )}
    </div>
  );
}