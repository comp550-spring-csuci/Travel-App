import React from "react";
import NotFound from "./not-found";
import { AppContext } from "../lib";

export default class BlogFeedAll extends React.Component {
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
    this.fetchPosts();
  }

  fetchPosts = () => {
    const { token } = this.context;
    fetch("/api/get/all", {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        this.setState({
          posts: Array.isArray(data) && data.length > 0 ? data : null,
          loading: false,
          error: false
        });
      })
      .catch(() => {
        this.setState({ error: true });
      });
  };

  handleDelete = async (postId) => {
    const { token } = this.context;
    try {
      const res = await fetch(`/api/delete/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        }
      });
      if (!res.ok) throw new Error("Delete failed");
      this.fetchPosts(); // refresh the post list
    } catch (err) {
      console.error(err);
      alert("Failed to delete post.");
    }
  };

  render() {
    return (
      <div className="container-fluid p-5">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <h1 className="p-5">All Posts</h1>
          <a href="#add-blog" className="btn btn-primary">New+</a>
        </div>

        {this.state.error && <NotFound />}

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
                      style={{ width: "100%", maxWidth: "400px", marginBottom: "1rem" }}
                    />
                  )}
                  <div className="blog-box-text">
                    <h2>{post.title}</h2>
                    <p>{post.content}</p>
                    <div className="blog-author">
                      <p className="blog-author-text">
                        {post.author?.username || "Unknown Author"}
                      </p>
                      <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                      <p>{post.location}</p>
                    </div>
                    {/* Delete Button Below Author Info */}
                    {/* <div className="mt-2">
                      <button
                        onClick={() => this.handleDelete(post._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div> */}
                  </div>
                </div>
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
