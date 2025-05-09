import React from "react";

export default class AuthForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            latitude: '',
            longitude: '',
            zip: '',
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
    // handleSubmit(event) {
    //     event.preventDefault();
    //     const { action } = this.props;
    //     const req = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(this.state)
    //     };
        
    //     fetch(`/api/auth/${action}`, req)
    //         .then(async res => {
    //           const result = await res.json();
    //           if (action === 'sign-in' && !res.ok) {
    //             this.setState({ incorrect: true });
    //             return;
    //           }
    //           if (action === 'sign-up') {
    //             window.location.hash = 'sign-in';
    //           } else if (result.user && result.token) {
    //             this.props.onSignIn(result);
    //           }
    //         })
    //         .catch(err => {
    //           console.error("Auth error:", err);
    //           this.setState({ incorrect: true });
    //         });
    // }

    handleSubmit = (e) => {
        e.preventDefault();
        const { action } = this.props;
        const { username, password, zip } = this.state;
        const body = { username, password };
    
        const doAuth = () => {
          fetch(`/api/auth/${action}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(body),
          })
            .then(async (res) => {
              const text = await res.text();
              if (action === "sign-up" && res.status === 201) {
                return window.location.hash = "#sign-in";
              }
              let data = {};
              if (text) {
                try { data = JSON.parse(text); } 
                catch {}
              }
              return { status: res.status, data };
            })
            .then((info) => {
              if (!info) return;
              const { status, data } = info;
              if (action === "sign-in") {
                if (status !== 200 || !data.user || !data.token) {
                  return this.setState({ incorrect: true });
                }
                this.props.onSignIn(data);
                window.location.hash = '';
              }
            })
            .catch((err) => {
              console.error("Auth error:", err);
              this.setState({ incorrect: true });
            });
        };
    
        if (action === "sign-up") {
          fetch(`/api/geocoding/zip?zip=${encodeURIComponent(zip)}`)
            .then(async (res) => {
              const text = await res.text();
              if (!res.ok) {
                const err = text ? JSON.parse(text) : {};
                throw new Error(err.error || res.status);
              }
              return text ? JSON.parse(text) : {};
            })
            .then(({ lat, lon }) => {
              if (lat == null || lon == null) {
                throw new Error("Could not find coordinates for that ZIP");
              }
              body.latitude = lat;
              body.longitude = lon;
            })
            .then(doAuth)
            .catch((err) => {
              console.error("Signup lookup error:", err);
              this.setState({ incorrect: true });
            });
        } else {
          doAuth();
        }
      };

    render() {
        const { action } = this.props;
        const {zip} = this.state;
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
                                    <label htmlFor="zip" className="form-label">Home Zip Code</label>
                                    <input
                                    required
                                    id="zip"
                                    name="zip"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d{5}"
                                    value={zip}
                                    onChange={this.handleChange}
                                    className="form-control"
                                    />
                                </div>
                                {/* <div className="mb-4">
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
                                </div> */}
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