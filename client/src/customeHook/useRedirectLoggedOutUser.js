import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { getLoginStatus } from '../services/authServices';
import { toast } from "react-toastify";
import { getLoginStatus, logoutUser } from "../actions/auth";
import { AUTH, LOGOUT, END_LOADING } from "../actions/constants";

const useRedirectLoggedOutUser = (path) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const redirectLoogedOutUser = async () => {
        // const isLoggedIn = await getLoginStatus();

        const isLoggedIn = localStorage.getItem("profile");

        console.log(isLoggedIn);

        if (!isLoggedIn) {
            navigate(path);
            return;
        }
    };

    useEffect(() => {
        redirectLoogedOutUser();
    }, [navigate, path, dispatch]);
};

export default useRedirectLoggedOutUser;
