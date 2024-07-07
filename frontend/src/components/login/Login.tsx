//@ts-nocheck

import React, { useContext, useState } from 'react'
import './login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import logo from "../../assets/images/ai.jpg"
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { GlobalContext, setCookie } from '../../App';

function getCookie(name:any) {
    const value = `; ${document.cookie}`;
    const parts:any = value.split(`; ${name}=`);
    if (parts) {
        if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    }
  }

const Login = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const global = useContext(GlobalContext)

    const setProfilePic = global.setProfilePic!;

    const clientId = "46297420444-dvh3phisj6krntc8rf46ko1p9r3pl0ce.apps.googleusercontent.com"

    const handleLoginSuccess = (credentialResponse) => {
        const accessToken = credentialResponse.credential;
        console.log("Access Token:", accessToken);

        // Decode the JWT token
        const decoded = jwtDecode(accessToken);
        console.log("Decoded Token:", decoded);

        // Extract user details
        const { name, email, picture } = decoded;
        console.log("User Details:", { name, email, picture });
    }

    const handleLoginFailure = (error) => {
        console.log("An error occurred ", error)
    }

    const url = "http://localhost:8000/api/login"
    const userData = {
        "email": email,
        "password": password,
    }

    async function postData (e:any) {
        e.preventDefault()
        console.log(email, password)
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(userData)
        };
        fetch(url, options)
        .then(response=> {
            if (!response.ok) {
                throw new Error("Response is not okay " + response.statusText)
            }
            else {
                return response.json()
            }
        })
        .then(data => {
            console.log(data)

            setCookie("access", data["access", 1])
            setCookie("refresh", data["refresh", 30])
            setProfilePic(data["picture"])
            localStorage.setItem("email", data["email"])
            localStorage.setItem("pp", data["picture"])

            console.log(localStorage.getItem("pp"), localStorage.getItem("email"))
            
            if (data["status"] === 200) {
               window.location.assign("http://localhost:8000") 
            }
            
          })
          .catch(error => {
            console.error('Error:', error); // Handle any errors that occur
          });       

    }
    
    return (
        <div className="login">
            <div className="lg-left"></div>
            <div className="lg-right">
                <h1 className="lg-ttl">Stellar<span className='color-primary'>Code</span></h1>

                <div className="lg-boss">
                    <div className="lg-boy">
                        <div className="login-container">
                            <div className="lg-im">
                                <img src={logo} alt="" className='lg-logo'/>
                            </div>
                            <h4 className="jiggy">Sign in to your account</h4>
                            <div className="login-con">
                                <form onSubmit={(e)=> {
                                    postData(e)
                                }}>
                                    <div className="email-lg">
                                        <label htmlFor="email">Email</label>
                                        <input
                                         type="email"
                                          placeholder="example@gmail.com"
                                           value={email}
                                            onChange={(e)=> {
                                                setEmail(e.target.value)
                                            }}/>
                                    </div>
                                    <div className="password-lg">
                                        <label htmlFor="password">Password</label>
                                        <div className="trick">
                                            <input 
                                            type={`${show ? "text": "password"}`}
                                             id='login-password'
                                              placeholder='********'
                                              value={password}
                                              onChange={(e)=> {
                                                setPassword(e.target.value)
                                              }}
                                              />
                                            <span onClick={()=> {
                                                setShow(prev=> !prev)
                                            }}>{show? <FaEye/> : <FaEyeSlash/>}</span>
                                        </div>
                                    </div>
                                    <a href="#" className='stress'>Forgot password?</a>
                                    <button className='sub-log' id='sub-login'>Sign in</button>
                                    <div>
                                        <GoogleLogin
                                            clientId={clientId}
                                            onSuccess={handleLoginSuccess}
                                            onFailure={handleLoginFailure}
                                            className="custom-google-button"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login
