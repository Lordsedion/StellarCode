//@ts-nocheck

import React, { useState } from 'react'
import './login.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import logo from "../../assets/images/ai.jpg"
import { GoogleLogin } from '@react-oauth/google';



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
                            <form>
                                <div className="email-lg">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" placeholder="example@gmail.com"/>
                                </div>
                                <div className="password-lg">
                                    <label htmlFor="password">Password</label>
                                    <div className="trick">
                                        <input type={`${show ? "text": "password"}`} id='login-password' placeholder='********'/>
                                        <span onClick={()=> {
                                            setShow(prev=> !prev)
                                        }}>{show? <FaEye/> : <FaEyeSlash/>}</span>
                                    </div>
                                </div>
                                <div className="password-lg">
                                    <label htmlFor="password">Verify password</label>
                                    <div className="trick">
                                        <input type={`${show ? "text": "password"}`} id='login-password' placeholder='********'/>
                                        <span onClick={()=> {
                                            setShow(prev=> !prev)
                                        }}>{show? <FaEye/> : <FaEyeSlash/>}</span>
                                    </div>
                                </div>
                                <a href="#" className='stress'>Forgot password?</a>
                                <button className='sub-log'>Sign in</button>
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
