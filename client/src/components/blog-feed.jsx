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
            <div className="container-fluid">
                {this.state.error === true &&
                    <NotFound />
                }
                {this.state.posts &&
                this.state.posts.map(event => (
                    <div key={event.postId}></div>
                ))}
            </div>
        )
    }
}