import React from "react";
import NotFound from "./not-found";
import { AppContext } from "../lib";

export default class BlogFeed extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {posts: null, loading: true, error: false};
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
                if (!res.ok) throw new Error(`${res.status}`);
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length === 0 ) {
                    this.setState({ posts: null, loading: false, error: false });
                }
                else {
                    this.setState({ posts: data, loading: false, error: false });
                }
            })
            .catch(() => {
                this.setState({ error: true });
            })
    }

    render() {
        const {posts, loading, error} = this.state;
        return (
            <div className="container-fluid p-5">
                <div className="d-flex justify-content-center align-items-center">
                    <h1 className="p-5">Your Feed</h1>
                    <a href="#add-blog" className="btn btn-primary">New+</a>
                </div>
                {this.state.posts && this.state.posts.length > 0 ? (
                    this.state.posts.map(post => (
                        <div key={post._id} className="blog-post mb-4 p-3 border rounded">
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    style={{width: '100%', maxWidth: '400px', marginBottom: '1rem'}}
                                />
                            )}
                            <h2>{post.title}</h2>
                            <p>{post.content}</p>
                            <p>{post.author.username}</p>
                            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                            <p>{post.location}</p>
                        </div>
                    ))
                ) : (
                    <p>No blog posts available.</p>
                )
                }
            </div>
        )
    }
}