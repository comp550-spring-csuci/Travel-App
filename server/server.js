require('dotenv').config();
const express = require('express');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { DBconnection } = require("./connectDB");
const { UserDB } = require('./userDB');


const app = express();
app.use(express.json());

DBconnection.setupDB();

const userDB = new UserDB();

//Sign up route
app.post('/api/auth/sign-up', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required fields"});
    }

    const success = await userDB.signUpUser(req.body);
    if (success) {
        res.status(201).json({ message: 'User created' });
    } else {
        res.status(409).json({ error: 'Username already exists '});
    }
});

app.get('/', (req, res) => res.send('API is running'));
app.listen(3001, () => console.log('Server is running on port 3001'));