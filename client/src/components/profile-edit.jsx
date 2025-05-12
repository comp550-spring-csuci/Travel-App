import React from 'react';
import { AppContext } from '../lib';

export default class ProfileEdit extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            latitude: '',
            longitude: '',
            country: '',
            location: '',
            image: '',
            suggestions: [],
            invalid: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.timer = null;
    }

    async componentDidMount() {
        const {token} = this.context;
        try {
            const res = await fetch('https://wndr-serverside.onrender.com/api/profile', {
                headers: {
                    'x-access-token': token
                }
            });
            if (!res.ok) throw new Error(res.status);
            const profile = await res.json();

            this.setState({
                location: profile.location,
                latitude: profile.latitude,
                longitude: profile.longitude,
                country: profile.country,
                image: profile.image
            });
        } catch (err) {
            this.setState({error: true});
        }
    }

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
            const res = await fetch(`https://wndr-serverside.onrender.com/api/geocoding?q=${encodeURIComponent(q)}&limit=5`);
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

    handleFileChange({target: {files}}) {
        this.setState({file: files[0]});
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({invalid: false});
        const {file, location, latitude, longitude, country} = this.state;
        const {token} = this.context;

        const geoRes = await fetch(`https://wndr-serverside.onrender.com/api/geocoding?q=${encodeURIComponent(location)}`);
        if (!geoRes.ok) {
            this.setState({invalid: true});
            return;
        }

        const rawGeo = await geoRes.json();
        const geo = Array.isArray(rawGeo) ? rawGeo[0] : rawGeo;

        if (!geo || geo.lat == null || geo.lon == null) {
            this.setState({invalid: true});
            return;
        }

        const form = new FormData();
        form.append("location", location);
        form.append("latitude", latitude);
        form.append("longitude", longitude);
        form.append("country", country)
        if (file) form.append("image", file);

        const res = await fetch('https://wndr-serverside.onrender.com/api/profile/edit', {
            method: 'PATCH',
            headers: {
                'x-access-token': token
            },
            body: form,
        })

        if (!res.ok) {
            throw new Error(res.status);
            return;
        }

        window.location.hash = '#profile';
        };

    render() {
        const {user} = this.context;
        const {location, latitude, longitude, image, suggestions} = this.state;

        return (
            <div className="container p-5">
                <div className='d-flex justify-content-center mt-5' style={{width: 100, height: 100, borderRadius: "50%", overflow: "hidden", margin: "0 auto"}}>
                    <img src={`/${image}`} alt='your profile picture' style={{width: "100%", height: "100%", objectFit: "cover"}} />
                </div>
                <h2 className='mt-2'>Edit Profile</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className='mb-4'>
                        <label>Home Location</label>
                        <input
                        name='location'
                        value={location}
                        onChange={this.handleChange}
                        className='form-control'
                        required
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
                    <div className='mb-4'>
                        <label htmlFor='image' className='form-label'>Upload Image</label>
                        <input 
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={this.handleFileChange}
                        className="form-control"
                        />
                    </div>
                    {this.state.invalid === true &&
                        <div>
                            <p>Location is invalid. Please try again.</p>
                        </div>
                    }
                    <div className='d-flex justify-content-center mb-4'>
                        <button type='submit' className='btn btn-custom col-12'>Submit</button>
                    </div>
                </form>
            </div>
        );
    }
}