import {
    FETCH_ALL,
    ADD_NEW,
    UPDATE,
    DELETE,
    GET_INVOICE,
    START_LOADING,
    END_LOADING,
    FETCH_INVOICE_BY_USER,
} from "../actions/constants";

const invoices = (state = { isLoading: false, invoices: [], isError: false }, action) => {
    switch (action.type) {
        // case START_LOADING:
        //     console.log("invoice start");
        //     return { ...state, isLoading: true };
        // case END_LOADING:
        //     console.log("invocie end");
        //     return { ...state, isLoading: false };
        case FETCH_ALL:
            return {
                ...state,
                isError: false,
                invoices: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            };
        case FETCH_INVOICE_BY_USER:
            return { ...state, isError: false, invoices: action.payload };

        case GET_INVOICE:
            return { ...state, isError: false, invoice: action.payload };
        case ADD_NEW:
            return { ...state, invoices: [...state.invoices, action.payload] };
        case UPDATE:
            return {
                ...state,
                isError: false,
                invoices: state.invoices.map((invoice) =>
                    invoice._id === action.payload._id ? action.payload : invoice
                ),
            };
        case DELETE:
            return {
                ...state,
                isError: false,
                invoices: state.invoices.filter((invoice) => invoice._id !== action.payload),
            };
        case "ERROR":
            console.log(action.payload)
            return { ...state, isError: action.payload };
        default:
            return state;
    }
};

export default invoices;

