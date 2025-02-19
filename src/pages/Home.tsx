import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ShieldCheckIcon className="h-24 w-24 text-blue-600 dark:text-blue-400 mb-6" />
        <h1 className="text-4xl font-bold mb-4">
          Protect Yourself from Malicious URLs
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
          Our advanced machine learning model helps you identify potentially harmful URLs
          before you visit them. Stay safe online with URLGuard.
        </p>
        <Link
          to="/analysis"
          className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Analyzing
        </Link>
      </motion.div>
    </div>
  );
}