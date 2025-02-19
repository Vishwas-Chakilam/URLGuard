import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">About URLGuard</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <section className="p-6 rounded-lg border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400">
            URLGuard uses advanced machine learning algorithms to analyze URLs and determine their potential threat level. 
            Our model is trained on millions of URLs and is constantly updated to detect new threats.
          </p>
        </section>

        <section className="p-6 rounded-lg border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
            <li>Real-time URL analysis</li>
            <li>Machine learning-powered threat detection</li>
            <li>Comprehensive analysis history</li>
            <li>Dark mode support</li>
            <li>Responsive design for all devices</li>
          </ul>
        </section>

        <section className="p-6 rounded-lg border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Technology Stack</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Built with modern web technologies including React, TypeScript, Tailwind CSS, and Framer Motion. 
            Our machine learning model is continuously trained and updated to provide accurate threat detection.
          </p>
        </section>

        <section className="p-6 rounded-lg border dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We take your privacy seriously. All URL analyses are performed securely, and we don't store any personal information. 
            Analysis history is stored locally on your device.
          </p>
        </section>
      </motion.div>
    </div>
  );
}