import React, { useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Signin.css'
import * as Icons from 'react-bootstrap-icons'
import logo from './images/logo.png'
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import config from "./Config.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup=()=>{

    const navigate = useNavigate()
    
    return <>

        <ToastContainer />

        <div className="card-bg rounded">
            <div className="row m-0" style={{height:'100vh',width:'100%'}}>
                <div className="col-lg-6 col-sm-12 h-100">
                    <div style={{display:'flex',flexDirection:'column',height:'100vh'}}>
                        <div style={{flex:1}} className="p-5">
                            <img width={'75rem'} src={logo} alt="no" />
                        </div>
                        <div style={{bottom:'2rem'}}>
                            <h1 className="ps-5 ts text-light shadow-bg pt-2" style={{fontWeight:'300'}}>Don't Have an Account ?</h1>
                            <p className="ps-5 ts mb-0 shadow-bg">Register to Access all features of our services, <span className="color-footer">"Stay Connected Anytime, Anywhere. Instant Chats, Secure Conversations."</span></p>
                            <div className="d-flex shadow-bg justify-content-center pb-2 mb-2">
                                <div style={{fontSize:'2rem',padding:'0rem 1rem'}}>
                                    <Icons.Facebook />
                                </div>
                                <div style={{fontSize:'2rem',padding:'0rem 1rem'}}>
                                    <Icons.Instagram />
                                </div>
                                <div style={{fontSize:'2rem',padding:'0rem 1rem'}}>
                                    <Icons.Twitter/>
                                </div>
                                <div style={{fontSize:'2rem',padding:'0rem 1rem'}}>
                                    <Icons.Google/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col h-100">

                </div>
                <div className="col-lg-3 col-sm-12 h-100" style={{backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                    <SignupCard navigate={navigate} ToastContainer={ToastContainer} toast={toast}/>
                </div>
            </div>
        </div>
    </>
}

export default Signup;

const SignupCard=({navigate,ToastContainer,toast})=>{

    const formRef = useRef(null)
    const input_first_name = useRef(null)
    const input_last_name = useRef(null)
    const input_mail = useRef(null)
    const input_username = useRef(null)
    const input_password = useRef(null)
    const input_contact = useRef(null)
    const input_image = useRef(null)

    const [view, setView] = useState(false);

    const handle_submit=(e)=>{
        e.preventDefault()
        const signup_form = new FormData(formRef.current)
        signup_form.append('first_name',input_first_name.current.value)
        signup_form.append('last_name',input_last_name.current.value)
        signup_form.append('email',input_mail.current.value)
        signup_form.append('username',input_username.current.value)
        signup_form.append('password',input_password.current.value)
        signup_form.append('contact',input_contact.current.value)
        signup_form.append('image',input_image.current.files[0])

        if(input_first_name && input_last_name && input_mail && input_username && input_password)
        {
            if(pass_lengthcheck() && pass_specialcharcheck() && pass_lower() && pass_higher())
            {
                if(contact_check())
                {
                    axios.post(`${config.baseurl}/signup`,signup_form)
                    .then((res)=>{
                        console.log(res.data.username);
                        const string1 = String(res.data.username)
                        if(string1 === "A user with that username already exists.")
                        {
                            // alert(res.data.username);
                            toast.error(string1, {
                                position: "top-center",
                                autoClose: 2000,
                                theme: "dark",
                                });
                        }
                        else{
                            alert('user registered successfully');
                            // toast.error("user registered successfully", {
                            //     position: "top-center",
                            //     autoClose: 2000,
                            //     theme: "dark",
                            //     });
                            // formRef.current.reset();
                            navigate('/')
                        }
                    })
                    .catch((error)=>{
                        alert('user registration failed');
                        // toast.error('user registration failed', {
                        //     position: "top-center",
                        //     autoClose: 2000,
                        //     theme: "dark",
                        //     });
                        // console.log(error);
                    })
                }
                else{
                    alert('Invalid Contact Number')
                    // toast.error('Invalid Contact Number', {position: "top-center",autoClose: 2000,theme: "dark"});
                }
            }
            else{
                // alert('Password must be 8 Character long and should contain Capital letters, Small letters & special character')
                toast.error('Password must be 8 Character long and should contain Capital letters, Small letters & special character', 
                {position: "top-center",autoClose: 2000,theme: "dark"});
            }
        }
    }

    const pass_lengthcheck=()=>{
        if(input_password.current.value.length >= 8)
        {
            return true;
        }
        else{
            return false;
        }
    }

    const pass_specialcharcheck=()=>{
        const specialchar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
        return specialchar.test(input_password.current.value);
    }

    const pass_lower =()=>{
        const spec_lower = /[a-z]/;
        return spec_lower.test(input_password.current.value) ;
    }

    const pass_higher=()=>{
        const spec_high = /[A-Z]/;
        return spec_high.test(input_password.current.value);
    }

    const toggle_password_type=()=>{
        setView(!view)
        if(view)
        {
            input_password.current.type = "password"
        }
        else{
            input_password.current.type = "text"
        }
    }

    const contact_check=()=>{
        return input_contact.current.value.length===10
    }

    return <>
    <ToastContainer/>
        <div className="place-center" style={{height:'75vh'}}>
            <div className="mt-5 ms-3">
                <form onSubmit={handle_submit} ref={formRef} action="post" className="form-card" encType="multipart/form-data">
                    <h2 style={{fontWeight:'400'}} className="text-start ps-2">Sign Up</h2>
                    {/* <hr /> */}
                    <br /><br />
                    <div className="signup_overflow">
                        <Icons.PersonVcard/>
                        <input ref={input_first_name} type="text" className="input-bg ps-4" placeholder="First Name" required/>
                        <br /><br />
                        <Icons.PersonVcard/>
                        <input ref={input_last_name} type="text" className="input-bg ps-4" placeholder="Last Name" required/>
                        <br /><br />
                        <Icons.Inbox/>
                        <input ref={input_mail} type="email" className="input-bg ps-4" placeholder="Email"  required/>
                        <br /><br />
                        <Icons.Person/>
                        <input ref={input_username} type="text" className="input-bg ps-4" placeholder="UserName"  required/>
                        <br /><br />
                        <div className="position-relative">
                            <div className="position-absolute end-0">
                                {view===false ? 
                                <div onClick={()=>{toggle_password_type();}}>
                                    <Icons.Eye />
                                </div>
                                    :
                                <div onClick={()=>{toggle_password_type();}}> 
                                    <Icons.EyeSlash />
                                </div>}
                            </div>
                        </div>
                        <Icons.ShieldLock/>
                        <input ref={input_password} type="password" className="input-bg ps-4" placeholder="Password"  required/>
                        <br /><br />
                        <Icons.Phone/>
                        <input ref={input_contact} type="number" className="input-bg ps-4" placeholder="Contact" required/>
                        <br /><br />
                        <Icons.Image/>
                        <input ref={input_image} type="file" className="input-bg ps-4" placeholder="Image"  required/>
                    </div>
                    <br /><br />
                    <div className="d-flex">
                        <div className="justify-content-between">
                            <button type="submit" className="btn color-footer-bg btn px-2">Sign Up <Icons.ArrowRightShort/></button>
                            <Link to="/">
                                <small style={{textDecoration:'underline',padding:'0 10px',cursor:'pointer',color:'white'}}>Already Have an Account ? </small>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>
}