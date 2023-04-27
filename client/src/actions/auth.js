import * as api from '../api/index'
import { AUTH, CREATE_PROFILE, END_LOADING, START_LOADING } from './constants'
import { toast } from 'react-toastify';


export const signin =(formData) => async(dispatch) => {

    try {
        dispatch({ type: START_LOADING });
        //login the user
        const { data } = await api.signIn(formData);

        dispatch({ type: AUTH, data });
        // window.location.reload();
        dispatch({ type: END_LOADING });
        toast.success("Signin successfull");
        // window.location.href="/dashboard";
    } catch (error) {
        // console.log(error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
        dispatch({ type: END_LOADING })
    }
}

export const signup =(formData) => async(dispatch) => { 
    try {
        dispatch({ type: START_LOADING })
        //Sign up the user
        const { data } = await api.signUp(formData)
        console.log(data);
        dispatch({ type: AUTH, data});
        const { info } = await api.createProfile({name: data?.result?.name, email: data?.result?.email, userId: data?.result?._id, phoneNumber: '', businessName: '', contactAddress: '', logo: '', website: '', paymentDetails: ''});
        dispatch({ type: CREATE_PROFILE, payload: info });
        dispatch({ type: END_LOADING })
        toast.success("Sign up successfully")
        // window.location.reload();
        // window.location.href="/dashboard"
    } catch (error) {
        toast.error(error?.response?.data?.message)
        dispatch({ type: END_LOADING })
    }
}

export const forgot =(formData) => async(dispatch) => {
    try {
        await api.forgot(formData)
        toast.success("Reset Email Sent");
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
    }
}


export const reset =(formData) => async(dispatch) => {
    try {
        await api.reset(formData)
        toast.success("Password reset successfully");
        window.location.href="/login"
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
    }
}

//LOGOUT USER
export const logoutUser = async (dispatch) => {
    try{
        await api.logout();
    }catch(error){
        const message =(error.response && error.response.data && error.response.data.message) ||error.message ||error.toString();
        toast.error(message);
    }

}

//GET LOGIN STATUS
export const getLoginStatus = async () => {
    try{
        const response = await api.loginStatus();
        return response.data;
    }catch(error){
        console.log("error");
        const message =(error.response && error.response.data && error.response.data.message) ||error.message ||error.toString();
        console.log(message);
        // toast.error(message);
    }
}
