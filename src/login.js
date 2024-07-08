import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import AddPost from './addPost.js';
import Posts from './posts.js';
import './loginpopup.css';

const App = () => {
    const [loginPopupVisible, setLoginPopupVisible] = useState(true);
    const [signupPopupVisible, setSignupPopupVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [profilename, setProfilename] = useState('');
    const [password, setPassword] = useState('');
    const [signupname, setSignupName] = useState('');
    const [signupemail, setSignupEmail] = useState('');
    const [signuppass, setSignupPassword] = useState('');
    const [userProfiles, setUserProfiles] = useState([]);

    useEffect(() => {
        validation();
    }, []);

    async function validation() {
        try {
            const response = await axios.get('http://localhost:5000/validation');
            setUserProfiles(response.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    const onChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const onLogin = () => {
        let loginSuccessful = false;

        userProfiles.forEach(user => {
            if (user.email === username && user.pass === password) {
                setProfilename(user.name); // Setting the profile name
                console.log(user.name + ' Logged in successful');
                loginSuccessful = true;
            }
        });

        if (loginSuccessful) {
            setLoginPopupVisible(false);
            setSignupPopupVisible(false);
        } else {
            alert("Incorrect username or password");
        }
    }

    const signup = async (e) => {
        e.preventDefault();
        const signupDetails = { name: signupname, email: signupemail, pass: signuppass };

        try {
            const response = await axios.post('http://localhost:5000/saveprofile', signupDetails, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("Server response:", response.data);
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    }

    const loginpopup = () => {
        setLoginPopupVisible(true);
        setSignupPopupVisible(false);
    }

    const signuppopup = () => {
        setLoginPopupVisible(false);
        setSignupPopupVisible(true);
    }

    useEffect(() => {
        if (profilename !== '') {
            // Render components after successful login
            const navBarRoot = ReactDOM.createRoot(document.getElementById('nav-bar'));
            navBarRoot.render(
                <div className="nav-bar">
                    <h1 className="logo-title">Guvi Geek Network</h1>
                    <h1 className="user-name"> {profilename} </h1>
                    <button className="login-btn" onClick={() => window.location.reload(false)}>Signout</button>
                </div>
            );

            const newPostRoot = ReactDOM.createRoot(document.getElementById('newpost-container'));
            newPostRoot.render(<React.StrictMode><AddPost /></React.StrictMode>);

            const postsRoot = ReactDOM.createRoot(document.getElementById('posts-container'));
            postsRoot.render(<React.StrictMode><Posts profilename={profilename} /></React.StrictMode>);
        }
    }, [profilename]);

    return (
        <div>
            {loginPopupVisible && (
                <div className="loginpopup" id="loginpopup">
                    <h1 className="login-title">Login</h1>
                    <h2 className="login-label">Email</h2>
                    <input type="text" className="login-name" id="username" onChange={onChangeUsername} />
                    <br />
                    <h2 className="login-label">Password</h2>
                    <input type="password" className="login-pass" id="password" onChange={onChangePassword} />
                    <br />
                    <button className="login" id="login" onClick={onLogin}>Login</button>
                    <br />
                    <p className="signup-txt">Don't have an account?.. <button className="signup-link" id="signup-btn" onClick={signuppopup}>Signup</button></p>
                </div>
            )}
            {signupPopupVisible && (
                <div className="signuppopup" id="signuppopup">
                    <h1 className="signup-title">Signup</h1>
                    <h2 className="signup-label">UserName</h2>
                    <input type="text" className="signup-name" onChange={(e) => setSignupName(e.target.value)} />
                    <br />
                    <h2 className="signup-label">Email</h2>
                    <input type="email" className="signup-email" onChange={(e) => setSignupEmail(e.target.value)} />
                    <br />
                    <h2 className="signup-label">Password</h2>
                    <input type="password" className="signup-pass" onChange={(e) => setSignupPassword(e.target.value)} />
                    <br />
                    <button className="login" onClick={signup}>Signup</button>
                    <br />
                    <p className="signup-txt">Already have an account?.. <button className="signup-link" id="login-btn" onClick={loginpopup}>Login</button></p>
                </div>
            )}
        </div>
    );
}

export default App;
