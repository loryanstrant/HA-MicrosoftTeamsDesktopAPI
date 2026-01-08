const mqtt = require('mqtt');
const EventEmitter = require('events');
const { machineId } = require('node-machine-id');

class MqttClient extends EventEmitter {
  constructor(settings) {
    super();
    this.settings = settings;
    this.client = null;
    this.deviceId = null;
    this.baseTopic = 'homeassistant';
  }

  async connect() {
    try {
      this.deviceId = await machineId();
      
      const options = {
        clientId: `teams2ha_${this.deviceId}`,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 5000,
        username: this.settings.mqttUsername || undefined,
        password: this.settings.mqttPassword || undefined,
      };

      // Handle TLS/SSL
      if (this.settings.mqttUseTls) {
        options.protocol = 'mqtts';
        options.rejectUnauthorized = !this.settings.mqttIgnoreCertErrors;
      }

      // Handle WebSocket
      if (this.settings.mqttUseWebSocket) {
        options.protocol = this.settings.mqttUseTls ? 'wss' : 'ws';
      }

      const protocol = options.protocol || 'mqtt';
      const host = this.settings.mqttHost || 'localhost';
      const port = this.settings.mqttPort || 1883;
      const brokerUrl = `${protocol}://${host}:${port}`;

      console.log('Connecting to MQTT broker:', brokerUrl);
      
      this.client = mqtt.connect(brokerUrl, options);

      this.client.on('connect', () => {
        console.log('Connected to MQTT broker');
        this.emit('connected');
        this.publishDiscovery();
      });

      this.client.on('error', (error) => {
        console.error('MQTT error:', error);
        this.emit('error', error);
      });

      this.client.on('close', () => {
        console.log('MQTT connection closed');
        this.emit('disconnected');
      });

    } catch (error) {
      console.error('Error connecting to MQTT:', error);
      this.emit('error', error);
    }
  }

  async testConnection() {
    return new Promise((resolve, reject) => {
      const options = {
        connectTimeout: 5000,
        username: this.settings.mqttUsername || undefined,
        password: this.settings.mqttPassword || undefined,
      };

      // Handle TLS/SSL
      if (this.settings.mqttUseTls) {
        options.protocol = 'mqtts';
        options.rejectUnauthorized = !this.settings.mqttIgnoreCertErrors;
      }

      // Handle WebSocket
      if (this.settings.mqttUseWebSocket) {
        options.protocol = this.settings.mqttUseTls ? 'wss' : 'ws';
      }

      const protocol = options.protocol || 'mqtt';
      const host = this.settings.mqttHost || 'localhost';
      const port = this.settings.mqttPort || 1883;
      const brokerUrl = `${protocol}://${host}:${port}`;

      const testClient = mqtt.connect(brokerUrl, options);

      testClient.on('connect', () => {
        testClient.end();
        resolve();
      });

      testClient.on('error', (error) => {
        testClient.end();
        reject(error);
      });
    });
  }

