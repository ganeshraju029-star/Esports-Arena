import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }

  // Tournament events
  joinTournament(tournamentId: string) {
    if (this.socket) {
      this.socket.emit('joinTournament', tournamentId);
    }
  }

  leaveTournament(tournamentId: string) {
    if (this.socket) {
      this.socket.emit('leaveTournament', tournamentId);
    }
  }

  onTournamentUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('tournamentUpdated', callback);
    }
  }

  onPlayerJoined(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('playerJoined', callback);
    }
  }

  onPlayerLeft(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('playerLeft', callback);
    }
  }

  onTournamentCreated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('tournamentCreated', callback);
    }
  }

  onTournamentDeleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('tournamentDeleted', callback);
    }
  }

  // Wallet events
  onWalletUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('walletUpdated', callback);
    }
  }

  // User events
  onUserBanned(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('userBanned', callback);
    }
  }

  // Match events
  onMatchResultAdded(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('matchResultAdded', callback);
    }
  }

  // Notification events
  onNotification(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Remove event listeners
  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Emit custom events
  emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
