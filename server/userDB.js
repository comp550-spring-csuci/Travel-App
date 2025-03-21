const {DBconnection} = require("./connectDB.js");
const {User, Blog} = require("./model.js");
const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
require('dotenv').config(); //for testing
const SECRET_KEY = process.env.JWT_SECRET;

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

            //Hash password
            const hashedPassword = await argon2.hash(userInfo.password);
            const newUser = new User({
                username: userInfo.username,
                password: hashedPassword
            });

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

    async loginUser(userInfo) {
        try {
            //check user
            const user = await User.findOne({ username: userInfo.username });
            if (!user) {
                console.log("User does not exist");
                return null;
            }
            //Check password
            const validPassword = await argon2.verify(user.password, userInfo.password);
            if (!validPassword) {
                console.log("Incorrect password.");
                return null;
            }
            //Generate JWT
            const token = jwt.sign(
                { id: user._id, username: user.username },
                SECRET_KEY,
                { expiresIn: '7d' }
            );

            return {
                user: {
                    id: user._id.toString(),
                    username: user.username
                },
                token
            };
        } catch (error) {
            console.error("Error logging in user:", error);
            return null;
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

//Test signUpUser and loginUser
async function main() {
    const testUser2 = new UserDB;
    const adduser2 = await testUser2.signUpUser({username: "test", password: "pass"});
    console.log("User added:", adduser2);
    const loginResult = await testUser2.loginUser({username: "test", password: "pass"});
    console.log("Login result:", loginResult);
}
main();

module.exports = {UserDB};