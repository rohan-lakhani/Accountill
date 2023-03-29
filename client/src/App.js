import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";

import Home from './components/Home/Home.js';
import Header from './components/Header/Header.js';
import NavBar from './components/NavBar/NavBar.js';
import Login from './components/Auth/Login/Login.js';
import Register from './components/Auth/Register/Register.js';
import Forgot from './components/Auth/Forgot/Forgot.js';
import Reset from './components/Auth/Reset/Reset.js';
import Dashboard from './components/Dashboard/Dashboard';
import AddIconFooter from './components/addIconFooter/AddIconFooter';
import Invoice from './components/invoice/Invoice';
import Invoices from './components/Invoices/Invoices';
import InvoiceDetails from './components/invoiceDetails/InvoiceDetails';
import Clients from './components/Clients/Clients';
import Settings from './components/Settings/Settings'




function App() {

  const name = JSON.parse(localStorage.getItem('profile'));

  // const user = true;
  // console.log(user);


  

  return (
    <div className='relative'>
      <BrowserRouter>
        <ToastContainer/>
          <NavBar/>
          <Header/>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path='/login' exact element={<Login/>}/>
            <Route path='/register' exact element={<Register/>}/>
            <Route path='/forgot' exact element={<Forgot/>}/>
            <Route path='/reset/:token' exact element={<Reset/>}/>
            <Route path='/dashboard' exact element={<Dashboard/>}/>
            <Route path='/invoices' exact element={<Invoices/>}/>
            <Route path='/customers' exact element={<Clients/>}/>
            <Route path='/settings' exact element={<Settings/>}/>
            <Route path='/invoice' exact element={<Invoice/>}/>
            <Route path='/invoice/:id' exact element={<InvoiceDetails/>}/>
            <Route path='/edit/invoice/:id' exact element={<Invoice/>}/>
          </Routes>
          <AddIconFooter/>
      </BrowserRouter>
    </div>
  );
}

export default App;
