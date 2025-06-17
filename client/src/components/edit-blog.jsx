import React from "react";
import Navbar from '../components/navbar';
import { AppContext } from "../lib";
import {API_BASE} from "../lib/api";

export default class EditBlog extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            image: '',
            author: 'user',
            latitude: '',
            longitude: '',
            invalid: false,
            loading: true,
            error: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { token, route } = this.context;
        const { id } = route.params;
        fetch(`${API_BASE}/api/blogs/${id}`, {

            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
            .then(post => {
                this.setState({
                    title: post.title,
                    content: post.content,
                    image: post.image || "",
                    location: post.location || "",
                    latitude: post.latitude || "",
                    longitude: post.longitude || "",
                    loading: false
                });
            })
            .catch(() => this.setState({error: true, loading: false}));
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
        const buttonPressed = event.nativeEvent.submitter.value;
        if (buttonPressed == 'delete') {
            const req = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            };
            fetch(`${API_BASE}/api/auth/${action}`, req)
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
        } else {
            const req = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            };
            fetch(`${API_BASE}/api/auth/${action}`, req)
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
        this.setState({ invalid: true });
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
                        {this.state.incorrect === true &&
                            <div>
                                <p>Blog is invalid. Please try again.</p>
                            </div>
                        }
                        <div className='d-flex justify-content-center mb-4'>
                        <button type='submit' className='btn btn-custom col-12' value = 'edit'>{'Finish'}</button>
                        <button type='submit' className='btn btn-custom col-12' value = 'delete'>{'Delete'}</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}