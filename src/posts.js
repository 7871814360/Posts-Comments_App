import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './cmt.css';

function Posts({profilename}) {
  const [posts, setPosts] = useState([]);
  const [comments, addComment] = useState([]);
  const postsRoot = ReactDOM.createRoot(document.getElementById('posts-container'));

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get('http://localhost:5000/hello');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const addComments = async(id) => {
    console.log('comments:', comments);
    console.log('ID:', id);
    const update ={ postId: id, username: profilename, comment : comments};
    try {
      const response = await axios.post('http://localhost:5000/addcomments', update, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log("Server response:", response.data);
      
      postsRoot.render(<React.StrictMode><Posts /></React.StrictMode>);
     
    } catch (error) {
      console.error('Error submitting post:', error);
    }

  }

  return (
    <>
      {posts.map(post => (
        <div className="post-container" key={post._id}>
          <h2 className='post-title'>{post.Postname}</h2>
          <div className="image">
            <img src={`http://localhost:3501/uploads/${post.fileid}`} alt={post.fileid} />
          </div>
          <p className='post-desc'>{post.description}</p>
          <h3 className='post-cmt'>Comments</h3>
          <input type="text" placeholder="Enter your comment" className='input-addCmt' onChange={(e) => addComment(e.target.value)}/>
          <button onClick={() => addComments(post._id)} className='btn-addComment'>Add Comments</button>
          
          {post.comments && (
            <div className="comments-section">
              {Object.keys(post.comments).map(name => (
                <p className='cmts' key={name}>@{name}: {post.comments[name]}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export default Posts;
