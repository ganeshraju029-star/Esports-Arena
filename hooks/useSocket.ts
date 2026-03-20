'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import socketService from '@/lib/socket';

export const useSocket = () => {
  const { token, isAuthenticated } = useAuth();
  const socketInitialized = useRef(false);

  useEffect(() => {
    if (isAuthenticated && token && !socketInitialized.current) {
      // Connect to socket
      socketService.connect(token);
      socketInitialized.current = true;

      // Cleanup on unmount
      return () => {
        socketService.disconnect();
        socketInitialized.current = false;
      };
    } else if (!isAuthenticated && socketInitialized.current) {
      // Disconnect when user logs out
      socketService.disconnect();
      socketInitialized.current = false;
    }
  }, [isAuthenticated, token]);

  const joinTournament = (tournamentId: string) => {
    socketService.joinTournament(tournamentId);
  };

  const leaveTournament = (tournamentId: string) => {
    socketService.leaveTournament(tournamentId);
  };

  const onTournamentUpdate = (callback: (data: any) => void) => {
    socketService.onTournamentUpdate(callback);
    return () => socketService.off('tournamentUpdated', callback);
  };

  const onPlayerJoined = (callback: (data: any) => void) => {
    socketService.onPlayerJoined(callback);
    return () => socketService.off('playerJoined', callback);
  };

  const onPlayerLeft = (callback: (data: any) => void) => {
    socketService.onPlayerLeft(callback);
    return () => socketService.off('playerLeft', callback);
  };

  const onTournamentCreated = (callback: (data: any) => void) => {
    socketService.onTournamentCreated(callback);
    return () => socketService.off('tournamentCreated', callback);
  };

  const onWalletUpdated = (callback: (data: any) => void) => {
    socketService.onWalletUpdated(callback);
    return () => socketService.off('walletUpdated', callback);
  };

  const onNotification = (callback: (data: any) => void) => {
    socketService.onNotification(callback);
    return () => socketService.off('notification', callback);
  };

  return {
    isConnected: socketService.isSocketConnected(),
    joinTournament,
    leaveTournament,
    onTournamentUpdate,
    onPlayerJoined,
    onPlayerLeft,
    onTournamentCreated,
    onWalletUpdated,
    onNotification,
  };
};
