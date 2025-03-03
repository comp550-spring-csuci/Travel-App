import React from 'react';
import AuthForm from '../components/auth-form';
import Navbar from '../components/navbar';
import { AppContext } from '../lib';

export default class AuthPage extends React.Component {
    render() {
        const { user, route, handleSignIn } = this.context;

        //redirect to home page if authenticated
        //if (user) return <Redirect to=" " />;

        return (
            <div>
                <Navbar />
                <AuthForm
                key={route.path}
                action={route.path}
                onSignIn={handleSignIn} />
            </div>
        )
    }
}

AuthPage.contextType = AppContext;