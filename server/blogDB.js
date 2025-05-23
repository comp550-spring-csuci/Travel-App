const {DBconnection} = require("./connectDB.js");
const {User, Blog} = require("./model.js"); 

class BlogDB {
    static #instance;

    constructor() {
        if (!BlogDB.#instance) {
            BlogDB.#instance = this;
            DBconnection.setupDB();
        }
        return BlogDB.#instance;
    }

    async addBlog(blogContent) { 
        try {
            const {title, content, image, author, latitude, longitude} = blogContent;
            if (!title || !content || !author || !latitude || !longitude) {
                console.error("Missing required field for a blog post.");
                return false;
            } else if (!latitude || !longitude) {
                console.error("Please fill out the location of the blog post.");
                return false;
            }
            const blog = new Blog(blogContent);
            await blog.save();
            console.log(`A document has been inserted in blogs with title: ${blogContent.title}`);
            return true;
        } catch (error) {
            console.error("Error inserting blog:", error);
            return false;
        }
    }

    async findBlog(condition) {
        return await Blog.find(condition).sort({createdAt: -1}).exec();
    }

    async searchBlog(searchString) {
        // Check if the search string is empty
        // Instead of searching for direct relevancy within field, search for fuzzy search match, then
        // add up the scores of the search results.
        const hits = await Blog.aggregate([
            { $search: {
                index: "dynamic",
                compound: {
                  should: [ 
                    { text: { path: "title", query: searchString, fuzzy:{ maxEdits: 2 }, score: { boost: { value: 3 }} }},
                    { text: { path: "content", query: searchString, fuzzy: { maxEdits: 2 }, score: { boost: { value: 2 }} }},
                    { text: { path: "location", query: searchString, fuzzy: { maxEdits: 2 }, score: { boost: { value: 4 }} }}],
                  minimumShouldMatch: 0
                }
              }
            },
            { $addFields: { score: { $meta: "searchScore" } } },
            { $sort: { score: -1 } }
        ]).exec();
         
        return await Blog.populate(hits, {path: "author", select: "username image"});
        // return await Blog.find({ $text: { $search: searchString }}, { score: { $meta: "textScore"}}
        //     ).sort({ score: { $meta: "textScore" }}).exec();
    }

    async updateBlog(oldBlogCondition, updatedBlogContent, author) {
        try {
            // First of all check if the blog even exists right now
            const blog = await Blog.findOne(oldBlogCondition).exec();
            if (!blog) {
                console.log("Blog not found.");
                return "NoBlog";
            }
            //Check if blog author matches with the logged in user name (or an admin)
            if (updatedBlogContent.author === author || author === "admin") {
                const result = await Blog.findOneAndUpdate(oldBlogCondition, updatedBlogContent, {new: true}).exec();
                if (result) {
                    console.log(`Blog updated successfully: ${result.title}`);
                } else {
                    console.log("No matching blog found.");
                    return "NoMatch";
                }
            } else {
                console.log("You do not have permission to delete the blog.");
                return "NoPermission";
            }
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    }

    async removeBlog(blogRemoveCondition, author) {
        try {
            // First of all check if the blog even exists right now
            const blog = await Blog.findOne(blogRemoveCondition).exec();
            if (!blog) {
                console.log("Blog not found.");
                return "NoBlog";
            }
            // Check if user trying to delete blog matches author
            // ... or is an admin (also for the same reason do not allow the user named admin)
            if (blog.author.toString() === author || author === "admin") {
                await Blog.deleteOne(blogRemoveCondition);
                console.log("Successfully removed blog.");
                return "Success";
            } else {
                console.log("You do not have permission to delete the blog.");
                return "NoPermission";
            }
        } catch (error) {
            console.error("Error removing blog:", error);
            return "Error";
        }
    }
}

//Dummy data testing
/*
async function main() {
    const testBlog = new BlogDB();
    // Corrected field name from 'contenet' to 'content'
    // Also added dummy latitude and longitude values if those fields are required.
    const dummyBlog = {
        title: "Test Blog Post",
        content: "This is a test blog post for testing purposes.",
        image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.rssc.com%2Fships&psig=AOvVaw3Js34jRATkA64187FkGQ-7&ust=1744659190812000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLiPo5bg1YwDFQAAAAAdAAAAABAE",
        author: "64d1234567890abcdef12345", // Use a valid dummy ObjectId string
        location: "Test City",
        latitude: 40.7128,   // Example dummy latitude (New York City)
        longitude: -74.0060  // Example dummy longitude (New York City)
    };
    // Use 'testBlog' (the instance of BlogDB) rather than blog.DB
    const result = await testBlog.addBlog(dummyBlog);
    console.log("Dummy blog inserted:", result);

    // Dummy blog post 2
    const dummyBlog2 = {
        title: "Test Blog Post 2",
        content: "This is the second test blog post for testing purposes.",
        image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.rssc.com%2Fships&psig=AOvVaw3Js34jRATkA64187FkGQ-7&ust=1744659190812000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLiPo5bg1YwDFQAAAAAdAAAAABAE",
        author: "64d1234567890abcdef12345", // Use the same or a different valid dummy ObjectId string
        location: "Test City",
        latitude: 40.7128,   // Same or different coordinates if desired
        longitude: -74.0060
    };

    const result2 = await testBlog.addBlog(dummyBlog2);
    console.log("Dummy blog 2 inserted:", result2);
  }
  
  main();*/

module.exports = {BlogDB};
