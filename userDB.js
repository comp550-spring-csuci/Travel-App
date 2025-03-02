
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

    async signUpUser(i_username, i_password) { 
        await this.connectToDB();
        //Check if a username of the same value exist, and if so return an error.
        let userToInsert = {username: i_username};
        const user_exist = await this.#_users.findOne(userToInsert);
        if (user_exist != null) {
            console.log("Username already exist, please choose another username.");
        } else {
            userToInsert = {
                username: i_username,
                password: i_password
            }
            await this.#_users.insertOne(userToInsert);
            console.log('A document has been inserted with id: ${i_username}');
        }
        
    }

    async findExistingUser(i_username, i_password) {
        const userToCheck = {
            username: i_username,
            password: i_password
        };
        const user_check = await this.#_users.findOne(userToCheck);
        return user_check;
    }

    async checkValidUser(i_username, i_password) {
        console.log("Opening connection...");
        await this.connectToDB();
        const user_check = this.findExistingUser(i_username, i_password);
        if (user_check != null) {
            return true;
        } else {
            return false;
        }
    }

    async removeUser(i_username, i_password) {
        await this.connectToDB();
        const user_check = this.findExistingUser(i_username, i_password);
        if (user_check != null) {
            const userToCheck = {
                username: i_username,
                password: i_password
            }
            await this.#_users.deleteOne(userToCheck);
            console.log("Successfully Removed User.")
        } else {
            return false;
        }
    }
    
    async closeConnection() {
        await this.#_travelapp.closeConnection(this.#_connection);
    }
}

async function main() {
    testUser = new userDB;
    const adduser = await testUser.signUpUser("tetsutok", "lostaaa");
    const result = await testUser.checkValidUser("tetsutok", "lostaaa");
    console.log(result);
    await testUser.removeUser("tetsutok", "lostaaa");
    testUser.closeConnection();
}

main();