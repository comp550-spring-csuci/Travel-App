const express = require('express');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { DBconnection } = require("./connectDB");

require('dotenv').config();

const app = express();

app.use(express.json());

DBconnection.setupDB();

app.get('/', (req, res) => res.send('API is running'));
app.listen(3001, () => console.log('Server is running on port 3001'));