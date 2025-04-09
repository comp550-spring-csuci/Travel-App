import React from 'react';
import Redirect from '../components/redirect';
import BlogForm from '../components/blog-form';

import { AppContext } from '../lib';

export default class BlogPage extends React.Component {
    render() {
        const { user, route, handleSignIn } = this.context;

        //redirect to home page if authenticated
        //if (user) return <Redirect to="" />;

        return (
            <div>
                <Navbar action={route.path}/>
                <BlogForm
                key={route.path}
                action={route.path}
                onSignIn={handleSignIn} />
            </div>
        )
    }
}

BlogPage.contextType = AppContext;