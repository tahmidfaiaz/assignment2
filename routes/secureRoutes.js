const express = require('express');
const router = express.Router();

// Import necessary models and middleware
const Contact = require('../models/Contact');
const User = require('../models/User');
// Add other imports as needed
// Handle user login

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user with the provided username
    const user = await User.findOne({ username });

    if (user && user.password === password) {
      req.session.user = user;
      res.redirect('business-contacts');
    } else {
      res.redirect('/login?error=true');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Handle user logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};
router.get('/login', (req, res) => {
  res.render('secure/login', { req: req, title: 'Login' }); // Render the login view
});

// Business Contacts List route
router.get(
  '/business-contacts',
  isAuthenticated,
  async (req, res) => {
    try {
      // Fetch contacts from the database
      const contacts = await Contact.find(); // Replace with your Contact model
      res.render('secure/businessContacts', {
        contacts,
        user: req.user,
      }); // Render the businessContacts view with data
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  }
);

// Update View route
router.get('/update/:id', isAuthenticated, async (req, res) => {
  try {
    // Fetch the contact by ID from the database
    const contact = await Contact.findById(req.params.id); // Replace with your Contact model
    res.render('secure/updateContact', { contact, user: req.user }); // Render the updateContact view with data
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.post('/update/:id', isAuthenticated, async (req, res) => {
  try {
    const updatedContact = {
      name: req.body.name,
      number: req.body.number,
      email: req.body.email,
    };
    // Update the contact in the database by ID
    await Contact.findByIdAndUpdate(req.params.id, updatedContact);
    res.redirect('/business-contacts'); // Redirect back to the businessContacts view
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete route (handle deleting a contact)
router.get('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    // Delete the contact by ID from the database
    await Contact.findByIdAndDelete(req.params.id); // Replace with your Contact model
    res.redirect('/business-contacts'); // Redirect back to the businessContacts view
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
