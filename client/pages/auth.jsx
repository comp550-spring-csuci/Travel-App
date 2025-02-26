import React from 'react';
import AuthForm from '../components/auth-form';

export default class Authpage extends React.Component {
    render() {
        return (
            <div>
                <AuthForm/>
            </div>
        )
    }
}

AuthPage.contextType = AppContext;