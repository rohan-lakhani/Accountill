import React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from './Form/Form.js';

const SettingN = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

    if(!user){
        navigate('/login');
    }
  return (
    <div>
      <section>
        <h1>Profile Setitngs</h1>
        <p>Edit/Update your business profile</p>
      </section>
      <section>
        <Form user={user}/>
      </section>
    </div>
  )
}

export default SettingN
