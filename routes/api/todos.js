const express = require('express');
const router = express.Router();

// @Route   GET api/todos
// @desc    Test Route
// @access  Public
router.get('/', (req, res) => res.send('Todos route'));

module.exports = router;