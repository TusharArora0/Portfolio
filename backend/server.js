const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://frontend-beryl-iota-21.vercel.app',
        'https://frontend.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Access-Control-Allow-Credentials'
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());

// MongoDB Connection Options
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    family: 4,
    autoIndex: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000
};

// Connect to MongoDB with async function
const connectDB = async (force = false) => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MongoDB URI is not defined');
        }

        // If already connected and not forcing reconnect, return true
        if (mongoose.connection.readyState === 1 && !force) {
            return true;
        }

        // If in any other state than disconnected, force close
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            // Wait a bit for the connection to fully close
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Create new connection
        const conn = await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
        
        // Verify connection
        if (conn.connection.readyState === 1) {
            console.log('MongoDB Connected Successfully');
            console.log('Connected to database:', conn.connection.name);
            return true;
        }
        
        return false;
    } catch (err) {
        console.error('MongoDB connection error:', {
            name: err.name,
            message: err.message,
            code: err.code
        });
        return false;
    }
};

// Test MongoDB Connection
const testConnection = async () => {
    try {
        // First check connection state
        if (mongoose.connection.readyState !== 1) {
            return false;
        }

        // Try to ping the database
        await mongoose.connection.db.admin().ping();
        return true;
    } catch (err) {
        console.error('MongoDB ping failed:', err.message);
        // If ping fails, try to reconnect
        return await connectDB(true);
    }
};

// Retry connection with exponential backoff
const retryConnection = async (maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000); // Exponential backoff with max 10s
        console.log(`Connection attempt ${i + 1}/${maxRetries}`);
        
        const connected = await connectDB();
        if (connected) return true;
        
        if (i < maxRetries - 1) {
            console.log(`Waiting ${delay/1000} seconds before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return false;
};

// Initial connection attempt with retry
retryConnection().then(success => {
    if (!success) {
        console.error('Failed to connect to MongoDB after multiple attempts');
    }
});

// MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Basic route to test the server
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

// Test route for MongoDB connection
app.get('/api/test', async (req, res) => {
    try {
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        // Try to connect or reconnect
        const connected = await connectDB();
        
        // Test the connection
        const pingSuccess = await testConnection();
        let collections = [];
        let connectionTest = 'Not tested';

        if (connected && pingSuccess) {
            try {
                collections = await mongoose.connection.db.listCollections().toArray();
                connectionTest = `Connected, found ${collections.length} collections`;
            } catch (e) {
                connectionTest = `Error listing collections: ${e.message}`;
                // Try to reconnect on collection error
                await connectDB(true);
            }
        } else {
            connectionTest = 'Failed to establish connection';
            // Force reconnect on next attempt
            await mongoose.disconnect();
        }

        // Get final state
        const finalState = mongoose.connection.readyState;

        // Get connection details
        const connectionDetails = {
            state: states[finalState],
            database: mongoose.connection.name || 'not connected',
            host: mongoose.connection.host || 'not connected',
            port: mongoose.connection.port || 'not connected',
            readyState: finalState,
            connected: finalState === 1,
            ping: pingSuccess ? 'Success' : 'Failed'
        };

        res.json({
            message: 'Test route',
            mongoDbStatus: states[finalState],
            connectionTest,
            connectionDetails,
            collections: collections.map(c => c.name),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Test route error:', error);
        // Try to clean up connection on error
        await mongoose.disconnect();
        
        res.status(500).json({
            message: 'Error in test route',
            error: error.message,
            errorName: error.name,
            connectionState: mongoose.connection.readyState
        });
    }
});

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: 'Internal server error', 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed.');
            process.exit(0);
        });
    });
});
