import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const Protected = () => {
    const dispatch = useDispatch();
    dispatch({ type: "END_LOADING" });
    const isLoggedIn = ( JSON.parse(localStorage.getItem("profile"))) !== null ? true : false;
    console.log("local ", JSON.parse(localStorage.getItem("profile")));
    
        useEffect(()=>{
            if (!isLoggedIn) {
                toast.error("Not authorized, Please Login");
                return <Navigate to={"/login"} replace />;
            }
        },isLoggedIn);
    return <Outlet />;
};

export default Protected;
