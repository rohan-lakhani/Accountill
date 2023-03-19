import React, { useEffect, useState } from 'react';
import useRedirectLoggedOutUser from '../../customeHook/useRedirectLoggedOutUser';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProfilesByUser, updateProfile } from '../../actions/profile';

import { Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {useTheme} from '@mui/material/styles';
import TextField from '@mui/material/TextField';


import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import MailIcon from '@mui/icons-material/Mail';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

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

const Settings = () => {

    useRedirectLoggedOutUser("/login");

    const user = JSON.parse(localStorage.getItem('profile'));

    const navigate = useNavigate();

    if(!user){
      navigate('/login');
    }

    const location = useLocation();
    const dispatch = useDispatch();
    const classes = useStyles();
    const { profiles } = useSelector((state) => state.profiles)
    const [form, setForm] = useState();
    const [logo, setLogo] = useState("");
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
      if(isEdit === true){
        setForm(profiles)
      }
    },[isEdit])

    useEffect(() => {
      dispatch(getProfilesByUser({ search: user?.result?._id}))
    },[location, isEdit]);

    localStorage.setItem('profileDetails', JSON.stringify({...profiles}))

    const handleSubmit = async(e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("name",form.name);
      formData.append("phoneNumber",form.phoneNumber);
      formData.append("businessName",form.businessName);
      formData.append("contactAddress",form.contactAddress);
      formData.append("userId",user?.result?._id);
      formData.append("paymentDetails",form.paymentDetails);
      formData.append("logo",logo);
      await dispatch(updateProfile(profiles?._id, formData));
      setIsEdit(false);
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogoChange = (e) => {
      setLogo(e.target.files[0]);
    }

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
          {!isEdit && (
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

                  <div className='flex my-1'>
                    <AccountBalanceWalletIcon/>
                    <h1 className='ml-6 text-lg'>{profiles?.paymentDetails}</h1>
                  </div>
              </div>

              <div className='flex justify-center'>
              <button className="btn btn-sm text-2xl mt-4 normal-case bg-blue-600 text-white
              hover:bg-blue-400 border-none hover:text-black w-full h-12" type='submit' onClick={() => setIsEdit(true)} >Edit Profile</button>
              </div>
            </div>
          )}

          
          { isEdit && (
              <div className='mt-4'>
                <form onSubmit={handleSubmit}>
                <input type="file" className="file-input file-input-bordered w-full max-w-full mt-2" name='logo' onChange={(e) => handleLogoChange(e)}/>

                <div className='flex justify-between my-4'>

                <TextField
                label="Phone Number"
                type="text"
                name='phoneNumber'
                value={form?.phoneNumber}
                onChange={handleChange}
                sx={{width:"100%"}}
                />
                </div>

                <div className='my-4'>
                  <TextField
                  label="Business Name"
                  type="text"
                  name='businessName'
                  value={form?.businessName}
                  onChange={handleChange}
                  sx={{width:"100%"}}
                  />
                </div>
                <div className='my-4'>
                  <TextField
                  label="Contact Address"
                  type="text"
                  name='contactAddress'
                  value={form?.contactAddress}
                  onChange={handleChange}
                  sx={{width:"100%"}}
                  />
                </div>
                <div className='my-4 w-full'>
                  <TextField
                  label="Payment Details / Notes"
                  type="text"
                  name='paymentDetails'
                  value={form?.paymentDetails}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  sx={{width:"100%"}}
                  />
                </div>
                <div className='flex justify-center'>
                <button className="btn btn-sm text-2xl mt-4 normal-case bg-blue-600 text-white
                hover:bg-blue-400 border-none hover:text-black w-full h-12" type='submit' onClick={() => setIsEdit(true)} >Update Profile</button>
                </div>
                </form>
                
              </div>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default Settings;
