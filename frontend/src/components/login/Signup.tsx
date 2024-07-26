//@ts-nocheck

import React, { useContext, useState } from 'react'
import './login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import logo from "../../assets/images/ai.jpg"
import { GoogleLogin } from '@react-oauth/google';
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

const clientId = '46297420444-dvh3phisj6krntc8rf46ko1p9r3pl0ce.apps.googleusercontent.com';

const GoogleSignIn = () => {
    const onSuccess = (credentialResponse) => {
        console.log('Signed in successfully:', credentialResponse);
        // Send the access token (credentialResponse.accessToken) to your backend for further processing
    };

    const onError = (error) => {
        console.error('Failed to sign in:', error);
    };

    return (
        <GoogleLogin
            clientId={clientId}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onError={onError}
            cookiePolicy="single_host_origin" // Recommended for security
        />
    );
}; 

const Signup = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const [password1, setPass1] = useState("")
    const global = useContext(GlobalContext)
    const setProfilePic = global.setProfilePic!;

    async function postDataSocial (token:string) {
        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({"access_token": token})
        };

        const url = "http://localhost:8000/api/token"
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
            setProfilePic(data["response"]["picture"])
            localStorage.setItem("email", data["response"]["email"])
            localStorage.setItem("firstName", data["response"]["given_name"])
            localStorage.setItem("pp", data["response"]["picture"])

            console.log("abeg", localStorage.getItem("pp"), localStorage.getItem("email"))
            window.location.assign("http://localhost:8000") 
            
          })
          .catch(error => {
            console.error('Error:', error); // Handle any errors that occur
          });       

    }

    function getFirstPartOfEmail(email) {
        // Split the email by '@' and return the first part
        return email.split('@')[0];
    }

    const handleLoginSuccess = (credentialResponse) => {
        const accessToken = credentialResponse.credential;
        console.log("Access Token:", accessToken);

        postDataSocial(accessToken)

        // Decode the JWT token
        const decoded = jwtDecode(accessToken);
        console.log("Decoded Token:", decoded);
    }

    const handleLoginFailure = (error) => {
        console.log("An error occurred ", error)
    }

    const url = "http://localhost:8000/api/signup"
    const userData = {
        "email": email,
        "password": password,
    }

    async function postData (e:any) {
        e.preventDefault()
        console.log(password, password1)
        if (password!== password1) {
            console.log("Error o")
            return Error("Passwords do not match")
        }
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
            console.log({data})

            setCookie("access", data["access", 1])
            setCookie("refresh", data["refresh", 30])
            setProfilePic(data["picture"])
            localStorage.setItem("access", data["access"])
            localStorage.setItem("refresh", data["refresh"])
            localStorage.setItem("email", data["user"]["email"])
            localStorage.setItem("pp", data["picture"])

            console.log(localStorage.getItem("pp"), localStorage.getItem("email"))
            localStorage.setItem("firstName", getFirstPartOfEmail(data["user"]["email"]))
            window.location.assign("http://localhost:8000") 
            
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
                        <h4 className="jiggy">Create your account</h4>
                        <div className="login-con">
                            <form onSubmit={(e)=>{postData(e)}}>

                                <div className="email-lg">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" placeholder="example@gmail.com" onChange={(e)=> {
                                        setEmail(e.target.value)
                                    }} value={email}/>
                                </div>
                                <div className="password-lg">
                                    <label htmlFor="password">Password</label>
                                    <div className="trick">
                                        <input type={`${show ? "text": "password"}`} value={password} onChange={(e)=>{
                                            setPass(e.target.value)
                                        }} id='login-password' placeholder='********'/>
                                        <span onClick={()=> {
                                            setShow(prev=> !prev)
                                        }}>{show? <FaEye/> : <FaEyeSlash/>}</span>
                                    </div>
                                </div>
                                <div className="password-lg">
                                    <label htmlFor="password">Verify password</label>
                                    <div className="trick">
                                        <input type={`${show ? "text": "password"}`} value={password1} onChange={(e)=> {
                                            setPass1(e.target.value)
                                        }} id='login-password' placeholder='********'/>
                                        <span onClick={()=> {
                                            setShow(prev=> !prev)
                                        }}>{show? <FaEye/> : <FaEyeSlash/>}</span>
                                    </div>
                                </div>
                                <a href="#" className='stress'>Forgot password?</a>
                                <button className='sub-log'>Sign in</button>
                                <h4 style={{padding: "0.5rem 0"}}>Have an account already? <a className='color-primary' href="/login/">Sign in</a></h4>

                                <GoogleSignIn/>
                            </form>
                        </div>
                    </div>
                    </div>
                    
                </div>

            </div>
        </div>
    )
}

export default Signup
