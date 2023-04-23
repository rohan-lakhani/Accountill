import { AUTH, LOGOUT, UPDATE_USER, START_LOADING, END_LOADING } from "../actions/constants";

const authReducer = (state = { isLoading: false, authData: null }, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true };
        case END_LOADING:
            return { ...state, isLoading: false };
        case AUTH:
            console.log(action?.data);
            localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
            // console.log(action?.data)
            console.log("auth");
            console.log(state);
            return { ...state, authData: action?.data };

        case LOGOUT:
            localStorage.removeItem("profile");
            console.log(state);
            return { ...state, isLoading: false, authData: null };

        case UPDATE_USER:
            localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
            // console.log(action?.data)
            return { ...state, authData: action?.data };

        default:
            return state;
    }
};

export default authReducer;
