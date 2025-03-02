
const {DBconnection} = require("./connectDB.js")

class blogDB {
    #_blogs;
    #_travelapp;
    #_connection;

    constructor() {
        if (!blogDB.instance) {
            blogDB.instance = this;
            this.#_travelapp = new DBconnection;
            this.#_connection = this.#_travelapp.setupDB();
        }
        return blogDB.instance;
    }

    async connectToDB() {
        const conn = await this.#_travelapp.checkConnection(this.#_connection);
        if (conn.ok != 1) {
            console.log("Attempting to connect to server...");
            await this.#_travelapp.openConnection(this.#_connection);
            const createDataBase = this.#_connection.db("travelapp");
            this.#_blogs = createDataBase.collection("blog");
        }
        if (!this.#_blogs) {
            const createDataBase = this.#_connection.db("travelapp");
            this.#_blogs = createDataBase.collection("blog");
        }
    }

    async addBlog(blogContent) { 
        await this.connectToDB();
        await this.#_blogs.insertOne(blogContent);
        console.log('A document has been inserted in blogs with title: #{blogContent.title}');
        
    }

    async findBlog(condition) {
        const blog = await this.#_blogs.find({$contains:condition});
        return blog;
    }

    async updateBlog(updatedBlogContent) {
        await this.connectToDB();
        await this.#_blogs.update({"_id":updatedBlogContent._id}, updatedBlogContent);
        console.log('A document has been inserted in blogs with title: #{blogContent.title}');
    }

    async removeBlog(blogID, author) {
        await this.connectToDB();
        const blog = this.findBlog({"_id":blogID});
        if (blog != null) {
            if (blog.author == author | author == "admin") {
                await this.#_blogs.deleteOne(userToCheck);
                console.log("Successfully Removed Blog.")
            } else {
                console.log("You do not have permission to delete the blog.")
            }
        } else {
            return false;
        }
    }
    
    async closeConnection() {
        await this.#_travelapp.closeConnection(this.#_connection);
    }
}

module.exports = {blogDB};