import React from "react";
import NotFound from "./not-found";
import { AppContext } from "../lib";

export default class BlogFeed extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = { posts: null, loading: true, error: false };
    }

    componentDidMount() {
        const { token } = this.context;
        fetch('api/blog-feed', {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(res.status);
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length === 0) {
                    this.setState({ posts: null, loading: false, error: false });
                } else {
                    this.setState({ posts: data, loading: false, error: false });
                }
            })
            .catch(() => {
                this.setState({ error: true });
            })
    }

    handleDelete = async (postId) => {
        const { token } = this.context;
        try {
            const res = await fetch(`/api/blog/${postId}`, {
                method: "DELETE",
                headers: {
                    "x-access-token": token
                }
            });
            if (!res.ok) throw new Error("Delete failed");
            this.setState(prevState => ({
                posts: prevState.posts.filter(post => post._id !== postId)
            }));
        } catch (err) {
            console.error(err);
            alert("Failed to delete post.");
        }
    };

    render() {
        const { posts, loading, error } = this.state;
        const { user } = this.context;
        return (
            <div className="container-fluid p-5">
                <div className="d-flex justify-content-center align-items-center gap-3">
                    <h1 className="p-5">Your Feed</h1>
                    <a href="#add-blog" className="btn btn-primary">New+</a>
                    {/* Delete Button */}
                    {/* The Delete button goes next to New+ */}
                    {/* <button
                        onClick={() => this.handleDelete(posts[0]._id)} // Example: Delete the first post
                        className="btn btn-danger"
                    >
                        Delete
                    </button> */}
                </div>

                {this.state.error === true && <NotFound />}

                <div className="row">
                    {this.state.posts && this.state.posts.length > 0 ? (
                        this.state.posts.map(post => (
                            <div key={post._id} className="col-md-4 blog-box-container" onClick={() => window.location.hash = `#blog/${post._id}`}>  
                                <div className="blog-post mb-4 p-3 border rounded blog-box">
                                    {post.image && (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="blog-image"
                                            style={{ width: '100%', maxWidth: '400px', marginBottom: '1rem' }}
                                        />
                                    )}
                                    <div className="blog-box-text">
                                        <h2>{post.title}</h2>
                                        <p>{post.content}</p>
                                        <div className="blog-author">
                                            <p className="blog-author-text">
                                                {post.author && post.author.username ? post.author.username : "Unknown Author"}
                                            </p>
                                            <p className="p-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                                            <p>{post.location}, {post.country}</p>
                                        </div>
                                    </div>

                                    {/* Edit button only for the post's author */}
                                    {user && post.author?._id === user.id && (
                                        <>
                                            <button 
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    window.location.hash = `#edit-blog/${post._id}`;
                                                }}
                                                className="btn btn-sm btn-secondary mt-2">Edit</button>
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    this.handleDelete(post._id);
                                                }}
                                                className="btn btn-danger btn-sm mt-2">
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>   
                            </div>
                        ))
                    ) : (
                        <p>No blog posts available.</p>
                    )}
                </div>
            </div>
        )
    }
}
