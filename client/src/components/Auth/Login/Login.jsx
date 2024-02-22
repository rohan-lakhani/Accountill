import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signin } from "../../../actions/auth";
import Spinner from "../../Spinner/Spinner";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const { email, password } = formData;
  const user = JSON.parse(localStorage.getItem("profile"));

  const loginUser = async (e) => {
    e.preventDefault();
    const formData = {
      email,
      password,
    };
    dispatch(signin(formData));
  };

  useEffect(() => {
    if (user != null) {
      navigate("/dashboard");
    }
  }, [loginUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-col pt-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center items-center h-[90vh]">
        <button className="btn btn-outline btn-primary btn-sm text-lg font-normal mr-1 mt-2 rounded-2xl normal-case absolute top-14 left-1">
          <Link to="/" className="text-primary hover:text-white">
            Back
          </Link>
        </button>
        <div class="p-4 w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/4 bg-slate-700 rounded-xl">
          <form class="form-control flex justify " onSubmit={(e) => loginUser(e)}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
              class="input"
            />

            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
              class="input mt-2"
            />

            <div className="flex justify-center">
              <button
                className="btn btn-sm text-xl mt-4 pb-1 normal-case bg-blue-600 text-white
                        hover:bg-blue-400 hover:text-black shadow-md shadow-blue-300 border-none"
              >
                Login
              </button>
            </div>
            <div className="text-white mt-4 flex justify-center">
              <p>&nbsp; New user?&nbsp;</p>
              <Link to="/register" className="font-bold text-blue-500">
                Sign Up
              </Link>
            </div>
            <div className="text-white mt-1 flex justify-center">
              <Link to="/forgot" className="font-bold text-blue-500">
                Forgot Password ?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
