const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global variable to track MongoDB connection status
let isMongoConnected = false;

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://frontend-beryl-iota-21.vercel.app',
        'https://frontend-beryl-iota-21.vercel.app/',
        'http://localhost:5000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is not defined in environment variables');
            return false;
        }
        
        console.log('Attempting to connect to MongoDB...');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4
        });
        
        console.log('MongoDB connected successfully');
        isMongoConnected = true;
        return true;
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        if (err.name === 'MongoServerSelectionError') {
            console.error('Could not connect to MongoDB server. Please check:');
            console.error('1. Your network connection');
            console.error('2. MongoDB Atlas whitelist settings');
            console.error('3. Database user credentials');
        }
        isMongoConnected = false;
        return false;
    }
};

// Attempt initial connection
connectDB();

// Middleware to check MongoDB connection
const checkMongoConnection = (req, res, next) => {
    if (!isMongoConnected && req.path !== '/api/test' && !req.path.startsWith('/favicon')) {
        return res.status(503).json({
            message: 'Database connection is not available',
            status: 'error'
        });
    }
    next();
};

app.use(checkMongoConnection);

// Basic route to test the server
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend server is running',
        timestamp: new Date().toISOString(),
        env: {
            nodeEnv: process.env.NODE_ENV,
            mongoDbConnected: isMongoConnected
        }
    });
});

// Test route for MongoDB connection
app.get('/api/test', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        // Try to reconnect if disconnected
        if (dbState === 0) {
            await connectDB();
        }

        res.json({
            message: 'Test route',
            mongoDbStatus: states[mongoose.connection.readyState],
            isConnected: isMongoConnected,
            env: process.env.NODE_ENV,
            timestamp: new Date().toISOString(),
            mongoDbUri: process.env.MONGODB_URI ? 'URI is set' : 'URI is missing'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error in test route',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');

// Use Routes with full paths
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

// Handle 404 - Keep this last
app.use((req, res) => {
    if (req.path === '/favicon.ico') {
        return res.status(204).end();
    }
    
    console.log('404 Not Found:', req.method, req.path);
    res.status(404).json({ 
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('CORS enabled for:', [
        'http://localhost:3000',
        'https://frontend-beryl-iota-21.vercel.app'
    ]);
});

// Handle server shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});
