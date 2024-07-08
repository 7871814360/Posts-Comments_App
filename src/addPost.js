import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Posts  from './posts';
import axios from 'axios';
import './Style.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [fileName, setFileName] = useState(null);
  const [postContent, setPostContent] = useState('');
  const postsRoot = ReactDOM.createRoot(document.getElementById('posts-container'));

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    // console.log(e.target.files[0]);
    // console.log(e.target.files[0].name);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    

    try {
     const res =  await axios.post('http://localhost:3501/upload', formData,{
        headers: { 'Content-Type': 'multipart/form-data' },

    });
    console.log(res.data);
      setMessage( res.data.file +'File is'+ res.data.message);
      setFileName(res.data.file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Failed to upload file');
    }
  };

  const postSubmit = async (e) => {
    e.preventDefault();
    const postDetails = { title: postTitle, file: fileName, content: postContent };
    console.table(postDetails);
    try {
      const response = await axios.post('http://localhost:5000/submit', postDetails, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessage(response.data);
      console.log("Server response:", response.data);
    } catch (error) {
      console.error('Error submitting post:', error);
      setMessage('Failed to submit post');
    }
  };

  const openNewPostPopup = () => {
    setPopupVisible(true);
  };

  const closeNewPostPopup = () => {
    setPopupVisible(false);
    postsRoot.render(<React.StrictMode><Posts /></React.StrictMode>);
  };

  return (
    <div>
      <button className="newpost-btn" onClick={openNewPostPopup}>New +</button>
      {isPopupVisible && (
        <div className="newpostpopup" id="newpostpopup" style={{ display: 'block' }}>
          <h1 className="newpost-label">Post Title</h1>
          <span className='close-newPost' onClick={closeNewPostPopup}>X</span>
          <input type="text" className="newpost-input" onChange={(e) => setPostTitle(e.target.value)}/>
          <h1 className="newpost-label">Upload Image</h1>
          <input type="file" className='newpost-file' onChange={onFileChange} />
          <button onClick={onSubmit} className='newpost-img'>Upload</button>
          <p>{message}</p>
          <h1 className="newpost-label">Description</h1>
          <input type="text" className="newpost-desc" onChange={(e) => setPostContent(e.target.value)}/>
          <button className="newpost-submit" onClick={postSubmit}>Post</button>
        </div>
      )}
    </div>
  );
};

export default App;