import React from "react";
import NotFound from "./not-found";
import { AppContext } from "../lib";
import {API_BASE} from "../lib/api";

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

    fetch(`${API_BASE}/api/blogs/city/${encodeURIComponent(cityName)}`, {
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
        <div className="d-flex justify-content-center align-items-center">
          <h1 className="pt-5 mt-5">Posts in {decodedCityName}</h1>
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
