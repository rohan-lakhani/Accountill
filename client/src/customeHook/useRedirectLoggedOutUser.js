import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { getLoginStatus } from '../services/authServices';
import { toast } from "react-toastify";

const useRedirectLoggedOutUser = (path) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.auth.isLoading);

    if (isLoading) {
        dispatch({ type: "END_LOADING" });
    }

    const isLoggedIn = JSON.parse(localStorage.getItem("profile"));
    useEffect(() => {
        const redirectLoogedOutUser =  () => {
            if (!isLoggedIn) {
                // toast.error("Not authorized, Please Login");
                navigate(path);
                return;
            }
        };
        redirectLoogedOutUser();
    }, []);
};

export default useRedirectLoggedOutUser;
