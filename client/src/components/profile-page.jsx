import React from 'react';
import { AppContext } from '../lib';

export default class ProfilePage extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            latitude: '',
            longitude: '',
            country: '',
            location: ''
        };
    }

    componentDidMount() {
        const {token} = this.context;
        fetch('/api/profile', {
            headers: {
                'x-access-token': token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(res.status);
                return res.json();
            })
            .then(({username, location, latitude, longitude}) => {
                this.setState({username, location, latitude, longitude});
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        const {username, location, latitude, longitude} = this.state;
        return (
            <div className="container p-5">
                <h2 className='mt-5'>Welcome, {username}</h2>
                <p>Home Location: {location}</p>
                <p>Coordinates: {latitude}, {longitude}</p>
                {/* <button onClick={() => window.location.hash = '#profile/edit'}>Edit Home Location</button> */}
            </div>
        )
    }
}