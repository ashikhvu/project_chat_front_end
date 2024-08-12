import React from "react";
import { Navigate,Outlet } from "react-router-dom";

const LoginRoute=()=>{
    const token = localStorage.getItem('auth_token')

    return <>
        {token? <Outlet></Outlet>:<Navigate to=""></Navigate>}
    </>
}

export default LoginRoute;