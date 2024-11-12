const express = require('express');
const { body, validationResult } = require('express-validator');
const ToDo = require('../models/ToDo');

const router = express.Router();

// create ToDo - POST /todos
router.post('/create',body('title').notEmpty().withMessage('Title is required'),
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}

try {
const { title, description, isComplete } = req.body;
const todo = new ToDo({title, description, isComplete: isComplete });

await todo.save();
res.status(201).json(todo);
} catch (error) {
res.status(500).json({ message: error.message });
}
}
);

// Update ToDo - PUT /todos/:id
router.put('/put',
[
    body('title').optional().notEmpty().withMessage('Title must be non-empty if provided'),
    body('description').optional(),
    body('isComplete').optional().isBoolean().withMessage('isComplete must be a boolean')
],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { title, description, isComplete } = req.body;
        const updatedTodo = await ToDo.findByIdAndUpdate({_id:id},
            { title, description, isComplete },
            { new: true });
            if (!updatedTodo) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(200).json(updatedTodo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

// Delete ToDo - DELETE /todos/:id
router.delete('/delete:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await ToDo.findByIdAndDelete({_id:id});
        if (!deleteTodo) {
            return res.status(404).json({ error: 'value not found' });
        }
        return res.status(200).json({ success: 'value deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }});

// Get All ToDos - GET /todos
router.get('/getAll', async (req, res) => {
    try {
        const todos = await ToDo.find();
        if(todos ==null){
            res.status(400).json({error:'no record'});}
            res.status(200),json(todos);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
// Get ToDo by ID - GET /todos/:id
router.get('/:id', async (req, res) =>{
try {
    const { id } = req.params;
    const todo = await ToDo.findById(id);
    if (!todo) {
        return res.status(404).json({ message: 'ToDo not found'});
    }
    res.status(200).json(todo);
}
catch (error) {
    res.status(500).json({ error: error.message });
}
});

module.exports = router;