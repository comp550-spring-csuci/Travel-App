import React from "react";

export default class AuthForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: 'username',
            password: 'password1',
            incorrect: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { action } = this.props;
        const req = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        };
    }

    render() {
        return (
            <div className="auth-background full-screen d-flex justify-content-center align-items-center">
                <div className='form-style container-fluid col-10 col-md-5 p-4'>
                    <h1 className='text-center mb-3'>Register</h1>
                    <form>
                        <div className='mb-4'>
                        <label htmlFor="username" className='form-label'>Username</label>
                            <input
                            required
                            autoFocus
                            id='userName'
                            type="text"
                            name="userName"
                            className='form-control' />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input 
                            required
                            id='password'
                            type='password'
                            name='password'
                            className='form-control'/>
                        </div>
                        <div className='d-flex justify-content-center mb-4'>
                        <button type='submit' className='btn btn-custom col-12'>Create Account</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}