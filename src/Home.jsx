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
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCamera, faCoffee,faBrands } from '@fortawesome/free-solid-svg-icons';

export const UserContext = createContext();

const Home=()=>{

    const navigate = useNavigate()

    // const [info, setInfo] = useState(true);
    const [chat,setChat] = useState(false);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);

    const [prof_name, setProfName] = useState(null)
    const [prof_image, setProfImage] = useState(empty_user)

    const [user_data, setUserData] = useState(null)
    const input_fname = useRef(null)
    const input_lname = useRef(null)
    const input_username = useRef(null)
    const input_about = useRef(null)
    const input_email = useRef(null)
    const input_contact = useRef(null)
    
    const input_search = useRef('')

    const [alluser, setAlluser] = useState(null) 

    const [chat_header_data, set_chat_header_data] = useState(null)
    const [chat_header_name, set_chat_header_name] = useState(null)
    const [chat_header_image, set_chat_header_image] = useState('')
    const [chat_header_about, set_chat_header_about] = useState(null)

    const [request_status,set_request_status] = useState(true)

    const [contact_set,set_contact_set] = useState('all')

    const LogoutUser=()=>{
        localStorage.removeItem('auth_token')
        navigate('/')
    }
    
    const FecthData=()=>{

        const token = localStorage.getItem('auth_token')
        const headers = {
            "Authorization" : `Token ${token}`
        }

        axios.get(`${config.baseurl}/get_user_data`,{headers:headers})
        .then((res)=>{
            console.log(res.data)
            setProfName(`${res.data.name[0].toUpperCase()}${res.data.name.slice(1)}`)
            if(res.data.image)
            {
                setProfImage(`${config.baseurl}${res.data.image}`)
            }
            else{
                setProfImage(empty_user)
            }
            setUserData(res.data)
            input_fname.current.value = `${res.data.first_name[0].toUpperCase()}${res.data.first_name.slice(1)}`
            input_lname.current.value = res.data.last_name
            input_username.current.value = res.data.username
            input_about.current.value = res.data.about
            input_email.current.value = res.data.email
            input_contact.current.value = res.data.contact
        })
        .catch((error)=>{
            if(error.data)
            {
                console.log(error.data)
            }
        })
    }

    const FecthAllData=()=>{

        const token = localStorage.getItem('auth_token')
        const headers = {
            "Authorization" : `Token ${token}`
        }

        axios.get(`${config.baseurl}/get_all_user_data`,{headers:headers})
            .then((res)=>{
                if(res.data.error)
                {
                    alert('No Users Are Available')
                    toast.info('No Users Are Available!', {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "dark",
                        });
                }   
                else{
                    console.log(res.data)
                    setAlluser(res.data)
                    set_chat_header_data(res.data[0])
                    set_chat_header_name(`${res.data[0].name}`)
                    set_chat_header_image(`${res.data[0].image}`)
                    set_chat_header_about(`${res.data[0].about}`)
                    // getting request status of the first contact when the page is first load
                    const element = document.getElementsByClassName('contact_id')
                    if(element.length>0)
                    {
                        element[0].click();
                    }
                }
            })
            .catch((error)=>{
                if(error.data)
                {
                    console.log(error.data)
                    
                }
            })
        }

        const handleSearch=()=>{
            const token = localStorage.getItem('auth_token')
            const headers = {
                "Authorization" : `Token ${token}`
            }
    
            axios.get(`${config.baseurl}/search_user?search_text=${input_search.current.value}`,{headers:headers})
            .then((res)=>{
                if(res.data.error)
                {
                    alert('No Users are available with that Name.')
                }
                else{
                    console.log(res.data)
                    setAlluser(res.data)
                }
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        
        useEffect(()=>{
            FecthData();
            FecthAllData();
            // if(info){
        //     document.getElementsByClassName('info-hider').classList = '';
        //     console.log('info');
        // }
    },[])

    return <>

        <ToastContainer />

        <div className="home-card text-light">
            <div className="row h-100 m-0">
                <div className="col-sm-12 col-lg-3 border-right">
                    <div className="d-flex justify-content-between">
                        <div className="d-flex">
                            <img className="profile-pic1" src={prof_image} alt="no" />
                            <h6 className="m-0 fw-bold custom-pad1">{prof_name?prof_name:'Name Here'}</h6>
                        </div>
                        <div className="m-0 pt-3 fw-bold custom-pad1">
                            <Icons.ThreeDots style={{marginLeft:'0.8rem'}}/>
                            <Icons.CameraVideo style={{marginLeft:'0.8rem'}}/>
                            <Icons.PencilSquare onClick={()=>{setShow(true);FecthData();}} style={{marginLeft:'0.8rem'}}/>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="w-100">
                            <div className="position-relative">
                                <div className="position-absolute" style={{marginLeft:'0.35rem',marginTop:'0.5rem'}}>
                                    <Icons.Search/>
                                </div>
                            </div>
                            <input onChange={handleSearch} ref={input_search} type="text" className="custom-pad2 mt-2 search-bar text-light" placeholder="search here ..." />
                        </div>
                        <div>
                            <button className="custom-add-button ms-2 mt-2 px-2" style={{paddingBottom:'0.25rem'}}><Icons.Plus color="white"/></button>
                        </div>
                    </div>

                    <div className="row m-0 p-0 mt-2">
                        <div className="col">
                            <div className="user_set" onClick={()=>{set_contact_set('all')}}><small>All</small></div>
                        </div>
                        <div className="col">
                            <div className="user_set" onClick={()=>{set_contact_set('requests')}}><small>Requests</small></div>
                        </div>
                        <div className="col">
                            <div className="user_set"onClick={()=>{set_contact_set('blocked')}}><small>Blocked</small></div>
                        </div>
                    </div>
                    
                    <div className="mt-3">
                        <div className="contact-overflow">
                            {alluser? alluser && alluser.map((i)=>(
                                <div key={i.id}>
                                    <UserContext.Provider value={{contact_set,set_contact_set,chat,setChat,user_data, setUserData,request_status,set_request_status,chat_header_data,set_chat_header_data,chat_header_name,set_chat_header_name,chat_header_image,set_chat_header_image,chat_header_about,set_chat_header_about}}>
                                        <Contact 
                                            id={i.id} 
                                            name={i.name} 
                                            about={i.about} 
                                            image={i.image}
                                            contact_set={contact_set}
                                            set_contact_set={set_contact_set}
                                            chat={chat}
                                            setChat={setChat}
                                            user_data={user_data} 
                                            setUserData={setUserData}
                                            request_status={request_status}
                                            set_request_status={set_request_status}
                                            chat_header_data={chat_header_data}
                                            set_chat_header_data={set_chat_header_data}
                                            chat_header_name={chat_header_name}
                                            set_chat_header_name={set_chat_header_name}
                                            chat_header_image={chat_header_image}
                                            set_chat_header_image={set_chat_header_image}
                                            chat_header_about={chat_header_about}
                                            set_chat_header_about={set_chat_header_about}/>
                                    </UserContext.Provider>
                                </div>
                            )) : 
                                <div>
                                    <h6 className="p-3 fw-light fw-italic"><i>Currently no Users available in this server</i></h6>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-lg-7 border-right info-wider">
                    
                    <MyModal 
                        show={show} 
                        setShow={setShow} 
                        Icons={Icons} 
                        prof_name={prof_name}
                        prof_image={prof_image}

                        input_fname={input_fname}
                        input_lname={input_lname}
                        input_username={input_username}
                        input_about={input_about}
                        input_email={input_email}
                        input_contact={input_contact}
                    />
                    <MyModal2 show1={show1} setShow1={setShow1} Icons={Icons}/>

                    { chat? 
                    <UserContext.Provider value={{contact_set,set_contact_set,chat,setChat,request_status,set_request_status,user_data, setUserData,chat_header_data,set_chat_header_data,chat_header_name,set_chat_header_name,chat_header_image,set_chat_header_image,chat_header_about,set_chat_header_about}}>
                        <ChatSection 
                            contact_set={contact_set}
                            set_contact_set={set_contact_set}
                            chat={chat}
                            setChat={setChat}
                            request_status={request_status}
                            set_request_status={set_request_status}
                            user_data={user_data}
                            setUserData={setUserData}
                            chat_header_data={chat_header_data}
                            set_chat_header_data={set_chat_header_data}
                            chat_header_name={chat_header_name}
                            set_chat_header_name={set_chat_header_name}
                            chat_header_image={chat_header_image}
                            set_chat_header_image={set_chat_header_image}
                            chat_header_about={chat_header_about}
                            set_chat_header_about={set_chat_header_about}
                        />
                    </UserContext.Provider>
                    :
                    <UserContext.Provider value={{contact_set,set_contact_set,chat,setChat,request_status,set_request_status,user_data, setUserData,chat_header_data,set_chat_header_data,chat_header_name,set_chat_header_name,chat_header_image,set_chat_header_image,chat_header_about,set_chat_header_about}}>
                        <RequestSendSection
                            contact_set={contact_set}
                            set_contact_set={set_contact_set}
                            chat={chat}
                            setChat={setChat}
                            request_status={request_status}
                            set_request_status={set_request_status}
                            user_data={user_data}
                            setUserData={setUserData}
                            chat_header_data={chat_header_data}
                            set_chat_header_data={set_chat_header_data}
                            chat_header_name={chat_header_name}
                            set_chat_header_name={set_chat_header_name}
                            chat_header_image={chat_header_image}
                            set_chat_header_image={set_chat_header_image}
                            chat_header_about={chat_header_about}
                            set_chat_header_about={set_chat_header_about}
                        />
                    </UserContext.Provider>}
                </div>
                <div className="col-sm-12 col-lg-2 info-hider">
                    <div style={{display:'flex',flexDirection:'column',height:'100vh'}}>
                        <div style={{flex:1}}>
                            <div className="text-center pt-3">
                                <img className="profile-pic4" src={chat_header_image?`${config.baseurl}${chat_header_image}`:`${empty_user}`} alt="no" />
                                <h6 className="contact-title mb-1">{chat_header_name?chat_header_name&&chat_header_name:'-----------'}</h6>
                                <h6 className="contact-title2">{chat_header_about?chat_header_about&&chat_header_about:'---------------------------------'}</h6>
                                <hr/>
                            </div>
                            <div className="chat-option" style={{cursor:'pointer'}}>
                                <div className="option-overflow">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-light fsize-1">Chat Settings</span>
                                        <Icons.ArrowDownCircle/>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-light fsize-1">Privacy & Help</span>
                                        <Icons.ArrowDownCircle/>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-light fsize-1">Saved Photos</span>
                                        <Icons.ArrowDownCircle/>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="fw-light fsize-1">Shared Files</span>
                                        <Icons.ArrowDownCircle/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <hr className="hr-0"/>
                            <button className="custom-btn-2-red mt-3 w-100 bg-gradient">Block User</button><br/>
                            <button onClick={LogoutUser} className="custom-btn-2-blue mt-3 w-100 bg-gradient">Logout</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </>
}

export default Home;

const Contact=(props)=>{

    const {chat,setChat,user_data, setUserData,request_status,set_request_status,chat_header_data,set_chat_header_data,chat_header_name,set_chat_header_name,chat_header_image,set_chat_header_image,chat_header_about,set_chat_header_about} = useContext(UserContext);

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

    return <>
        <div className="position-relative">
            <div className="position-absolute end-0 top-50 translate-middle-y" style={{marginTop:'1.5rem'}}>
                <div className="badge bg-success small badge-my"><small><small>{props.id}</small></small></div>
            </div>
        </div>
        <div className="contact contact_id" onClick={()=>{fetch_selected_user_data(props.id);}}>
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

const ChatHeader=()=>{

    const {chat_header_name,set_chat_header_name,chat_header_image,set_chat_header_image,chat_header_about,set_chat_header_about} = useContext(UserContext);

    return <>
        <div className="d-flex justify-content-between">
            <div className="d-flex">
                <img className="profile-pic1" src={chat_header_image?`${config.baseurl}${chat_header_image}`:`${empty_user}`} alt="no" />
                <div className="contact-content2">
                    <h6 className="contact-title3 text-capitalize" >{chat_header_name && chat_header_name}</h6>
                    <h6 className="contact-title4 text-capitalize" >{chat_header_about && chat_header_about}</h6>
                </div>
            </div>
            <div className="m-0 pt-3 fw-bold custom-pad1">
                <Icons.Telephone style={{marginLeft:'0.8rem'}}/>
                <Icons.CameraVideo style={{marginLeft:'0.8rem'}}/>
                <Icons.InfoCircle style={{marginLeft:'0.8rem'}}/>
            </div>
        </div>
        <hr className="hr-0"/>
    </>
}

const ChatRight=()=>{
    return <>
        <div className="d-flex justify-content-end">
            <div>
                <div className="ChatRight-msg bg-gradient">
                    <h6 className="ChatRight-msg-text">Hi how are you ?</h6>
                </div>
                <h6 className="ChatRight-time">10 minitues ago</h6>
            </div>
        </div>
    </>
}

const ChatLeft=()=>{
    return <>
        <div className="d-flex justify-content-start">
            <div className="ChatLeft-img">
                <img className="profile-pic3" src={tony} alt="no" />
            </div>
            <div>
                <div className="ChatLeft-msg">
                    <h6 className="ChatLeft-msg-text">Doing Great. Are you guys free tomorow ?</h6>
                </div>
                <h6 className="ChatLeft-time">10 minitues ago</h6>
            </div>
        </div>
    </>
}

const MyModal = (props) => {

    return <>

      <Modal show={props.show} onHide={()=>{props.setShow(false)}}>
        <Modal.Body className="bg-dark text-light rounded" >
            <div className="d-flex justify-content-between">
                <h5 className="pt-2">Profile</h5>
                <button className="btn-close bg-danger" onClick={()=>{props.setShow(false)}}></button>
            </div>
            <div className="text-center">

                <div className="position-relative">
                    <div className="position-absolute bottom-50 start-50 translate-middle-x" style={{marginBottom:'-0.5rem'}}>
                        <Icons.Camera className="fsize-2"/>
                    </div>
                    <img className="profile-pic5" src={props.prof_image} alt="no" />
                    <p className="red-text" style={{textDecoration:'underline'}}>Remove Image</p>
                </div>

                <table className="mx-auto text-start">
                    <tbody>
                        <tr>
                            <td className="pe-5">First Name </td>
                            <td>
                                : <input ref={props.input_fname}  className="plain-input ps-5" type="text" placeholder="First Name" />
                            </td>
                        </tr>
                        <tr>
                            <td className="pe-5">Last Name </td>
                            <td>
                                : <input ref={props.input_lname}  className="plain-input ps-5" type="text" placeholder="Last Name" />
                            </td>
                        </tr>
                        <tr>
                            <td className="pe-5">UserName </td>
                            <td>
                                : <input ref={props.input_username}  className="plain-input ps-5" type="text" placeholder="Tony Stark" />
                            </td>
                        </tr>
                        <tr>
                            <td>About </td>
                            <td>
                                : <input ref={props.input_about}  className="plain-input ps-5" type="text" placeholder="Hey There I am Using C-hat" />
                            </td>
                        </tr>
                        <tr>
                            <td>Email </td>
                            <td>
                                : <input ref={props.input_email}  className="plain-input ps-5" type="email" placeholder="user@gmail.com" />
                            </td>
                        </tr>
                        <tr>
                            <td>Contact </td>
                            <td>
                                : <input ref={props.input_contact}  className="plain-input ps-5" type="number" placeholder="+91 9859659847" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br /><br />
            <div className="d-flex justify-content-end ">
                <Button variant="secondary" onClick={()=>{props.setShow(false)}}>
                    Close
                </Button>
                <Button variant="primary" className="ms-2" onClick={()=>{props.setShow(false)}}>
                    Save Changes
                </Button>
            </div>
        </Modal.Body>
      </Modal>
    </>
};


const MyModal2 = ({show1, setShow1,Icons}) => {

    return <>

      <Modal show={show1} onHide={()=>{setShow1(false)}}>
        <Modal.Body className="bg-dark text-light rounded" >
            <div className="d-flex justify-content-between">
                <h5 className="pt-2">Add Person</h5>
                <button className="btn-close" onClick={()=>{setShow1(false)}}></button>
            </div>
            <div className="text-center">

                <div className="position-relative">
                    <div className="position-absolute bottom-50 start-50 translate-middle-x" style={{marginBottom:'-0.5rem'}}>
                        <Icons.Camera className="fsize-2"/>
                    </div>
                    <img className="profile-pic5" src={tony} alt="no" />
                    <p className="red-text">Remove</p>
                </div>

                <table className="mx-auto text-start">
                    <thead>
                        <th></th>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="pe-5">Name </td>
                            <td>
                                : <input className="plain-input ps-5" type="text" placeholder="Tony Stark" />
                            </td>
                        </tr>
                        <tr>
                            <td>About </td>
                            <td>
                                : <input className="plain-input ps-5" type="text" placeholder="Hey There I am Using C-hat" />
                            </td>
                        </tr>
                        <tr>
                            <td>Contact </td>
                            <td>
                                : <input className="plain-input ps-5" type="number" placeholder="+91 9859659847" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br /><br />
            <div className="d-flex justify-content-end ">
                <Button variant="secondary" onClick={()=>{setShow1(false)}}>
                    Close
                </Button>
                <Button variant="primary" className="ms-2" onClick={()=>{setShow1(false)}}>
                    Save Changes
                </Button>
            </div>
        </Modal.Body>
      </Modal>
    </>
};


const ChatSection=(props)=>{
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
                        <ChatRight/>
                        <ChatLeft/>

                        <ChatRight/>
                        <ChatLeft/>

                        <ChatRight/>
                        <ChatLeft/>

                        <ChatRight/>
                        <ChatLeft/>

                        <ChatRight/>
                        <ChatLeft/>
                    </div> 
                </div>
                <div style={{flex:0,marginBottom:'1rem'}}>
                    <hr  className="hr-0"/>
                    <div className="d-flex mt-3 justify-content-between">
                        <div className="d-flex w-100">
                            <Icons.Image className="me-3 mt-2"/>
                            <Icons.Camera className="me-3 mt-2 cam-icon-size"/>
                            <Icons.Mic className="me-3 mt-2"/>
                            <input className="ps-2 search-bar2 text-light" type="text" placeholder="Type Here ...."/>
                        </div>
                        <div className="d-flex">
                            <Icons.EmojiExpressionless className="ms-3 mt-2 me-3"/>
                            <button className="chat-send-btn"><Icons.Send/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

const RequestSendSection=()=>{

    const {chat,setChat,request_status,set_request_status,user_data,chat_header_data,set_chat_header_data,chat_header_name,set_chat_header_name,chat_header_image,set_chat_header_image,chat_header_about,set_chat_header_about} = useContext(UserContext);

    const send_request=()=>{
        set_request_status(!request_status)
        const token = localStorage.getItem('auth_token')
        const headers = {
            "Authorization" : `Token ${token}`
        }

        axios.post(`${config.baseurl}/send_request`,{'req_from':user_data.id,'req_to':chat_header_data.id,'status':'send'},{headers:headers})
        .then((res)=>{
            if(res.data.error)
            {
                alert('Request Failed.')
            }
            else{
                console.log(res.data)
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const cancel_request=()=>{
        set_request_status(!request_status)
        const token = localStorage.getItem('auth_token')
        const headers = {
            "Authorization" : `Token ${token}`
        }

        axios.delete(`${config.baseurl}/send_request`, {
            data: {
                req_from: user_data.id,
                req_to: chat_header_data.id,
                status: 'default'
            },
            headers: headers
        })
        .then((res) => {
            if (res.data.error) {
                alert('Request Failed.');
            } else {
                console.log(res.data);
            }
        })
        .catch((error) => {
            console.log(error);
        });

    }

    return <>
        <div style={{display:'flex',flexDirection:'column',height:'100vh'}}>
            <div className="">
                <div style={{flex:1}}>
                    <ChatHeader/>
                    <div className="chat-overflow">
                        <br /><p></p>
                        <div className="text-center">
                            <img className="profile-pic6 mt-5" src={chat_header_image?`${config.baseurl}${chat_header_image}`:`${empty_user}`} alt="no" /><br />
                            {request_status && request_status?
                            <button onClick={(e)=>{send_request();}} className="mt-3 custom-btn-3-blue">Send Request</button>
                            :
                            <button onClick={(e)=>{cancel_request();}} className="mt-3 custom-btn-3-red">Cancel Request</button>
                            }
                        </div>
                    </div> 
                </div>
                <div style={{flex:0,marginBottom:'1rem'}}>
                    <hr  className="hr-0"/>
                    <div className="d-flex mt-3 justify-content-between">
                        <div className="d-flex w-100">
                            <Icons.Image className="me-3 mt-2"/>
                            <Icons.Camera className="me-3 mt-2 cam-icon-size"/>
                            <Icons.Mic className="me-3 mt-2"/>
                            <input disabled className="ps-2 search-bar2 text-light" type="text" placeholder="Type Here ...."/>
                        </div>
                        <div className="d-flex">
                            <Icons.EmojiExpressionless className="ms-3 mt-2 me-3"/>
                            <button className="chat-send-btn"><Icons.SendSlash/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}