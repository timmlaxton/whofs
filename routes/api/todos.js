const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Todo = require('../../models/Todos');
const User = require('../../models/User');

// @Route   POST api/todos
// @desc    Test Route
// @access  Public
router.post(
  '/', 
  [auth, [check('message', 'Message os required').not().isEmpty()]],
 async (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()) {
     return res.status(400).json({  errors: errors.array()  })
   }

   try {
    const user = await User.findById(req.user.id).select('-password');

    const newTodo = new Todo ({
      message: req.body.message,
      name: user.name,
      user: req.user.id
    });


     const todo = await newTodo.save()
      res.json(todo)
   } catch (err) {
     console.error(err.message);
     res.status(500).send('Server Error')
   }
  }
);

// @route    GET api/todos
// @desc     Get all todos
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    res.json(todos)
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/todos/:id
// @desc     Get todo by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({ msg: 'Todo not found' })
    }

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Todo not foud'});
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/todos/:id
// @desc     Delete a todo
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await todo.remove();

    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Todo not foud'});
    }
    res.status(500).send('Server Error');
  }
});



module.exports = router;