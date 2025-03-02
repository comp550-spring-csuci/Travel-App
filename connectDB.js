const {MongoClient} = require('mongodb');

class DBconnection { //Singleton class
    #_uri;
    #_connection;

    constructor() {
        if (!DBconnection.instance) {
            DBconnection.instance = this;
        }
        return DBconnection.instance;
    }

    #grabusername() {
        return "adminuser_610";
    }

    #grabpassword() {
        return "XS0wdkuPjUaeaG7H";
    }

    setupDB() {
        if (!this.#_connection) {
            try {
                //Attempt to connect to mongoDB
                const username = this.#grabusername();
                const password = this.#grabpassword();
                this.#_uri = "mongodb+srv://".concat(username, ":", password, "@travelapp-db.kr1x6.mongodb.net/?retryWrites=true&w=majority&appName=travelapp-db");
                this.#_connection = new MongoClient(this.#_uri);
                console.log("MongoDB successfully made.")
            } catch(error) {
                console.log("Connection failed.")
            }
        }
        return this.#_connection;
    }

    async openConnection(setupConnection) {
        return await setupConnection.connect();
    }

    async closeConnection(openConnection) {
        return await openConnection.close();
    }

    async checkConnection(connectionCheck) {
        const db = connectionCheck.db("travelapp");
        return await db.command({ping: 1});
    }
}

//Use this when making a class for blogDB
/**
async insertBlog(i_username, i_blogcontent, i_country, i_latitude, i_longitude) {
blog = this.createDataBase.collection("blog");
}
*/

module.exports = {DBconnection};