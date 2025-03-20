const {DBconnection} = require("./connectDB.js");
const {User, Blog} = require("./model.js");

class UserDB {
    static #instance;

    constructor() {
        if (!UserDB.#instance) {
            UserDB.#instance = this;
            DBconnection.setupDB(); // Ensures DB is set up
        }
        return UserDB.#instance;
    }

    async signUpUser(userInfo) {
        try {
            const user_exist = await User.findOne({username: userInfo.username});

            if (user_exist) {
                console.log("Username already exists, please choose another username.");
                return false;
            }

            const newUser = new User(userInfo);
            await newUser.save();
            console.log(`A document has been inserted with username: ${userInfo.username}`);
            return true;
        } catch (error) {
            console.error("Error signing up user:", error);
            return false;
        }
    }

    async checkValidUser(userInfo) {
        try {
            const user_check = await User.findOne({username: userInfo.username});
            return user_check !== null;
        } catch (error) {
            console.error("Error checking user validity:", error);
            return false;
        }
    }

    async updateUsername(userInfo, updateUserInfo) {
        try {
            const validUser = await this.checkValidUser(userInfo);
            if (validUser) {
                await User.updateOne({username: userInfo.username}, {$set: updateUserInfo});
                return true;
            } else {
                console.log("Update failed, no valid user detected");
                return false;
            }
        } catch (error) {
            console.error("Error updating username:", error);
            return false;
        }
    }

    async removeUser(userInfo) {
        try {
            const user_check = await this.checkValidUser(userInfo);
            if (user_check) {
                await User.deleteOne({ username: userInfo.username });
                console.log("Successfully removed user.");
                return true;
            } else {
                console.log("User does not exist.");
                return false;
            }
        } catch (error) {
            console.error("Error removing user:", error);
            return false;
        }
    }
}

/*
async function main() {
    testUser = new UserDB;
    const adduser = await testUser.signUpUser({username: "tetsutok", password: "lostaaa"});
    const result = await testUser.checkValidUser({username: "tetsutok", password: "lostaaa"});
    console.log(result);
    const updateResult = await testUser.updateUsername({username: "tetsutok"}, {password: "losta"});
    console.log(updateResult);
    const removed = await testUser.removeUser({username: "tetsutok", password: "lostaaa"});
    console.log(removed);
}
main();
*/

module.exports = {userDB};