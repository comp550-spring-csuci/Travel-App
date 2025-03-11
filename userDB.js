
const {DBconnection} = require("./connectDB.js")

class userDB {
    #_users;
    #_travelapp;
    #_connection;

    constructor() {
        if (!userDB.instance) {
            userDB.instance = this;
            this.#_travelapp = new DBconnection;
            this.#_connection = this.#_travelapp.setupDB();
        }
        return userDB.instance;
    }

    async connectToDB() {
        const conn = await this.#_travelapp.checkConnection(this.#_connection);
        if (conn.ok != 1) {
            console.log("Attempting to connect to server...");
            await this.#_travelapp.openConnection(this.#_connection);
            const createDataBase = this.#_connection.db("travelapp");
            this.#_users = createDataBase.collection("users");
        }
        if (!this.#_users) {
            const createDataBase = this.#_connection.db("travelapp");
            this.#_users = createDataBase.collection("users");
        }
    }

    async signUpUser(userInfo) { 
        await this.connectToDB();
        //Check if a username of the same value exist, and if so return an failed attempt.
        const user_exist = await this.#_users.find(userInfo.username);
        if (user_exist != null) {
            console.log("Username already exist, please choose another username.");
            return false;
        } else {
            await this.#_users.insertOne(userInfo);
            console.log('A document has been inserted with id: ${userInfo.username}');
            return true;
        }
    }

    async checkValidUser(userInfo) {
        await this.connectToDB();
        //Find if user exist or not
        const user_check = await this.#_users.find(userInfo.username);
        if (user_check != null) {
            return true;
        }
        return false;
    }

    async updateUsername(userInfo, updateUserInfo) {
        await this.connectToDB();
        const validUser = await this.checkValidUser(userInfo);
        if (validUser) {
            //If 
            this.#_users.updateOne(userInfo, updateUserInfo);
            return true;
        } else {
            console.log("Update failed, no valid user detected");
        }
        return false;
    }

    async removeUser(userInfo) {
        await this.connectToDB();
        const user_check = await this.checkValidUser(userInfo);
        if (user_check) {
            await this.#_users.deleteOne(userInfo);
            console.log("Successfully removed user.")
            return true;
        } else {
            console.log("User does not exist,");
            return false;
        }
    }
    
    async closeConnection() {
        await this.#_travelapp.closeConnection(this.#_connection);
        return true;
    }
}

async function main() {
    testUser = new userDB;
    const adduser = await testUser.signUpUser({username: "tetsutok", password: "lostaaa"});
    const result = await testUser.checkValidUser({username: "tetsutok", password: "lostaaa"});
    console.log(result);
    const removed = await testUser.removeUser({username: "tetsutok", password: "lostaaa"});
    console.log(removed);
    testUser.closeConnection();
    
}

main();