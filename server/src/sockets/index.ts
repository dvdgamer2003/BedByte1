import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Bed from '../models/Bed';
import OPDQueue from '../models/OPDQueue';
import Hospital from '../models/Hospital';

export const initializeSocket = (httpServer: HTTPServer): SocketServer => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'https://getbedplus.netlify.app',
        process.env.CLIENT_URL
      ].filter((url): url is string => Boolean(url)),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join hospital room for updates
    socket.on('join-hospital', (hospitalId: string) => {
      socket.join(`hospital:${hospitalId}`);
      console.log(`Socket ${socket.id} joined hospital:${hospitalId}`);
    });

    // Leave hospital room
    socket.on('leave-hospital', (hospitalId: string) => {
      socket.leave(`hospital:${hospitalId}`);
      console.log(`Socket ${socket.id} left hospital:${hospitalId}`);
    });

    // Join OPD queue room
    socket.on('join-opd-queue', (hospitalId: string) => {
      socket.join(`opd:${hospitalId}`);
      console.log(`Socket ${socket.id} joined opd:${hospitalId}`);
    });

    // Leave OPD queue room
    socket.on('leave-opd-queue', (hospitalId: string) => {
      socket.leave(`opd:${hospitalId}`);
      console.log(`Socket ${socket.id} left opd:${hospitalId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Emit bed availability updates
  const emitBedUpdate = async (hospitalId: string) => {
    try {
      const bedsByRoomType = await Bed.aggregate([
        { $match: { hospitalId } },
        {
          $group: {
            _id: '$roomType',
            total: { $sum: 1 },
            available: {
              $sum: { $cond: [{ $eq: ['$isOccupied', false] }, 1, 0] },
            },
          },
        },
      ]);

      const hospital = await Hospital.findById(hospitalId);

      io.to(`hospital:${hospitalId}`).emit('bed-update', {
        hospitalId,
        bedAvailability: bedsByRoomType,
        lastUpdated: hospital?.lastUpdated || new Date(),
      });
    } catch (error) {
      console.error('Error emitting bed update:', error);
    }
  };

  // Emit OPD queue updates
  const emitQueueUpdate = async (hospitalId: string) => {
    try {
      const queue = await OPDQueue.find({
        hospitalId,
        status: { $in: ['waiting', 'in_consultation'] },
      })
        .sort({ tokenNumber: 1 })
        .select('-patientId');

      const currentToken = await OPDQueue.findOne({
        hospitalId,
        status: 'in_consultation',
      });

      io.to(`opd:${hospitalId}`).emit('queue-update', {
        queue,
        currentToken: currentToken?.tokenNumber || null,
        queueLength: queue.length,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error emitting queue update:', error);
    }
  };

  // Expose emit functions
  (io as any).emitBedUpdate = emitBedUpdate;
  (io as any).emitQueueUpdate = emitQueueUpdate;

  return io;
};

export default initializeSocket;
