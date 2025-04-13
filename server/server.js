require('dotenv').config();
const express = require('express');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { DBconnection } = require("./connectDB");
const { UserDB } = require("./userDB");
const Blog = require('./model').Blog;
const { BlogDB } = require("./blogDB");
const authorizationMiddleware = require("./authorization-middleware");


const app = express();
app.use(express.json());

DBconnection.setupDB();

const userDB = new UserDB();
const blogDB = new BlogDB();

//Sign-up route
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

//Sign-in route
app.post('/api/auth/sign-in', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required fields"});
    }

    const result = await userDB.loginUser({ username, password });
    if (!result) {
        return res.status(401).json({ error: 'Invalid username or password '});
    }
    res.status(200).json(result);
})

//Create user blog
app.post('/api/blogs', async (req, res) => {
    try {
        const {title, content, image, author, location} = req.body;
        if (!title || !content || !author || !location) {
            return res.status(400).json({error: "title, content, author, and location are required fields"});
        }
        const result = await BlogDB.addBlog(req.body);
        if (result) {
            res.status(201).json({message: "Blog post was created successfully!"});
        } else {
            res.status(500).json({error: "Failed to create a blog post."});
        } 
    } catch (err) {
        res.status(500).json({error: "Server error creating a blog post"});
    }
})

//Get user blog posts route
app.get('/api/blog-feed', authorizationMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await Blog.find({author: userId}).populate('author', 'username');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching blog posts. '});
    }
})

//Get all blog, used for #destination and globe gui
app.get('/api/get/all', async (req, res) => {
    const result = await blogDB.findBlog({});
    if (!result) {
        return res.status(404).json({ error: 'No blog found.'});
    }
    res.status(200).json(result);
})

/*//Get selection of blogs, used for user blog 
//searches in order of title then body (maybe if we can have a place for a country then we can do that?)
//not done, just returns all blogs atm.
app.get('/api/get/user', async (req, res) => {
    const user = req.body;
    
    const result = await blogDB.findBlog({username: user});
    if (!result) {
        return res.status(401).json({ error: 'No blog found.'});
    }
    res.status(200).json(result);
})*/

//Get selection of blogs, used for search
//searches in order of title then body (maybe if we can have a place for a country then we can do that?)
//not done, just returns all blogs atm.
app.get('/api/get/search', async (req, res) => {
    const phrase = req.body;
    
    const result = await blogDB.findBlog({});
    if (!result) {
        return res.status(401).json({ error: 'No blog found.'});
    }
    res.status(200).json(result);
})

app.get('/', (req, res) => res.send('API is running'));
app.listen(3001, () => console.log('Server is running on port 3001'));