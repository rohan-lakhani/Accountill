import "./App.css";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import NavBar from "./components/NavBar/NavBar";
import Login from "./components/Auth/Login/Login";
import Register from "./components/Auth/Register/Register";
import Forgot from "./components/Auth/Forgot/Forgot";
import Reset from "./components/Auth/Reset/Reset";
import Dashboard from "./components/Dashboard/Dashboard";
import AddIconFooter from "./components/addIconFooter/AddIconFooter";
import Invoice from "./components/invoice/Invoice";
import Invoices from "./components/Invoices/Invoices";
import InvoiceDetails from "./components/invoiceDetails/InvoiceDetails";
import Clients from "./components/Clients/Clients";
import Settings from "./components/Settings/Settings";
import Protected from "./components/protected/Protected";

function App() {
    const isLoggedIn = JSON.parse(localStorage.getItem("profile")) !== null ? true : false;
    return (
        <div className="relative">
            <BrowserRouter>
                <ToastContainer autoClose={1000} theme="dark" />
                <NavBar />
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" exact element={<Login />} />
                    <Route path="/register" exact element={<Register />} />
                    <Route path="/forgot" exact element={<Forgot />} />
                    <Route path="/reset/:token" exact element={<Reset />} />
                    <Route path="/dashboard" exact element={<Dashboard />} />
                    {/* <Route element={<Protected />}> */}
                    <Route path="/invoices" exact element={<Invoices />} />
                    <Route path="/customers" exact element={<Clients />} />
                    <Route path="/settings" exact element={<Settings />} />
                    <Route path="/invoice" exact element={<Invoice />} />
                    <Route path="/invoice/:id" exact element={<InvoiceDetails />} />
                    <Route path="/edit/invoice/:id" exact element={<Invoice />} />
                    {/* </Route> */}
                </Routes>
                <AddIconFooter />
            </BrowserRouter>
        </div>
    );
}

export default App;
