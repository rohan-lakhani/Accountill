import React, { useEffect, useState } from 'react';
// import useRedirectLoggedOutUser from '../../customeHook/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';



import { Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {useTheme} from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import MailIcon from '@mui/icons-material/Mail';
import { getProfilesByUser, updateProfile } from '../../../actions/profile';

const useStyles = makeStyles(() => ({
    root: {
      width: '100%',
      maxWidth: 450,
      // backgroundColor: "#EEEEEE",
    },
    large: {
      width: useTheme().spacing(12),
      height: useTheme().spacing(12),
    },
  }));

const Form = () => {
    const user = JSON.parse(localStorage.getItem('profile'))
    const initalState = {
        name: '', 
        email: '',
        phoneNumber: '',
        businessName: '',
        contactAddress: '', 
        logo: '',
        paymentDetails: ''
    }
    const [form,setForm] = useState(initalState);
    const location = useLocation();
    const dispatch = useDispatch();
    const { profiles } = useSelector((state) => state.profiles)
    console.log(profiles)
    const [switchEdit, setSwitchEdit] = useState(0);
    const classes = useStyles();

    useEffect(() => {
        if(switchEdit === 1) {
          setForm(profiles)
        }
      },[switchEdit])

      useEffect(() => {
        dispatch(getProfilesByUser({ search: user?.result?._id}))
      },[location, switchEdit])

      localStorage.setItem('profileDetails',JSON.stringify({...profiles}))

      const handleSubmit = async(e) => {
        e.preventDefault();
          await dispatch(updateProfile(profiles?._id, form));
          setSwitchEdit(0)
    
      };
    
      const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

      return (
        <div className='ml-16 pb-4 bg-gray-200' style={{minHeight: "92.7vh"}}>
          <div className='mx-6 pt-6'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold'>Profile Settings</h1>
                <h1 className='mt-2'>Edit your business profile</h1>
            </div>
            <div className='bg-white border-2 border-gray-400 rounded-md p-4 w-1/3 mx-auto mt-6'>
              <div className='mx-auto border-b-2 border-gray-400 pb-6'>
                <Avatar alt={profiles?.businessName} src={profiles?.logo?.filePath} sx={{ width: 75, height: 75, border:"2px #9ca3af solid" }} style={{margin:"auto", fontSize:"50px"}} className={classes.large}/>
              </div>
              {switchEdit === false ? (
                <div className='mt-4'>
                  <div className='flex flex-col'>
    
                      <div className='flex my-1'>
                        <BusinessCenterIcon/>
                        <h1 className='ml-6 text-lg'>{profiles?.businessName}</h1>
                      </div>
    
                      <div className='flex my-1'>
                        <LocationOnIcon/>
                        <h1 className='ml-6 text-lg'>{profiles?.contactAddress}</h1>
                      </div>
    
                      <div className='flex my-1'>
                        <PhoneInTalkIcon/>
                        <h1 className='ml-6 text-lg'>{profiles?.phoneNumber}</h1>
                      </div>
    
                      <div className='flex my-1'>
                        <MailIcon/>
                        <h1 className='ml-6 text-lg'>{profiles?.email}</h1>
                      </div>
                  </div>
    
                  <div className='flex justify-center'>
                  <button className="btn btn-sm text-2xl mt-4 normal-case bg-blue-600 text-white
                  hover:bg-blue-400 border-none hover:text-black w-full h-12" type='submit' onClick={() => setSwitchEdit()} >Edit Profile</button>
                  </div>
                </div>
              ):(
                <div className='mt-4'>
                    <form onSubmit={handleSubmit}>
                    <input type="file" className="file-input file-input-bordered w-full max-w-full mt-2" name='logo' />
    
                    <div className='flex justify-between my-4'>
    
                    <TextField
                    label="Phone Number"
                    type="text"
                    name='phoneNumber'
                    value={form?.phoneNumber || ""}
                    onChange={handleChange}
                    sx={{width:"100%"}}
                    />
                    </div>
    
                    <div className='my-4'>
                      <TextField
                      label="Business Name"
                      type="text"
                      name='businessName'
                      value={form?.businessName || ""}
                      onChange={handleChange}
                      sx={{width:"100%"}}
                      />
                    </div>
                    <div className='my-4'>
                      <TextField
                      label="Contact Address"
                      type="text"
                      name='contactAddress'
                      value={form?.contactAddress || ""}
                      onChange={handleChange}
                      sx={{width:"100%"}}
                      />
                    </div>
                    <div className='flex justify-center'>
                    <button className="btn btn-sm text-2xl mt-4 normal-case bg-blue-600 text-white
                    hover:bg-blue-400 border-none hover:text-black w-full h-12" type='submit' onClick={() => setSwitchEdit()} >Update Profile</button>
                    </div>
                    </form>
                    
                  </div>
              )}
    
            </div>
          </div>
        </div>
      )
}

export default Form
