import React from "react";

export default class AuthForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            latitude: '',
            longitude: '',
            incorrect: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //handles input change in the form and sets the value
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    //handles submitting the form, send a POST request
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
        //if signing in and bad response -> set to incorrect, if signing up -> redirect to sign in, if user and has token -> sign in
        // fetch(`/api/auth/${action}`, req)
        //     .then(res => res.json())
        //     .then(result => {
        //         if (action === 'sign-in' && !Response.ok) {
        //             this.setState({ incorrect: true });
        //         }
        //         if (action === 'sign-up') {
        //             window.location.hash = 'sign-in'
        //         } else if (result.user && result.token) {
        //             this.props.onSignIn(result);
        //         }
        //     });
        
        fetch(`/api/auth/${action}`, req)
            .then(async res => {
              const result = await res.json();
              if (action === 'sign-in' && !res.ok) {
                this.setState({ incorrect: true });
                return;
              }
              if (action === 'sign-up') {
                window.location.hash = 'sign-in';
              } else if (result.user && result.token) {
                this.props.onSignIn(result);
              }
            })
            .catch(err => {
              console.error("Auth error:", err);
              this.setState({ incorrect: true });
            });
    }

    render() {
        const { action } = this.props;
        const { handleChange, handleSubmit } = this;
        const welcomeMessage = action === 'sign-up'
            ? 'Register'
            : 'Login';
        const alternateActionHref = action === 'sign-up'
            ? '#sign-in'
            : '#sign-up';
        const alternateActionText = action === 'sign-up'
            ? 'Already have an account? Login.'
            : "Don't have an account? Sign Up.";
        const submitButtonText = action === 'sign-up'
            ? 'Create Account'
            : 'Login';
        return (
            <div className="auth-background full-screen d-flex justify-content-center align-items-center">
                <div className='form-style container-fluid col-10 col-md-5 p-4'>
                    <h1 className='text-center mb-3 form-font'>{welcomeMessage}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                        <label htmlFor="username" className='form-label'>Username</label>
                            <input
                            required
                            autoFocus
                            id='username'
                            type="text"
                            name="username"
                            onChange={handleChange}
                            className='form-control' />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input 
                            required
                            id='password'
                            type='password'
                            name='password'
                            onChange={handleChange}
                            className='form-control'/>
                        </div>
                        {action === 'sign-up' && (
                            <div>
                                <div className="mb-4">
                                <label htmlFor="latitude" className="form-label">Your Home Latitude</label>
                                <input 
                                required
                                id="latitude"
                                type="number"
                                step="any"
                                name="latitude"
                                value={this.state.latitude}
                                onChange={handleChange}
                                className="form-control"
                                />
                                </div>
                                <div className="mb-4">
                                <label htmlFor="longitude" className="form-label">Your Home Longitude</label>
                                <input
                                required
                                id="longitude"
                                type="number"
                                step="any"
                                name="longitude"
                                value={this.state.longitude}
                                onChange={handleChange}
                                className="form-control"
                                />
                                </div>
                            </div>
                        )}
                        {this.state.incorrect === true &&
                            <div>
                                <p>Incorrect username or password. Please try again.</p>
                            </div>
                        }
                        <div className='d-flex justify-content-center mb-4'>
                        <button type='submit' className='btn btn-custom col-12'>{submitButtonText}</button>
                        </div>
                        <div className="d-flex justify-content-center mb-2">
                            <a className='text-muted' href={alternateActionHref}>{alternateActionText}</a>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}