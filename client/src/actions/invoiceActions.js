import * as api from "../api/index";
import { toast } from "react-toastify";

import { ADD_NEW, UPDATE, DELETE, GET_INVOICE, FETCH_INVOICE_BY_USER, START_LOADING, END_LOADING } from "./constants";

// export const getInvoices = () => async (dispatch)=> {
//     try {
//         const { data } = await api.fetchInvoices()
//         dispatch({ type: FETCH_ALL, payload: data })
//     } catch (error) {
//         console.log(error)
//     }
// }

export const getInvoicesByUser = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchInvoicesByUser(searchQuery);
    dispatch({ type: FETCH_INVOICE_BY_USER, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.response);
    dispatch({ type: END_LOADING });
  }
};

export const getInvoice = (id) => async (dispatch) => {
  const user = JSON.parse(localStorage.getItem("profile"));

  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchInvoice(id);
    const businessDetails = await api.fetchProfilesByUser({ search: user?.result?._id || user?.result?.googleId });
    const invoiceData = { ...data, businessDetails };
    dispatch({ type: GET_INVOICE, payload: invoiceData });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.response);
    dispatch({ type: END_LOADING });
  }
};

export const createInvoice = (invoice) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.addInvoice(invoice);
    dispatch({ type: ADD_NEW, payload: data });
    dispatch({ type: END_LOADING });
    toast.success("Invoice created successfully");
  } catch (error) {
    toast.error(error);
    dispatch({ type: END_LOADING });
  }
};

export const updateInvoice = (id, invoice) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.updateInvoice(id, invoice);
    dispatch({ type: UPDATE, payload: data });
    dispatch({ type: END_LOADING });
    toast.success("Invoice updated successfully");
  } catch (error) {
    // console.log(error)
    toast.error(error);
    dispatch({ type: END_LOADING });
  }
};

export const deleteInvoice = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    await api.deleteInvoice(id);
    dispatch({ type: DELETE, payload: id });
    dispatch({ type: END_LOADING });
    toast.success("Invoice deleted successfully");
  } catch (error) {
    // console.log(error.response)
    toast.error(error);
    dispatch({ type: END_LOADING });
  }
};
