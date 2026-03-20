const mongoose = require('mongoose');
const winston = require('winston');

// Database connection class
class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      this.connection = conn.connection;
      winston.info(`MongoDB Connected: ${this.connection.host}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        winston.error('Database connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        winston.warn('Database disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        winston.info('Database reconnected');
      });

      return this.connection;
    } catch (error) {
      winston.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      winston.info('Database disconnected');
    } catch (error) {
      winston.error('Error disconnecting from database:', error);
    }
  }

  getConnection() {
    return this.connection;
  }

  async healthCheck() {
    try {
      const state = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };

      return {
        status: states[state],
        host: this.connection?.host,
        name: this.connection?.name
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;
