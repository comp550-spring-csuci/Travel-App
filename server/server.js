require('dotenv').config();
const express = require('express');
const multer = require("multer");
const path = require("path");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { DBconnection } = require("./connectDB");
const { UserDB } = require("./userDB");
const Blog = require('./model').Blog;
const { BlogDB } = require("./blogDB");
const authorizationMiddleware = require("./authorization-middleware");


const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

DBconnection.setupDB();

const userDB = new UserDB();
const blogDB = new BlogDB();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Not an image"), false);
        }
        cb(null, true);
    },
    limits: {fileSize: 5 * 1024 * 1024}
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Sign-up route
app.post('/api/auth/sign-up', async (req, res) => {
    const { username, password, latitude, longitude } = req.body;
    
    if (!username || !password || latitude == null || longitude == null) {
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
app.post('/api/post/newblog', authorizationMiddleware, upload.single("image"), async (req, res) => {
    try {
        const author = req.user.id;
        const {title, content, latitude, longitude, location} = req.body;
        console.log(req.body);
        if (!title || !content || author == null || latitude == null || longitude == null || !location) {
            return res.status(400).json({error: "title, content, latitude, longitude, and location are required fields"});
        }
        if (!req.file) {
            return res.status(400).json({error: "Image file required"});
        }
        const success = await blogDB.addBlog({title, content, latitude: parseFloat(latitude), longitude: parseFloat(longitude), location, author, image: `uploads/${req.file.filename}`});
        if (success) {
            return res.status(201).json({message: "Created successfully"});
        } else {
            return res.status(500).json({error: "Failed to create"});
        } 

        // const result = await blogDB.addBlog(req.body);
        // if (result) {
        //     res.status(201).json({message: "Blog post was created successfully!"});
        // } else {
        //     res.status(500).json({error: "Failed to create a blog post."});
        // } 
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
app.get('/api/get/all', authorizationMiddleware, async (req, res) => {
    try {
        const posts = await Blog.find({}).populate('author', 'username');

        if(!posts.length) {
            return res.status(404).jsons({error: 'No blog found.'});
        }
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json({error: 'Server error fetching blogs.'});
    }
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
    const phrases = phrase.split(" ");
    
    for (singlePhrase in phrases) {
        const searchResult = await blogDB.findBlog({ $or: [{ title: /phrases/i }]});
    }
    if (!result) {
        return res.status(401).json({ error: 'No blog found.'});
    }
    res.status(200).json(searchResult);
})

app.get('/api/blogs/:id', authorizationMiddleware, async(req, res) => {
    const post = await Blog.findById(req.params.id).populate('author', 'username');
    if (!post) {
        return res.sendStatus(404);
    }
    res.json(post);
});

//Update such blog post
app.put('/api/post/updateBlog', authorizationMiddleware, upload.single("image"), async (req, res) => {
    try {
        const author = req.user.id;
        const {blogId, title, content, latitude, longitude, location} = req.body;

        console.log(req.body);
        if (!title || !content || !blogId || latitude == null || longitude == null) {
            return res.status(400).json({error: "title, content, and location are required fields" });
        }

        const post = await Blog.findById(blogId).exec();
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }
        if (post.author.toString() !== author) {
            return res.status(403).json({error: "You can only edit your own posts"});
        }
        const updates = {
            title, content, location, latitude: parseFloat(latitude), longitude: parseFloat(longitude)
        };
        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }

        const updated = await Blog.findByIdAndUpdate(blogId, updates, {new: true}).exec();
        return res.json(updated);
        
        //const result = await blogDB.updateBlog({_id: blogId}, req.body);
        // if (result) {
        //     res.status(201).json({message: "Blog post was created successfully!" });
        // } else {
        //     res.status(500).json({ error: "Failed to update a blog post." });
        // } 
    } catch (err) {
        res.status(500).json({ error: "Server error creating a blog post" });
    }
})

//Delete said blog post
app.get('/api/delete/blog', async (req, res) => {
    try {
        const { _id, title, content, image, author, latitude, longitude, location} = req.body;

        const result = await blogDB.removeBlog(req.body, author);
        if (result == "Error") {
            return res.status(500).json({ error: 'Server error deleting a blog post.'}); //blogDB side error
        } else if (result == "NoBlog") {
            return res.status(404).json({ error: "Blog does not exist."})
        } else if (result == "NoPermission") {
            return res.status(401).json({ error: "You do not have permission to delete the blog." })
        }
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({error: "Server error deleting a blog post."}) 
        //Not sure if this is necessary because blogDB code cathes errors anyways
    }
})

app.get('/', (req, res) => res.send('API is running'));
app.listen(3001, () => console.log('Server is running on port 3001'));