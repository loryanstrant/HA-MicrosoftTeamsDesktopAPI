const WebSocket = require('ws');
const EventEmitter = require('events');
const crypto = require('crypto');

class TeamsAPIClient extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.token = null;
    this.reconnectInterval = null;
    this.isConnecting = false;
    this.connectionAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  connect(token) {
    if (this.isConnecting) return;
    
    this.token = token;
    this.isConnecting = true;
    this.connectionAttempts++;

    const wsUrl = `ws://localhost:8124?token=${token}&protocol-version=2.0.0&manufacturer=Teams2HA&device=Desktop&app=Teams2HA&app-version=1.0.0`;

    console.log('Connecting to Teams API...');
    
    try {
      this.ws = new WebSocket(wsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      this.ws.on('open', () => {
        console.log('Connected to Teams API');
        this.isConnecting = false;
        this.connectionAttempts = 0;
        this.emit('connected');
        this.startHeartbeat();
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing Teams API message:', error);
        }
      });

      this.ws.on('error', (error) => {
        console.error('Teams API WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', error);
      });

      this.ws.on('close', () => {
        console.log('Teams API connection closed');
        this.isConnecting = false;
        this.emit('disconnected');
        this.stopHeartbeat();
        
        // Attempt reconnection
        if (this.token && this.connectionAttempts < this.maxReconnectAttempts) {
          console.log(`Reconnecting in 5 seconds (attempt ${this.connectionAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(this.token), 5000);
        }
      });
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.isConnecting = false;
      this.emit('error', error);
    }
  }

  handleMessage(message) {
    console.log('Teams API message:', message);
    
    if (message.meetingUpdate) {
      const state = {
        isMuted: message.meetingUpdate.meetingState?.isMuted || false,
        isCameraOn: message.meetingUpdate.meetingState?.isCameraOn || false,
        isHandRaised: message.meetingUpdate.meetingState?.isHandRaised || false,
        isInMeeting: message.meetingUpdate.meetingState?.isInMeeting || false,
        isRecordingOn: message.meetingUpdate.meetingState?.isRecordingOn || false,
        isBackgroundBlurred: message.meetingUpdate.meetingState?.isBackgroundBlurred || false,
        isSharing: message.meetingUpdate.meetingState?.isSharing || false,
        hasUnreadMessages: message.meetingUpdate.meetingState?.hasUnreadMessages || false
      };
      
      this.emit('meeting-update', state);
    }
    
    if (message.tokenRefresh) {
      this.token = message.tokenRefresh;
      this.emit('token-refresh', message.tokenRefresh);
    }
  }

  async requestPairing() {
    return new Promise((resolve, reject) => {
      const pairingWs = new WebSocket('ws://localhost:8124?protocol-version=2.0.0&manufacturer=Teams2HA&device=Desktop&app=Teams2HA&app-version=1.0.0');
      
      pairingWs.on('open', () => {
        console.log('Pairing connection established');
      });

      pairingWs.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('Pairing message:', message);
          
          if (message.tokenRefresh) {
            pairingWs.close();
            resolve(message.tokenRefresh);
          }
        } catch (error) {
          reject(error);
        }
      });

      pairingWs.on('error', (error) => {
        console.error('Pairing error:', error);
        reject(error);
      });

      // Timeout after 60 seconds
      setTimeout(() => {
        pairingWs.close();
        reject(new Error('Pairing timeout - please accept the pairing request in Teams'));
      }, 60000);
    });
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, 30000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.token = null;
    this.connectionAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }
}

module.exports = TeamsAPIClient;
