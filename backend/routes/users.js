const router = require('express').Router();
const User = require('../models/User');

// Get a user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json('Account has been updated');
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json('You can update only your account!');
    }
});

module.exports = router; 