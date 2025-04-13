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
            const {title, content, author, latitude, longitude, location} = blogContent;
            if (!title || !content || !author || !location) {
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
        return await Blog.find(condition).exec();
    }

    async updateBlog(oldBlogCondition, updatedBlogContent) {
        try {
            const result = await Blog.findOneAndUpdate(oldBlogCondition, updatedBlogContent, {new: true}).exec();
            if (result) {
                console.log(`Blog updated successfully: ${result.title}`);
            } else {
                console.log("No matching blog found.");
            }
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    }

    async removeBlog(blogRemoveCondition, author) {
        try {
            const blog = await Blog.findOne(blogRemoveCondition).exec();
            if (!blog) {
                console.log("Blog not found.");
                return false;
            }
            if (blog.author === author || author === "admin") {
                await Blog.deleteOne(blogRemoveCondition);
                console.log("Successfully removed blog.");
            } else {
                console.log("You do not have permission to delete the blog.");
            }
        } catch (error) {
            console.error("Error removing blog:", error);
        }
    }
}

//Dummy data testing
async function main() {
    const testBlog = new BlogDB();
    // Corrected field name from 'contenet' to 'content'
    // Also added dummy latitude and longitude values if those fields are required.
    const dummyBlog = {
      title: "Test Blog Post",
      content: "This is a test blog post for testing purposes.",
      image: "http://example.com/dummyimage.jpg",
      author: "64d1234567890abcdef12345", // Use a valid dummy ObjectId string
      location: "Test City",
      latitude: 40.7128,   // Example dummy latitude (New York City)
      longitude: -74.0060  // Example dummy longitude (New York City)
    };
    // Use 'testBlog' (the instance of BlogDB) rather than blog.DB
    const result = await testBlog.addBlog(dummyBlog);
    console.log("Dummy blog inserted:", result);
  }
  
  main();

module.exports = {BlogDB};
