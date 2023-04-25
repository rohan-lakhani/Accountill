import { AUTH, LOGOUT, UPDATE_USER, START_LOADING, END_LOADING } from "../actions/constants";

const authReducer = (state = { isLoading: false, authData: null }, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true };
        case END_LOADING:
            return { ...state, isLoading: false };
        case AUTH:
            localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
            return { ...state, authData: action?.data };

        case LOGOUT:
            localStorage.removeItem("profile");
            return { ...state, isLoading: false, authData: null };

        case UPDATE_USER:
            localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
            return { ...state, authData: action?.data };

        default:
            return state;
    }
};

export default authReducer;
