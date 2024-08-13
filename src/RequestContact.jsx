import React,{createContext, useContext, useEffect, useRef, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Home.css'
import * as Icons from 'react-bootstrap-icons'
import tony from './images/tony.jpg'
import { useNavigate } from "react-router-dom";
import empty_user from './images/empty_user.png'
import axios, { all } from "axios";
import config from "./Config.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "./Home.jsx";


const RequestContact=(props)=>{
    
    const {FecthAllData,contact_set,set_contact_set,chat,setChat,user_data, setUserData,request_status,set_request_status,chat_header_data,set_chat_header_data,chat_header_name,set_chat_header_name,chat_header_image,set_chat_header_image,chat_header_about,set_chat_header_about} = useContext(UserContext);
    
    const fetch_selected_user_data=(id)=>{
        const token = localStorage.getItem('auth_token')
        const headers = {
            "Authorization": `Token ${token}`
        }
        axios.get(`${config.baseurl}/get_user_data?id=${id}`,{headers:headers})
            .then((res)=>{
                console.log(res.data)
                set_chat_header_data(res.data)
                set_chat_header_name(res.data.name)
                set_chat_header_image(res.data.image)
                set_chat_header_about(res.data.about)
                fetch_selected_user_request_status(res.data.id)
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    const fetch_selected_user_request_status=(id)=>{
        const token = localStorage.getItem('auth_token')
        const headers = {
            "Authorization": `Token ${token}`
        }
        axios.get(`${config.baseurl}/send_request?req_from=${user_data.id}&req_to=${id}`,{headers:headers})
            .then((res)=>{
                if(res.data.error)
                {
                    set_request_status(true)
                    setChat(false)
                }
                else{
                    console.log(res)
                    set_request_status(false)
                    if(res.data.status==="accepted")
                    {
                        setChat(true)
                    }
                    else{
                        setChat(false)
                    }
                }
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    const accept_request=(id)=>{
        const token = localStorage.getItem('auth_token')
        const headers = {
            "Authorization": `Token ${token}`
        }
        axios.put(`${config.baseurl}/accept_request`,{
            req_from:user_data.id,
            req_to:id,
            status:'accepted',
        }
        ,{headers:headers})
            .then((res)=>{
                if(res.data.error)
                {
                    alert('failed')
                }
                else{
                    set_contact_set('all')
                    FecthAllData();
                }
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    const reject_request=()=>{
        const token = localStorage.getItem('auth_token')
        const headers = {
            "Authorization" : `Token ${token}`
        }
        
        axios.delete(`${config.baseurl}/send_request`, {
            data: {
                req_from: chat_header_data.id,
                req_to: user_data.id,
                status: 'default'
            },
            headers: headers
        })
        .then((res) => {
            if (res.data.error) {
                alert('Request Failed.');
            } else {
                set_contact_set('all')
                FecthAllData();
                set_request_status(!request_status)
                console.log(res.data);
            }
        })
        .catch((error) => {
            console.log(error);
        });

    }

    return <>
        <div className="position-relative">
            <div className="position-absolute end-0 top-50 translate-middle-y" style={{marginTop:'1.5rem'}}>
                <div className="badge small badge-size-btn1 me-1" onClick={()=>{accept_request(props.id)}}><small><small>Accept</small></small></div><br />
                <div className="badge small badge-size-btn" onClick={()=>{reject_request(props.id)}}><small><small>Reject</small></small></div>
            </div>
        </div>
        <div className="contact">
            <div className="d-flex">
                <img className="profile-pic2" src={`${config.baseurl}${props.image}`} alt="no" />
                <div className="contact-content">
                    <h6 className="contact-title1 text-capitalize" >{props.name}</h6>
                    <h6 className="contact-title2 text-capitalize" >{props.about}</h6>
                </div>
            </div>
            <hr className="hr-0"/>
        </div>
    </>
}

export default RequestContact;