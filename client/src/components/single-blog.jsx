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

        fetch(`api/blogs/${blogId}`, {
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
                    <h1>{post.title}</h1>
                    {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        style={{ maxWidth: '100%', marginBottom: '1rem' }}
                    />
                    )}
                    <p>{post.content}</p>
                    <p>{post.author.username}{' '}</p>
                    <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                    <p>{post.location}</p>
                </div>
            </div>
        )
    }
}