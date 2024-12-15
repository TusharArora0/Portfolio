const router = require('express').Router();
const Contact = require('../models/Contact');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        const savedContact = await newContact.save();
        res.status(200).json(savedContact);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all messages (for admin)
router.get('/', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedMessage = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router; 