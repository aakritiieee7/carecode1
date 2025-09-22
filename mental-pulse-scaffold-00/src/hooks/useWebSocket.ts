import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  connectionId: string;
  message: string;
  senderId: string;
  timestamp: string;
  senderType: 'student' | 'mentor';
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinConnection: (connectionId: string) => void;
  sendMessage: (connectionId: string, message: string) => void;
  leaveConnection: (connectionId: string) => void;
  messages: Message[];
  clearMessages: () => void;
}

export const useWebSocket = (): UseWebSocketReturn => {
  const { user, token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      const socket = io('http://localhost:3001', {
        auth: {
          token: token
        },
        autoConnect: true,
      });

      socketRef.current = socket;

      // Connection event handlers
      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        toast.error('Failed to connect to messaging service');
        setIsConnected(false);
      });

      // Message event handlers
      socket.on('new-message', (data: Message) => {
        console.log('New message received:', data);
        setMessages(prev => [...prev, data]);
        
        // Show notification if message is from another user
        if (data.senderId !== user.id) {
          toast.info(`New message from ${data.senderType}`, {
            description: data.message.slice(0, 50) + (data.message.length > 50 ? '...' : ''),
          });
        }
      });

      socket.on('message-notification', (data) => {
        console.log('Message notification:', data);
        // Handle message notifications (like read receipts, typing indicators, etc.)
      });

      socket.on('user-joined', (data) => {
        console.log('User joined connection:', data);
        toast.success(`${data.userType} joined the conversation`);
      });

      socket.on('user-left', (data) => {
        console.log('User left connection:', data);
        toast.info(`${data.userType} left the conversation`);
      });

      // Error handlers
      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
        toast.error(error.message || 'An error occurred with the messaging service');
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      };
    }
  }, [user, token]);

  const joinConnection = (connectionId: string) => {
    if (socketRef.current && isConnected) {
      console.log('Joining connection:', connectionId);
      socketRef.current.emit('join-connection', connectionId);
    }
  };

  const sendMessage = (connectionId: string, message: string) => {
    if (socketRef.current && isConnected) {
      console.log('Sending message to connection:', connectionId, message);
      socketRef.current.emit('send-message', {
        connectionId,
        message
      });
    } else {
      toast.error('Not connected to messaging service');
    }
  };

  const leaveConnection = (connectionId: string) => {
    if (socketRef.current && isConnected) {
      console.log('Leaving connection:', connectionId);
      socketRef.current.emit('leave-connection', connectionId);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinConnection,
    sendMessage,
    leaveConnection,
    messages,
    clearMessages,
  };
};

export default useWebSocket;