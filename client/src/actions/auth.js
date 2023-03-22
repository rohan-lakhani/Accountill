import * as api from '../api/index'
import { AUTH, CREATE_PROFILE } from './constants'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



export const signin =(formData, setLoading) => async(dispatch) => {

    try {
        //login the user
        const { data } = await api.signIn(formData)
        console.log("data", data);

        dispatch({ type: AUTH, data })
        // setLoading(false)
        toast.success("Signin successfull")
        // history.push('/dashboard')
        window.location.href="/dashboard"

    } catch (error) {
        // console.log(error?.response?.data?.message)
        toast.error(error?.response?.data?.message)
        setLoading(false)
    }
}

export const signup =(formData, setLoading) => async(dispatch) => {   

    try {
        //Sign up the user
        const { data } = await api.signUp(formData)
        dispatch({ type: AUTH, data})
        const { info } = await api.createProfile({name: data?.result?.name, email: data?.result?.email, userId: data?.result?._id, phoneNumber: '', businessName: '', contactAddress: '', logo: '', website: ''});
        dispatch({ type: CREATE_PROFILE, payload: info });
        window.location.href="/dashboard"
        // history.push('/dashboard')
        toast.success("Sign up successfull")

    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
        setLoading(false)
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
    const navigate = useNavigate();
    try {
        await api.reset(formData)
        navigate('/dashboard');

    } catch (error) {
        alert(error)
    }
}

//LOGOUT USER
export const logoutUser = async () => {
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
        // console.log("response="+response);
        // console.log(response.data);
        return response.data;
    }catch(error){
        console.log("error");
        const message =(error.response && error.response.data && error.response.data.message) ||error.message ||error.toString();
        console.log(message);
        // toast.error(message);
    }
}
