const router = require('express').Router();
const Contact = require('../models/Contact');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        // Validate required fields
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide name, email, and message' 
            });
        }

        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();
        
        res.status(200).json({
            success: true,
            message: 'Message sent successfully',
            data: savedContact
        });
    } catch (err) {
        console.error('Contact submission error:', err);
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