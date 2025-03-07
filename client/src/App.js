//import logo from './logo.svg';
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import AuthForm from './components/auth-form';
import AuthPage from './pages/auth';
import Navbar from './components/navbar';
import NotFound from './components/not-found';
import { parseRoute, AppContext } from './lib';

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
    if (path === '%20') {
      //return <Home />;
      return <AuthForm />;
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
        {this.renderPage()}
      </AppContext.Provider>
      // <div>
      //   <Navbar />
      //   <AuthForm />
      // </div>
    )
  }
}

// function App() {
//   // return (
//   //   <div className="App">
//   //     <header className="App-header auth-background">
//   //       <img src={logo} className="App-logo" alt="logo" />
//   //       <p>
//   //         Edit <code>src/App.js</code> and save to reload.
//   //       </p>
//   //       <a
//   //         className="App-link"
//   //         href="https://reactjs.org"
//   //         target="_blank"
//   //         rel="noopener noreferrer"
//   //       >
//   //         Learn React
//   //       </a>
//   //     </header>
//   //   </div>
//   // );
  
App.contextType = AppContext;