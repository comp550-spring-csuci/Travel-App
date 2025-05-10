import React from "react";
import NotFound from "./not-found";
import { AppContext } from "../lib";

export default class BlogByCity extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      loading: true,
      error: false
    };
  }

  componentDidMount() {
    const { token } = this.context;
    const cityName = this.context.route.params.get('id');

    fetch(`/api/blogs/city/${encodeURIComponent(cityName)}`, {
        headers: {
            'x-access-token': token
        }
    })
    .then(res => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
    })
    .then(data => {
        this.setState({posts: data});
    })
    .catch(() => {
        this.setState({error: true});
    });
  }

  render() {
    const {posts} = this.state;
    const cityName = this.context.route.params.get('id');
    const decodedCityName = decodeURIComponent(cityName);
    return (
      <div className="container-fluid p-5">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <h1 className="p-5">Posts in {decodedCityName}</h1>
        </div>

        {this.state.error && <NotFound />}

        <div className="row">
          {this.state.posts && this.state.posts.length > 0 ? (
            this.state.posts.map(post => (
              <div key={post._id} className="col-md-4 blog-box-container">
                <a href={`#blog/${post._id}`} className="tile-link">
                  <div className="blog-post mb-4 p-3 border rounded blog-box">
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="blog-image"
                        style={{ width: "100%", maxWidth: "400px", marginBottom: "1rem" }}
                      />
                    )}
                    <div className="blog-box-text">
                      <h2 className="black">{post.title}</h2>
                      <p>{post.content}</p>
                      <div className="blog-author">
                        <p className="blog-author-text">
                          {post.author?.username || "Unknown Author"}
                        </p>
                        <p className="p-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                        <p>{post.location}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <p>No blog posts available.</p>
          )}
        </div>
      </div>
    );
  }
}
