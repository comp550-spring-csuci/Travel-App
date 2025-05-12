import React from 'react';
import { AppContext } from '../lib';

export default class SingleBlog extends React.Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            post: null
        };
    }

    componentDidMount() {
        const {token} = this.context;
        const {blogId} = this.props;

        fetch(`https://wndr-serverside.onrender.com/api/blogs/${blogId}`, {
            headers: {
                'x-access-token': token
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(res.status);
                return res.json();
            }) 
            .then(post => this.setState({post}))
            .catch(err => {
                console.error('Error loading post:', err);
            })
    }

    render() {
        const {post} = this.state;
        if (!post) return <p>Cannot find post.</p>;

        return (
            <div className="container"style={{paddingTop: "120px"}}>
                <div className='card mx-auto mb-3' style={{maxWidth: "800px", border: "none"}}>
                    {post.image && (
                        <div className='text-center'>
                            <img
                                src={`https://wndr-serverside.onrender.com/${post.image}`}
                                alt={post.title}
                                className='img-fluid mx-auto'
                                style={{ maxHeight: '500px', marginBottom: '1rem' }}
                            />
                            <div className="border-top border-2 my-2" />
                        </div>
                    )}
                    <h1>{post.title}</h1>
                    <div className="blog-author">
                        <p>{post.location}</p>
                    </div>
                    <p>{post.content}</p>
                    <div className="blog-author d-flex align-items-center mt-auto">
                      {post.author.image
                        ? <img
                            src={`https://wndr-serverside.onrender.com/${post.author.image}`}
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
            </div>
        )
    }
}