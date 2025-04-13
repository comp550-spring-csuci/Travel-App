import React from "react";
import Navbar from '../components/navbar';

export default class AddBlog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            image: '',
            author: 'user',
            latitude: '',
            longitude: '',
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
        const req = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        };
        this.setState({ invalid: true });
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
        
        fetch(`/api/post/newblog`, req) // change it so that it fetches to the backend server
        //api/auth is for authenticating the user and not for adding user
        // still need to fetch for access to database.
            .then(async res => {
              const result = await res.json();
              if (!res.ok) {
                this.setState({ invalid: true });
                return;
              }
            })
            .catch(err => {
              console.error("Auth error:", err);
              this.setState({ invalid: true });
            });
    }

    render() {
        //const {route} = this.context;
        //const { action } = this.props;
        const { handleChange, handleSubmit } = this;
        const welcomeMessage = 'Create New Blog';
        const submitButtonText = 'Finish';
        return (
            <div className="blog-background full-screen d-flex justify-content-center align-items-center">
                <div className='form-style container-fluid col-10 col-md-5 p-4'>
                    {/* <Navbar /> */}
                    <h1 className='text-center mb-3 form-font'>{welcomeMessage}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                        <label htmlFor="title" className='form-label'>Title</label>
                            <input
                            required
                            autoFocus
                            id='title'
                            type="text"
                            name="title"
                            onChange={handleChange}
                            className='form-control' />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='content' className='form-label'>Blog Content</label>
                            <input 
                            required
                            id='content'
                            type='text'
                            name='content'
                            onChange={handleChange}
                            className='form-control'/>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='latitude' className='form-label'>Latitude</label>
                            <input 
                            required
                            id='latitude'
                            type='text'
                            name='latitude'
                            onChange={handleChange}
                            className='form-control'/>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='longitude' className='form-label'>Longitude</label>
                            <input 
                            required
                            id='longitude'
                            type='text'
                            name='longitude'
                            onChange={handleChange}
                            className='form-control'/>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='thumbnail' className='form-label'>Thumbnail</label>
                            <input 
                            id='thumbnail'
                            type='image'
                            name='image'
                            onChange={handleChange}
                            className='form-control'/>
                        </div>
                        {this.state.incorrect === true &&
                            <div>
                                <p>Blog is invalid. Please try again.</p>
                            </div>
                        }
                        <div className='d-flex justify-content-center mb-4'>
                        <button type='submit' className='btn btn-custom col-12'>{submitButtonText}</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}