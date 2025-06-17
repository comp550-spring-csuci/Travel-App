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
                const {
                    MONGO_USERNAME,
                    MONGO_PASSWORD,
                    MONGO_CLUSTER,
                    MONGO_APPNAME
                  } = process.env;

                const uri = `mongodb+srv://${encodeURIComponent(MONGO_USERNAME)}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=${MONGO_APPNAME}`;

                await mongoose.connect(uri);
                
                console.log("Connection succesfully made.")
            } catch (error) {
                console.error("Connection failed:", error)
            }
            
        }
        return mongoose.connection;
    }
}

module.exports = {DBconnection};