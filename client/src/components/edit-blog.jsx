import React from "react";
import Navbar from '../components/navbar';

export default class EditBlog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blogTitle: '',
            blogBody: '',
            invalid: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //handles input change in the form and sets the value
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    //handles submitting the form, send a POST request
    handleSubmit(event) {
        event.preventDefault();
        const { action } = this.props;
        const req = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        };
        this.setState({ invalid: true });
        return;
        //if signing in and bad response -> set to incorrect, if signing up -> redirect to sign in, if user and has token -> sign in
        // fetch(`/api/auth/${action}`, req)
        //     .then(res => res.json())
        //     .then(result => {
        //         if (action === 'add-blog' && !Response.ok) {
        //             this.setState({ incorrect: true });
        //         }
        //         if (action === 'edit-blog') {
        //             window.location.hash = 'add-blog'
        //         } else if (result.user && result.token) {
        //             this.props.onSignIn(result);
        //         }
        //     });
        
        fetch(`/api/auth/${action}`, req)
            .then(async res => {
              const result = await res.json();
              if (action === 'add-blog' && !res.ok) {
                this.setState({ incorrect: true });
                return;
              }
              if (action === 'edit-blog') {
                window.location.hash = 'add-blog';
              } else if (result.user && result.token) {
                this.props.onSignIn(result);
              }
            })
            .catch(err => {
              console.error("Auth error:", err);
              this.setState({ incorrect: true });
            });
    }

    render() {
        const {route} = this.context;
        const { action } = this.props;
        const { handleChange, handleSubmit } = this;
        const welcomeMessage = 'Edit This Blog';
        return (
            <div className="blog-background full-screen d-flex justify-content-center align-items-center">
                <div className='form-style container-fluid col-10 col-md-5 p-4'>
                    <Navbar />
                    <h1 className='text-center mb-3 form-font'>{welcomeMessage}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                        <label htmlFor="blogTitle" className='form-label'>Title</label>
                            <input
                            required
                            autoFocus
                            id='blogTitle'
                            type="text"
                            name="blogTitle"
                            onChange={handleChange}
                            className='form-control' />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='blogBody' className='form-label'>Blog Content</label>
                            <input 
                            required
                            id='blogBody'
                            type='text'
                            name='blogBody'
                            onChange={handleChange}
                            className='form-control'/>
                        </div>
                        {this.state.incorrect === true &&
                            <div>
                                <p>Blog is invalid. Please try again.</p>
                            </div>
                        }
                        <div className='d-flex justify-content-center mb-4'>
                        <button type='submit' className='btn btn-custom col-12'>{'Finish'}</button>
                        <button type='submit' className='btn btn-custom col-12'>{'Delete'}</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}