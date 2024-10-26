const express = require('express');
const router = express.Router();

const getAllUsers = require('./routes/hello-world');
router.get('/hello_world', getAllUsers);

module.exports = router;


