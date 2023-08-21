var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET users listing. */

router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the collection
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
