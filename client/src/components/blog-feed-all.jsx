import React from "react";
import NotFound from "./not-found";

export default class BlogFeedAll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {posts: null, loading: true, error: false};
    }

    //edit this path with the actual path when created 
    componentDidMount() {
        fetch('api/get/all', {
            headers: {
                'x-access-token': localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
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
        return (
            <div className="container-fluid p-5">
                <div className="d-flex justify-content-center align-items-center">
                    <h1 className="p-5">Your Feed</h1>
                    <a href="#add-blog" className="btn btn-primary">New+</a>
                </div>
                {/* {this.state.error === true &&
                    <NotFound />
                } */}
                <div className="row">
                    {this.state.posts && this.state.posts.length > 0 ? (
                        this.state.posts.map(post => (
                            <div key={post._id} className="col-md-4 blog-box-container">
                                <div className="blog-post mb-4 p-3 border rounded blog-box">
                                    {post.image && (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="blog-image"
                                            style={{width: '100%', maxWidth: '400px', marginBottom: '1rem'}}
                                        />
                                    )}
                                    <div className="blog-box-text">
                                        <h2>{post.title}</h2>
                                        <p>{post.content}</p>
                                        <div className="blog-author">
                                            <p className="blog-author-text">{post.author.username}</p>
                                            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                                            <p>{post.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No blog posts available.</p>
                    )
                    }
                </div>
            </div>
        )
    }
}