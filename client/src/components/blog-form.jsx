import React from "react";
import NotFound from "./not-found";
import { AppContext } from "../lib";

export default class AddBlog extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            file: null,
            location: '',
            latitude: '',
            longitude: '',
            country: '',
            invalid: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }

    async componentDidMount() {
        const {token} = this.context;
        const {blogId} = this.props;

        if (blogId) {
            try {
                const res = await fetch(`/api/blogs/${blogId}`, {
                    headers: {"x-access-token": token}
                });
                if (!res.ok) throw new Error(res.status);
                const post = await res.json();

                if (post.author._id !== this.context.user.id) {
                    return window.location.hash = "#blog-feed";
                }

                this.setState({
                    title: post.title,
                    content: post.content,
                    location: post.location,
                    latitude: post.latitude,
                    longitude: post.longitude,
                });
            } catch {
                this.setState({error: true});
            }
        }
    }

    //handles input change in the form and sets the value
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleFileChange({target: {files}}) {
        this.setState({file: files[0]});
    }

    //handles submitting the form, send a POST request
    handleSubmit(event) {
        event.preventDefault();
        const {title, content, file, location, latitude, longitude} = this.state;
        const {token} = this.context;
        const {blogId} = this.props;

        fetch(`/api/geocoding?q=${encodeURIComponent(location)}`)
            .then(res => {
                if (!res.ok) throw new Error(res.status);
                return res.json();
            })
            .then(geoData => {
                const {lat, lon, country} = geoData;
                if (lat == null || lon == null) {
                    throw new Error("Missing latitude or longitude");
                }

            const form = new FormData();
            form.append("title", title);
            form.append("content", content);
            form.append("location", location);
            form.append("latitude", lat);
            form.append("longitude", lon);
            form.append("country", country)
            if (file) form.append("image", file);
            if (blogId) form.append("blogId", blogId);

            const url = blogId ? "/api/post/updateBlog" : "/api/post/newblog";
            const method = blogId ? "PUT" : "POST";

            return fetch(url, {
                method,
                headers: {
                    'x-access-token': token
                },
                body: form
            })
                .then(res => {
                    if (!res.ok) throw new Error(res.status);
                    return res.json();
                })
                .then(() => {
                    window.location.hash = '#blog-feed';
                })
                .catch(err => {
                    console.error("Upload failed", err);
                    this.setState({error: true, loading: false})
                })
            })  
        };
        

    render() {
        const {title, content, file, location, latitude, longitude} = this.state;
        const {blogId} = this.props;
        const { handleChange, handleSubmit } = this;
        const submitButtonText = 'Finish';
        const isEdit = Boolean(blogId);
        return (
            <div className="blog-background full-screen d-flex justify-content-center align-items-center">
                <div className='form-style container-fluid col-10 col-md-5 p-4'>
                    <h1 className='text-center mb-3 mt-5 pt-5 form-font'>{isEdit ? "Edit Blog" : "Create New Blog"}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                        <label htmlFor="title" className='form-label'>Title</label>
                            <input
                            required
                            autoFocus
                            id='title'
                            type="text"
                            name="title"
                            value={title}
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
                            value={content}
                            onChange={handleChange}
                            className='form-control'/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                            required
                            id="location"
                            name="location"
                            value={location}
                            onChange={this.handleChange}
                            className="form-control"
                            />
                        </div>
                        {/* <div className='mb-4'>
                            <label htmlFor='latitude' className='form-label'>Latitude</label>
                            <input 
                            required
                            id='latitude'
                            type='text'
                            name='latitude'
                            value={latitude}
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
                            value={longitude}
                            onChange={handleChange}
                            className='form-control'/>
                        </div> */}
                        <div className='mb-4'>
                            <label htmlFor='image' className='form-label'>Upload Image</label>
                            {/* <input 
                            id='image'
                            type='url'
                            name='image'
                            value={image}
                            onChange={handleChange}
                            className='form-control'/> */}
                            <input 
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={this.handleFileChange}
                            className="form-control"
                            />
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