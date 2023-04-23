import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { forgot } from "../../../actions/auth";
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../Spinner/Spinner';

const Forgot = () => {
    const [form, setForm] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("profile"));

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(forgot({email: form}));
    }

    const handleChange = (e) => setForm(e.target.value);

    useEffect(() => {
        if(user!=null) {
          navigate('/dashboard')
        }
      }, [])

  return (
    <div>
        <div className='flex justify-center items-center h-[90vh]'>
                <button className='btn btn-outline btn-primary btn-sm text-lg font-normal mr-1 mt-2 rounded-2xl normal-case absolute top-14 left-1'>
                    <Link to="/" className='text-primary hover:text-white'>Back</Link>
                </button>
                <div class="p-4 w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/4 bg-slate-700 rounded-xl">
                <form class="form-control flex justify" onSubmit={handleSubmit}>
                    <div className='flex justify-center'>
                        <h1 className='font-bold text-center text-white mb-4'>Enter your email, we will send you password reset link</h1>
                    </div>

                    <input type="email" placeholder="Email" required name='email' onChange={handleChange} class="input"/>

                    <div className='flex justify-center'>
                    <button className='btn btn-sm text-xl mt-4 pb-1 normal-case bg-blue-600 text-white
                        hover:bg-blue-400 hover:text-black shadow-md shadow-blue-300 border-none' type='submit'>Submit</button>
                    </div>
                </form>
                </div>
            </div>
    </div>
  )
}

export default Forgot
