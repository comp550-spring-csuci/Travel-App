import React from "react";

export default class AuthForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            location: '',
            suggestions: [],
            incorrect: false,
            invalid: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.timer = null;
    }

    //handles input change in the form and sets the value
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });

        if (name === 'location') {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if(value.trim()) this.fetchSuggestions(value.trim());
                else this.setState({suggestions: []});
            }, 300);
        }
    }

    async fetchSuggestions(q) {
        try {
            const res = await fetch(`/api/geocoding?q=${encodeURIComponent(q)}&limit=5`);
            if (!res.ok) throw new Error(res.status);
            const data = await res.json();
            this.setState({suggestions: Array.isArray(data) ? data : []});
        } catch (err) {
            console.error(err);
            this.setState({suggestions: []});
        }
    }

    handleSelect(item) {
        const fullLocation = [item.name];
        if(item.state) fullLocation.push(item.state);
        if(item.country) fullLocation.push(item.country);
        const finalLocation = fullLocation.join(', ');
        this.setState({
            location: finalLocation,
            latitude: item.lat,
            longitude: item.lon,
            country: item.country,
            suggestions: []
        });
    } 

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({incorrect: false, invalid: false});
        const { action } = this.props;
        const { username, password, location } = this.state;
        const body = { username, password };
      
        if (action === 'sign-up') {
            const geoRes = await fetch(`/api/geocoding?q=${encodeURIComponent(location)}`);
          if (!geoRes.ok) {
            this.setState({ invalid: true });
            return;
          }
      
          const rawGeo = await geoRes.json();
          const geo = Array.isArray(rawGeo) ? rawGeo[0] : rawGeo;

          if (!geo || geo.lat == null || geo.lon == null) {
            this.setState({invalid: true});
            return;
          }

            const { lat, lon, country, name } = geo;
            body.latitude  = lat;
            body.longitude = lon;
            body.location  = name;
            body.country   = country;
        }
      
        const res = await fetch(`/api/auth/${action}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
        },
          body: JSON.stringify(body),
        });
      
        if (action === 'sign-up') {
          if (res.status === 201) {
            window.location.hash = '#sign-in';
          } else {
            this.setState({ incorrect: true });
          }
          return;
        }
      
        const result = await res.json();
        if (!res.ok || !result.user || !result.token) {
          this.setState({ incorrect: true });
        } else {
          this.props.onSignIn(result);
          window.location.hash = '';
        }
      };
      

    render() {
        const { action } = this.props;
        const {username, password, suggestions, location} = this.state;
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
                                <div className="mb-4 position-relative">
                                    <label htmlFor="location" className="form-label">Home City</label>
                                    <input
                                    required
                                    id="location"
                                    name="location"
                                    value={location}
                                    onChange={this.handleChange}
                                    className="form-control"
                                    placeholder="e.g. Los Angeles, CA, US"
                                    />
                                    {suggestions.length > 0 && (
                                        <ul className="list-group position-absolute w-100">
                                            {suggestions.map((suggestion, index) => (
                                              <li
                                                key={index}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => this.handleSelect(suggestion)}>
                                                    {suggestion.name}, {suggestion.state}, {suggestion.country}
                                                </li>  
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                        {this.state.incorrect === true &&
                            <div>
                                <p>Incorrect username or password. Please try again.</p>
                            </div>
                        }
                        {this.state.invalid === true &&
                            <div>
                                <p>Location is invalid. Please try again.</p>
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