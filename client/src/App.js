//import logo from './logo.svg';
import './App.css';
import AuthForm from './components/auth-form';
import AuthPage from './pages/auth';
import Navbar from './components/Navbar2';
import LandingPage from './pages/Landingpage';

import { AppContext } from './lib';



function App() {
  return (
    <div className='App'>
      <Navbar />
      <LandingPage />
    </div>
  )
}

export default App;
