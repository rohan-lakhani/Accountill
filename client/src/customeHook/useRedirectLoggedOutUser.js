import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { getLoginStatus } from '../services/authServices';
import { toast } from 'react-toastify';
import { getLoginStatus, logoutUser } from '../actions/auth';
import { AUTH, LOGOUT, END_LOADING } from '../actions/constants';


const useRedirectLoggedOutUser = (path) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const redirectLoogedOutUser = async() => {
            const isLoggedIn = await getLoginStatus();          

            if(!isLoggedIn) {
                await logoutUser();
                await dispatch({ type: LOGOUT });
                // toast.info("Session expired, please login to continue.");
                dispatch({ type: END_LOADING })
                navigate(path);
                return;
            }
    };
    redirectLoogedOutUser();
    }, [navigate, path, dispatch]);
};

export default useRedirectLoggedOutUser;
