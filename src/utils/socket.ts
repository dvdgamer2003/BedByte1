import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  joinHospital(hospitalId: string): void {
    this.socket?.emit('join-hospital', hospitalId);
  }

  leaveHospital(hospitalId: string): void {
    this.socket?.emit('leave-hospital', hospitalId);
  }

  joinOPDQueue(hospitalId: string): void {
    this.socket?.emit('join-opd-queue', hospitalId);
  }

  leaveOPDQueue(hospitalId: string): void {
    this.socket?.emit('leave-opd-queue', hospitalId);
  }

  onBedUpdate(callback: (data: any) => void): void {
    this.socket?.on('bed-update', callback);
  }

  onQueueUpdate(callback: (data: any) => void): void {
    this.socket?.on('queue-update', callback);
  }

  offBedUpdate(): void {
    this.socket?.off('bed-update');
  }

  offQueueUpdate(): void {
    this.socket?.off('queue-update');
  }
}

export default new SocketService();
