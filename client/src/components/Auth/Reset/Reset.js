import React, { useState } from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from 'react-router-dom';
import { reset } from "../../../actions/auth.js";
import { useDispatch } from 'react-redux';


  const initialState = {
    password: "",
    password2: "",
  };

const Reset = () => {

    const [form, setForm] = useState("");
    // const { password, password2 } = formData;
    const { resetToken } = useParams();
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        setForm(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(reset({ password: form, token: resetToken}))   
    }
  return (
    <div>
        <div className='flex justify-center items-center h-[90vh]'>
                <button className='btn btn-outline btn-primary btn-sm text-lg font-normal mr-1 mt-2 rounded-2xl normal-case absolute top-14 left-1'>
                    <Link to="/" className='text-primary hover:text-white'>Back</Link>
                </button>
                <div class="p-4 w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/4 bg-slate-700 rounded-xl">
                <form class="form-control flex justify" onSubmit={handleSubmit}>
                    <input type="password" placeholder="New Password" required name='password' onChange={handleInputChange} class="input"/>
{/* 
                    <input type="password" placeholder="Confrim Password" required name='password2' onChange={handleInputChange} class="input mt-2"/> */}

                    <div className='flex justify-center'>
                    <button className='btn btn-sm text-lg mt-4 pb-1 normal-case bg-blue-600 text-white
                        hover:bg-blue-400 hover:text-black shadow-md shadow-blue-300 border-none' type='submit'>Reset Password</button>
                    </div>
                </form>
                </div>
            </div>
        
    </div>
  )
}

export default Reset
