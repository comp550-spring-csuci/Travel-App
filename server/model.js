const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

const User = mongoose.model("User", userSchema);

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: {type: String},
    author: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    location: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

// Middleware to update `updatedAt` field before saving
blogSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = {User, Blog};