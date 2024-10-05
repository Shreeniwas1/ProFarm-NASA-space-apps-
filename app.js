const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load users from JSON file
const getUsers = () => {
    const data = fs.readFileSync('./data/users.json');
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));
};

// Signup route
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const users = getUsers();

    const userExists = users.find(user => user.email === email);

    if (userExists) {
        return res.json({ message: 'User already exists' });
    }

    users.push({ name, email, password });
    saveUsers(users);

    res.json({ message: 'Signup successful' });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        return res.json({ message: 'Invalid credentials' });
    }

    res.json({ message: `Welcome, ${user.name}!` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
