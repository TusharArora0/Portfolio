const router = require('express').Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Add new project
router.post('/', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const savedProject = await newProject.save();
        res.status(200).json(savedProject);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update project
router.put('/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedProject);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete project
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json("Project has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router; 