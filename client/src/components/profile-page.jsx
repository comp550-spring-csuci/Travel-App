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
            zip: ''
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
            .then(({username, zip}) => {
                this.setState({username, zip});
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        const {username, zip} = this.state;
        return (
            <div className="container p-5">
                <h2>Welcome, {username}</h2>
                <p>Your home ZIP code is {zip}</p>
                <button onClick={() => window.location.hash = '#profile/edit'}>Edit Home Location</button>
            </div>
        )
    }
}