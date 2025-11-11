const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;
const USERS_FILE = 'users.json';

// Middleware
app.use(bodyParser.json());
app.use(express.static('./')); // Serve your HTML file and assets

// Load users
let users = {};
if (fs.existsSync(USERS_FILE)) {
  users = JSON.parse(fs.readFileSync(USERS_FILE));
}

// Save users
function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.json({ message: 'Please fill all fields!' });
  if (users[username]) return res.json({ message: 'Username already exists!' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = { password: hashedPassword };
  saveUsers();

  res.json({ message: 'Account created successfully!' });
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!users[username]) return res.json({ message: 'User not found!' });

  const validPassword = await bcrypt.compare(password, users[username].password);
  if (!validPassword) return res.json({ message: 'Incorrect password!' });

  res.json({ message: 'Login successful!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
