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
        const confirm = window.confirm("Are you sure you want to delete this post?");
        if (!confirm) return;
        
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
                <div className="d-flex justify-content-center align-items-center gap-3 pt-5 mt-5">
                    <h1>Your Feed</h1>
                    <a href="#add-blog" className="btn btn-primary blue-background">New+</a>
                </div>

                {this.state.error === true && <NotFound />}

                <div className="row">
                    {this.state.posts && this.state.posts.length > 0 ? (
                        this.state.posts.map(post => (
                            <div key={post._id} className="col-md-4 blog-box-container" onClick={() => window.location.hash = `#blog/${post._id}`}>  
                                <div className="blog-post mb-4 p-3 rounded blog-box d-flex flex-column" style={{height: "565px"}}>
                                    {post.image && (
                                        <div>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="blog-image"
                                                style={{ width: '100%', maxWidth: '400px'}}
                                            />
                                            <div className="border-top border-2 my-2" />
                                        </div>
                                    )}
                                    <div className="blog-box-text flex-grow-1">
                                        <h2>{post.title}</h2>
                                        <div className="blog-author">
                                            <p>{post.location}</p>
                                        </div>
                                        <p>{post.content}</p>    
                                        <div className="blog-author d-flex align-items-center mt-auto">
                                            {post.author.image
                                                ? <img
                                                    src={`/${post.author.image}`}
                                                    alt={post.author.username}
                                                    style={{
                                                    width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: '0.5rem'
                                                    }}
                                                />
                                                : <div
                                                    style={{width: 32, height: 32, borderRadius: '50%', backgroundColor: '#ddd', marginRight: '0.5rem'
                                                    }}
                                            />}
                                            <p className="blog-author-text mb-0">
                                                {post.author && post.author.username ? post.author.username : "Unknown Author"}
                                            </p>
                                            <p className="p-2 mb-0">{new Date(post.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Edit button only for the post's author */}
                                    {user && post.author?._id === user.id && (
                                        <div className="justify-content-center d-flex gap-2 mt-auto">
                                            <button 
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    window.location.hash = `#edit-blog/${post._id}`;
                                                }}
                                                className="btn btn-sm btn-secondary" style={{width: "150px"}}>Edit</button>
                                            <button
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    this.handleDelete(post._id);
                                                }}
                                                className="btn btn-danger btn-sm" style={{width: "150px"}}>
                                                Delete
                                            </button>
                                        </div>
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
