import React from 'react';
import {jwtDecode} from 'jwt-decode';
import './App.css';
import AuthPage from './pages/auth';
import AddBlog from './components/blog-form';
import EditBlog from './components/edit-blog';
import Navbar from './components/Navbar2';
import NavbarSI from './components/navbar';
import LandingPage from './pages/Landingpage';
import NotFound from './components/not-found';
import BlogFeed from './components/blog-feed';
import BlogFeedAll from './components/blog-feed-all';
import { parseRoute, AppContext } from './lib';
import About from './pages/about';
import Newsletter from './pages/newsletter';
import Footer from './pages/footer';
import TheGlobePage from './pages/the-globe';
import TheGlobe from './components/the-globe';
import SingleBlog from './components/single-blog';
import ProfilePage from './components/profile-page';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      token: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('jwt');
    let user = null;
    if (token) {
      try {
        user = jwtDecode(token);
      } catch (e) {
        // invalid token in storage
        window.localStorage.removeItem('jwt');
      }
    }
    //const user = token ? jwtDecode(token) : null;
    this.setState({ user, token, isAuthorizing: false });
  }
  

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('jwt', token);
    this.setState({ user, token });
  }

  handleSignOut() {
    window.localStorage.removeItem('jwt');
    this.setState({ user: null, token: null }, () => {
      window.location.hash = '#sign-in';
    });
  }

  renderPage() {
    const { path, params } = this.state.route;
    const blogId = params.get('id');
    if (path === '') {
      //return <Home />;
      return <LandingPage />;
      //return <AuthPage />;
    }
    if (path === 'the-globe') {
      return <TheGlobePage />;
    }
    if (path === 'sign-in' || path === 'sign-up') {
      return <AuthPage />;
    }
    if (path === 'blog-feed-all') {
      return <BlogFeedAll />;
    }
    if (path === 'blog-feed') {
      return <BlogFeed />;
    }
    if (path === 'add-blog') {
      return <AddBlog />;
    }
    if (path === 'edit-blog') {
      const blogId = params.get('id');
      return <AddBlog blogId={blogId} />;
    }
    if (path === 'blog' && blogId) {
      return <SingleBlog blogId={blogId} />;
    }
    if (path === 'profile') {
      return <ProfilePage />;
    }
    //this needs to be fixed, it is curently displayed by default under the navbar    
    return <NotFound />;
  }


  render() {
    if (this.state.isAuthorizing) return null;
    const { user, token, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, token, route, handleSignIn, handleSignOut };  
    return (
      <AppContext.Provider value={contextValue}>
        <Navbar />
        {this.renderPage()}
        <Footer />
      </AppContext.Provider>
    )
  }

}

App.contextType = AppContext;