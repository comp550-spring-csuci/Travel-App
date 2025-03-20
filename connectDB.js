//const {MongoClient} = require('mongodb');
const mongoose = require("mongoose");

class DBconnection { //Singleton class
    #_uri;
    //#_connection;
    static #instance;

    constructor() {
        if (DBconnection.#instance) {
            throw new error("Use DBconnection.getInstance() to get an instance.")
        }
        return DBconnection.#instance;
    }

    static getInstance() {
        if (!DBconnection.#instance) {
            DBconnection.#instance = new DBconnection();
        }
        return DBconnection.#instance;
    }

    static async setupDB() {
        if (!mongoose.connection.readyState) {
            try {
                // Attempt to connect to MongoDB using Mongoose
                const username = 'adminuser_610';
                const password = 'XS0wdkuPjUaeaG7H';
                const uri = `mongodb+srv://${username}:${password}@travelapp-db.kr1x6.mongodb.net/?retryWrites=true&w=majority&appName=travelapp-db`;

                await mongoose.connect(uri);
                //const db = mongoose.connection;
                /*
                db.on('error', console.error.bind(console, 'MongoDB connection error:'));
                db.once('open', function() {
                    console.log('MongoDB successfully connected with Mongoose.')
                })*/
                console.log("Connection succesfully made.")
            } catch (error) {
                console.error("Connection failed:", error)
            }
            
        }
        return mongoose.connection;
    }
}

//Use this when making a class for blogDB
/**
async insertBlog(i_username, i_blogcontent, i_country, i_latitude, i_longitude) {
blog = this.createDataBase.collection("blog");
}

async function main() {
    testConn = await DBconnection.setupDB();
    await mongoose.disconnect();
}
main();
*/

module.exports = {DBconnection};