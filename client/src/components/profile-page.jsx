import React from 'react';
import { AppContext } from '../lib';

export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: '',
            longitude: '',
            country: '',
            geocodingRes: '',
            editing: false
        };
    }

    componentDidMount() {
        const {token} = this.context;

    }
}