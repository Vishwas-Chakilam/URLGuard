import { Server } from 'socket.io';
import logger from '../utils/logger.js';

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('analyze_url', async (data) => {
      // Emit progress updates
      socket.emit('analysis_progress', { progress: 0, message: 'Starting analysis...' });
      
      // Simulate ML analysis
      setTimeout(() => {
        socket.emit('analysis_progress', { progress: 50, message: 'Processing URL features...' });
      }, 1000);

      setTimeout(() => {
        socket.emit('analysis_complete', {
          result: Math.random() > 0.5 ? 'safe' : 'malicious',
          confidence: Math.random() * 100,
        });
      }, 2000);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export default initializeSocket;