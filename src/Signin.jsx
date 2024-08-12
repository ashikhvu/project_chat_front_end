import React, { useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Signin.css'
import * as Icons from 'react-bootstrap-icons'
import logo from './images/logo.png'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import config from "./Config.js";

const Signin=()=>{

    const navigate = useNavigate()

    return <>
        <div className="card-bg rounded">
            <div className="row m-0" style={{height:'100vh',width:'100%'}}>
                <div className="col-lg-6 col-sm-12 h-100">
                    <div style={{display:'flex',flexDirection:'column',height:'100vh'}}>
                        <div style={{flex:1}} className="p-5">
                            <img width={'75rem'} src={logo} alt="no" />
                        </div>
                        <div style={{bottom:'2rem'}}>
                            <h1 className="ps-5 ts text-light shadow-bg pt-2" style={{fontWeight:'300'}}>Already Have an Account ?</h1>
                            <p className="ps-5 ts mb-0 shadow-bg">Log In to Experience the Paradise of Chat, <span className="color-footer">"Experience Chat Like Never Before. Connect, Share, and Enjoy Seamlessly."</span></p>
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
                    <LoginCard navigate={navigate}/>
                </div>
            </div>
        </div>
    </>
}

export default Signin;

const LoginCard=({navigate})=>{

    const formRef = useRef(null)
    const input_username = useRef(null)
    const input_password = useRef(null)

    const [view, setView] = useState(false);

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

    const handle_submit=(e)=>{

        e.preventDefault()
        const signin_form = new FormData(formRef.current)
        signin_form.append('username',input_username.current.value)
        signin_form.append('password',input_password.current.value)

        if(input_username && input_password)
        {
            axios.post(`${config.baseurl}/signin`,signin_form)
            .then((res)=>{
                if(res.data.error)
                {
                    alert(res.data.error);
                }
                else{
                    formRef.current.reset();
                    localStorage.setItem('auth_token',res.data.token)
                    navigate('/home')
                }
            })
            .catch((error)=>{
                alert('user registration failed');
                console.log(error);
            })
        }
    }


    return <>
        <div className="place-center" style={{height:'75vh'}}>
            <div className="mt-5 ms-3">
                <form onSubmit={handle_submit} ref={formRef} action="post" className="form-card">
                    <h2 style={{fontWeight:'400'}} className="text-start ps-2">Sign In</h2>
                    {/* <hr /> */}
                    <br /><br />
                    <Icons.Person/>
                    <input type="text" ref={input_username} className="input-bg ps-4" placeholder="UserName" required/>
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
                    <input type="password" ref={input_password} className="input-bg ps-4" placeholder="Password" required/>
                    <br /><br /><br />
                    <div className="d-flex">
                        <div className="justify-content-between">
                            <button type="submit" className="btn color-footer-bg btn px-2">Sign In <Icons.ArrowRightShort/></button>
                            <Link to="/signup">
                                <small style={{textDecoration:'underline',padding:'0 10px',cursor:'pointer',color:'white'}}>Don't Have an Account ? </small>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>
}