import React from "react";

export default class AuthForm extends React.Component {
    render() {
        return (
            <div className="auth-background">
                <div>
                    <h1>Register</h1>
                    <form>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input
                            required
                            autoFocus
                            id='userName'
                            type="text"
                            name="userName" />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}