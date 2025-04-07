import React from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import AuthPage from './pages/auth';
import Navbar from './components/Navbar2';
import LandingPage from './pages/Landingpage';
import NotFound from './components/not-found';
import { parseRoute, AppContext } from './lib';
import About from './pages/about';
import Newsletter from './pages/newsletter';
import Footer from './pages/footer';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
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
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('jwt');
    this.setState({ user: null });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === '') {
      //return <Home />;
      return <LandingPage />;
    }
    if (path === 'sign-in' || path === 'sign-up') {
      return <AuthPage />;
    }
    return <NotFound />
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };  
    return (
      <AppContext.Provider value={contextValue}>
        <Navbar />
        {this.renderPage()}
        <About />
        <Newsletter />
        <Footer />
      </AppContext.Provider>
    )
  }

}
  
App.contextType = AppContext;