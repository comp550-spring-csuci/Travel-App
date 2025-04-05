import React from "react";
import NotFound from "./not-found";

export default class BlogFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {post: null, loaiding: true, error: false};
    }

    //edit this path with the actual path when created 
    componentDidMount() {
        fetch('api/posts', {
            headers: {
                'x-access-token': localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.length === 0 ) {
                    this.setState({ posts: null, loading: false, error: false });
                }
                else {
                    this.setState({ posts: res, loading: false, error: false });
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
                    <a href="create-post" className="btn btn-primary">New+</a>
                </div>
                {/* {this.state.error === true &&
                    <NotFound />
                } */}
                {this.state.posts &&
                this.state.posts.map(event => (
                    <div key={event.postId}></div>
                ))}
            </div>
        )
    }
}