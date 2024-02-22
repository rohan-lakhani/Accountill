import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getLoginStatus } from "../actions/auth";

const useRedirectLoggedOutUser = (path) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectLoggedOutUser = async () => {
    const isLoggedIn = await getLoginStatus();

    if (!isLoggedIn) {
      navigate(path);
      return;
    }
  };

  useEffect(() => {
    redirectLoggedOutUser();
  }, [navigate, path, dispatch]);
};

export default useRedirectLoggedOutUser;
