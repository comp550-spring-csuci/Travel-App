const express = require('express');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { DBConnection } = require("./connectDB");

require('dotenv').config();

const app = express();

app.use(express.json());