import React from "react";
import NotFound from "./not-found";
import { AppContext } from "../lib";
import { useLocation } from 'react-router-dom';

export default class BlogFeedSearch extends React.Component {
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
    const searchQuery = window.location.href.split("/")[4];
    fetch(`https://wndr-serverside.onrender.com/api/get/search/${encodeURIComponent(searchQuery)}`, {
      method: "GET",
      headers: {
          "x-access-token": token
      },
      cache: "no-store"
  })
    .then(res => {
      console.log("Status:", res.status);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log("Posts data:", data);
      this.setState({
        posts: Array.isArray(data) && data.length > 0 ? data : null,
        loading: false,
        error: false
      });
    })
    .catch(() => {
      this.setState({ error: true });
    });
  }

  fetchSearchResults = (query) => {
    const req = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchString: query })
      };
  };


  render() {
    return (
      <div className="container-fluid p-5">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <h1 className="pt-5 mt-5">Search Results</h1>
        </div>

        {this.state.error && <NotFound />}

        <div className="row">
          {this.state.posts && this.state.posts.length > 0 ? (
            this.state.posts.map(post => (
              <div key={post._id} className="col-md-4 blog-box-container">
                <a href={`#blog/${post._id}`} className="tile-link">
                  <div className="blog-post mb-4 p-3 rounded blog-box d-flex" style={{height: "510px"}}>
                    {post.image && (
                      <div>
                        <img
                          src={`https://wndr-serverside.onrender.com/${post.image}`}
                          alt={post.title}
                          className="blog-image"
                          style={{ width: "100%", maxWidth: "400px"}}
                        />
                        <div className="border-top border-2 my-2" />
                      </div>
                    )}
                    <div className="blog-box-text flex-grow-1">
                      <h2 className="black">{post.title}</h2>
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
