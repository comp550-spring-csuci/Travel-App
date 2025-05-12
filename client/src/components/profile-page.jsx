import React from 'react';
import { AppContext } from '../lib';
import './profile-page.css'; // Ensure this path is correct

export default class ProfilePage extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            latitude: '',
            longitude: '',
            country: '',
            location: '',
            image: ''
        };
    }

    componentDidMount() {
        const { token } = this.context;
        fetch('https://wndr-serverside.onrender.com/api/profile', {
            headers: {
                'x-access-token': token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(res.status);
                return res.json();
            })
            .then(({ username, location, latitude, longitude, image }) => {
                this.setState({ username, location, latitude, longitude, image });
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        const { username, location, latitude, longitude, image } = this.state;

        return (
            <div className="profile-container">
                <div className="profile-card">
                    <img
                        src={`/${image}`}
                        alt="Your profile"
                        className="profile-pic"
                    />
                    <h2 className="profile-name">Welcome, {username}</h2>
                    <p className="profile-info">Location: {location}</p>
                    <p className="profile-info">Coordinates: {latitude}, {longitude}</p>
                    <button
                        className="btn-edit"
                        onClick={() => (window.location.hash = '#profile-edit')}
                    >
                        ✏️ Edit Profile
                    </button>
                </div>
            </div>
        );
    }
}
