const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    latitude:  { type: Number, max: 90, min: -90, required: true },
    longitude: { type: Number, max: 180, min: -180, required: true },
    location:   { type: String, required: true },
    image: { type: String, default: "uploads/default-profile-image.jpg"}
});

const User = mongoose.model("User", userSchema);

const blogSchema = new mongoose.Schema({
    title:      { type: String, required: true },
    content:    { type: String, required: true },
    image:      { type: String },
    author:     { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    latitude:   { type: Number, max: 90, min: -90 },
    longitude:  { type: Number, max: 180, min: -180 },
    location:   { type: String },
    country:    { type: String },
    createdAt:  { type: Date, default: Date.now },
    updatedAt:  { type: Date, default: Date.now }
});

// blogSchema.index({ title: 'text', content:'text', location: 'text' });

// Middleware to update `updatedAt` field before saving
blogSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = {User, Blog};