  publishDiscovery() {
    if (!this.client || !this.client.connected) return;

    const hostname = require('os').hostname();
    const deviceName = `Teams ${hostname}`;
    const uniqueId = this.deviceId;
    
    // Create a sanitized hostname for entity IDs (lowercase, replace special chars with underscores)
    const sanitizedHostname = hostname.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const deviceConfig = {
      identifiers: [uniqueId],
      name: deviceName,
      model: 'Teams2HA',
      manufacturer: 'Teams2HA',
      sw_version: '1.0.0'
    };

    const sensors = [
      {
        type: 'sensor',
        name: 'availability',
        icon: 'mdi:account-circle',
        device_class: null,
        state_topic: `${this.baseTopic}/sensor/${uniqueId}_availability/state`
      },
      {
        type: 'binary_sensor',
        name: 'in_meeting',
        icon: 'mdi:video',
        device_class: 'occupancy',
        state_topic: `${this.baseTopic}/binary_sensor/${uniqueId}_in_meeting/state`
      },
      {
        type: 'binary_sensor',
        name: 'camera_on',
        icon: 'mdi:video',
        device_class: null,
        state_topic: `${this.baseTopic}/binary_sensor/${uniqueId}_camera_on/state`
      },
      {
        type: 'binary_sensor',
        name: 'microphone_muted',
        icon: 'mdi:microphone-off',
        device_class: null,
        state_topic: `${this.baseTopic}/binary_sensor/${uniqueId}_microphone_muted/state`
      },
      {
        type: 'binary_sensor',
        name: 'hand_raised',
        icon: 'mdi:hand-back-right',
        device_class: null,
        state_topic: `${this.baseTopic}/binary_sensor/${uniqueId}_hand_raised/state`
      },
      {
        type: 'binary_sensor',
        name: 'background_blurred',
        icon: 'mdi:blur',
        device_class: null,
        state_topic: `${this.baseTopic}/binary_sensor/${uniqueId}_background_blurred/state`
      },
      {
        type: 'binary_sensor',
        name: 'recording',
        icon: 'mdi:record-rec',
        device_class: null,
        state_topic: `${this.baseTopic}/binary_sensor/${uniqueId}_recording/state`
      },
      {
        type: 'binary_sensor',
        name: 'screen_sharing',
        icon: 'mdi:monitor-share',
        device_class: null,
        state_topic: `${this.baseTopic}/binary_sensor/${uniqueId}_screen_sharing/state`
      }
    ];

    sensors.forEach(sensor => {
      const discoveryTopic = `${this.baseTopic}/${sensor.type}/${uniqueId}_${sensor.name}/config`;
      const config = {
        name: `${hostname} ${sensor.name.replace(/_/g, ' ')}`,
        object_id: `${sanitizedHostname}_${sensor.name}`,
        unique_id: `${uniqueId}_${sensor.name}`,
        state_topic: sensor.state_topic,
        icon: sensor.icon,
        device: deviceConfig
      };

      if (sensor.device_class) {
        config.device_class = sensor.device_class;
      }

      this.client.publish(discoveryTopic, JSON.stringify(config), { retain: true });
    });

    console.log('Published MQTT discovery messages');
  }

  async publishMeetingState(state) {
    if (!this.client || !this.client.connected) return;

    const uniqueId = this.deviceId;
    
    // Publish states
    const states = [
      { topic: `${this.baseTopic}/binary_sensor/${uniqueId}_in_meeting/state`, value: state.isInMeeting ? 'ON' : 'OFF' },
      { topic: `${this.baseTopic}/binary_sensor/${uniqueId}_camera_on/state`, value: state.isCameraOn ? 'ON' : 'OFF' },
      { topic: `${this.baseTopic}/binary_sensor/${uniqueId}_microphone_muted/state`, value: state.isMuted ? 'ON' : 'OFF' },
      { topic: `${this.baseTopic}/binary_sensor/${uniqueId}_hand_raised/state`, value: state.isHandRaised ? 'ON' : 'OFF' },
      { topic: `${this.baseTopic}/binary_sensor/${uniqueId}_background_blurred/state`, value: state.isBackgroundBlurred ? 'ON' : 'OFF' },
      { topic: `${this.baseTopic}/binary_sensor/${uniqueId}_recording/state`, value: state.isRecordingOn ? 'ON' : 'OFF' },
      { topic: `${this.baseTopic}/binary_sensor/${uniqueId}_screen_sharing/state`, value: state.isSharing ? 'ON' : 'OFF' }
    ];

    states.forEach(({ topic, value }) => {
      this.client.publish(topic, value);
    });

    // Determine availability status
    let availability = 'Available';
    if (state.isInMeeting) {
      if (state.isMuted && !state.isCameraOn) {
        availability = 'In Meeting (Audio/Video Off)';
      } else if (state.isMuted) {
        availability = 'In Meeting (Muted)';
      } else {
        availability = 'In Meeting';
      }
    }

    this.client.publish(`${this.baseTopic}/sensor/${uniqueId}_availability/state`, availability);
  }

  isConnected() {
    return this.client && this.client.connected;
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }
}

module.exports = MqttClient;
