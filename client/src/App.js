//This is a prebuilt example page from the template download. 
//It is currently what appears on the home page.
//Since we do not have page routing yet, feel free to use this page to help
//with viewing the page you are working on. 
import logo from './logo.svg';
import './App.css';

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header auth-background">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
  return (
    <div className="auth-background full-screen d-flex justify-content-center align-items-center">
        <div className='form-style container-fluid col-10 col-md-5 p-4'>
            <h1 className='text-center mb-3'>Register</h1>
            <form>
                <div className='mb-4'>
                  <label htmlFor="username" className='form-label'>Username</label>
                  <input
                  required
                  autoFocus
                  id='userName'
                  type="text"
                  name="userName"
                  className='form-control' />
                </div>
                <div className='mb-4'>
                  <label htmlFor='password' className='form-label'>Password</label>
                  <input 
                  required
                  id='password'
                  type='password'
                  name='password'
                  className='form-control'/>
                </div>
                <div className='d-flex justify-content-center mb-4'>
                <button type='submit' className='btn btn-custom col-12'>Create Account</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default App;
