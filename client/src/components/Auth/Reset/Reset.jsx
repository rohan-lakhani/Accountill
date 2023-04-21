import React, { useState } from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { reset, forgot } from "../../../actions/auth";
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../Spinner/Spinner';
import { END_LOADING, START_LOADING } from '../../../actions/constants';

const initialState = {
  password: "",
  password2: "",
};

const Reset = () => {

  // const classes = useStyles();
  const [form, setForm] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { password, password2 } = formData;
  const user = JSON.parse(localStorage.getItem('profile'));


  const handleSubmit = (e) => {
    e.preventDefault();

    if(!password || !password2){
      return toast.error("All fields are required");
  }
  if(password.length < 6){
      return toast.error("Password must be up to 6 characters");
  }
  if(password !== password2){
      return toast.error("Passwords do not match");
  }

    dispatch(reset({ password: password, token: token}))
  }

  // const handleChange = (e) => setForm(e.target.value);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
}
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  if(user){
    navigate('/dashboard');
  }


  return (
    <div>
        <div className='flex justify-center items-center h-[90vh]'>
                <button className='btn btn-outline btn-primary btn-sm text-lg font-normal mr-1 mt-2 rounded-2xl normal-case absolute top-14 left-1'>
                    <Link to="/" className='text-primary hover:text-white'>Back</Link>
                </button>
                <div class="p-4 w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/4 bg-slate-700 rounded-xl">
                <form class="form-control flex justify" onSubmit={handleSubmit}>
                    <input type="password" placeholder="New Password" required name='password' onChange={handleChange} class="input"/>

                    <input type="password" placeholder="Confrim Password" required name='password2' onChange={handleChange} class="input mt-2"/>

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
