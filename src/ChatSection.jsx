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
import {ChatHeader, ChatRight, ChatLeft} from './Home.jsx'



const ChatSection=(props)=>{

    const {get_all_msg,chat_messages, set_chat_messages,FecthAllData,contact_set,set_contact_set,chat,setChat,user_data, setUserData,request_status,set_request_status,chat_header_data,set_chat_header_data,chat_header_name,set_chat_header_name,chat_header_image,set_chat_header_image,chat_header_about,set_chat_header_about} = useContext(UserContext);

    const input_msg = useRef('')

    const send_msg=(e)=>{
        e.preventDefault();
        const token = localStorage.getItem('auth_token')
        const headers = {
            "Authorization" : `Token ${token}`
        }
        if(input_msg.current.value!=='')
        {
            axios.post(`${config.baseurl}/send_msg`, 
            {
                from_user: user_data.id,
                to_user: chat_header_data.id,
                msg: input_msg.current.value
            },
            {headers: headers}
            )
            .then((res) => {
                if (res.data.error) {
                    alert('Sending Failed.')
                } else {
                    set_contact_set('all')
                    // FecthAllData();
                    set_request_status(!request_status)
                    console.log(res.data);
                    input_msg.current.value = ''
                    get_all_msg(null)
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }
        
    }

    

    return <>
        <div style={{display:'flex',flexDirection:'column',height:'100vh'}}>
            <div className="">
                <div style={{flex:1}}>
                    <ChatHeader 
                        chat_header_data={props.chat_header_data}
                        set_chat_header_data={props.set_chat_header_data}
                        chat_header_name={props.chat_header_name}
                        set_chat_header_name={props.set_chat_header_name}
                        chat_header_image={props.chat_header_image}
                        set_chat_header_image={props.set_chat_header_image}
                        chat_header_about={props.chat_header_about}
                        set_chat_header_about={props.set_chat_header_about}
                    />
                    <div className="chat-overflow">
                        {chat_messages&&chat_messages.map((i)=>(
                            <div key={i.id}>
                                {user_data.id && user_data.id===i.from_user.id?<ChatLeft msg={i.msg} time={i.create_at}/>:<ChatRight msg={i.msg} time={i.create_at}/>}
                            </div>
                        ))}
                        
                    </div> 
                </div>
                <div style={{flex:0,marginBottom:'1rem'}}>
                    <hr  className="hr-0"/>
                    <form action="post" onSubmit={(e)=>{send_msg(e)}}>
                        <div className="d-flex mt-3 justify-content-between">
                            <div className="d-flex w-100">
                                <Icons.Image className="me-3 mt-2"/>
                                <Icons.Camera className="me-3 mt-2 cam-icon-size"/>
                                <Icons.Mic className="me-3 mt-2"/>
                                <input ref={input_msg} className="ps-2 search-bar2 text-light" type="text" placeholder="Type Here ...." required/>
                            </div>
                            <div className="d-flex">
                                <Icons.EmojiExpressionless className="ms-3 mt-2 me-3"/>
                                <button type="submit" className="chat-send-btn"><Icons.Send/></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}

export default ChatSection;