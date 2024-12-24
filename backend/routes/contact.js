const router = require('express').Router();
const Contact = require('../models/Contact');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        console.log('Received contact form submission:', req.body);

        // Validate required fields
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            console.log('Validation failed:', { name, email, message });
            return res.status(400).json({ 
                success: false,
                message: 'Please provide name, email, and message',
                received: { name, email, message }
            });
        }

        // Create new contact
        const newContact = new Contact({
            name,
            email,
            message,
            status: 'unread'
        });

        // Save to database
        const savedContact = await newContact.save();
        console.log('Contact saved successfully:', savedContact);
        
        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            data: savedContact
        });
    } catch (err) {
        console.error('Contact submission error:', {
            name: err.name,
            message: err.message,
            code: err.code,
            stack: err.stack
        });

        // Check for specific MongoDB errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(err.errors).map(e => e.message)
            });
        }

        if (err.name === 'MongoError' || err.name === 'MongoServerError') {
            return res.status(500).json({
                success: false,
                message: 'Database error',
                error: err.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: err.message
        });
    }
});

// Get all messages (for admin)
router.get('/', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        console.error('Fetch messages error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: err.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (err) {
        console.error('Delete message error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to delete message',
            error: err.message
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        const updatedMessage = await Contact.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        
        res.status(200).json({
            success: true,
            message: 'Message updated successfully',
            data: updatedMessage
        });
    } catch (err) {
        console.error('Update message error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to update message',
            error: err.message
        });
    }
});

module.exports = router; 