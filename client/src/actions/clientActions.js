import * as api from "../api/index";
import { toast } from "react-toastify";

import {
  ADD_NEW_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
  FETCH_CLIENTS_BY_USER,
  FETCH_CLIENT,
  START_LOADING,
  END_LOADING,
} from "./constants";

export const getClient = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchClient(id);
    dispatch({ type: FETCH_CLIENT, payload: { client: data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
    dispatch({ type: END_LOADING });
  }
};

export const getClientsByUser = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchClientByUser(searchQuery);

    dispatch({ type: FETCH_CLIENTS_BY_USER, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error.response);
    dispatch({ type: END_LOADING });
  }
};

export const createClient = (client) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.addClient(client);
    dispatch({ type: ADD_NEW_CLIENT, payload: data });
    dispatch({ type: END_LOADING });
    toast.success("Customer added successfully");
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
    dispatch({ type: END_LOADING });
  }
};

export const updateClient = (id, client) => async (dispatch) => {
  dispatch({ type: START_LOADING });
  const { data } = await api.updateClient(id, client);
  dispatch({ type: UPDATE_CLIENT, payload: data });
  dispatch({ type: END_LOADING });
  toast.success("Customer updated successfully");
  try {
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
    dispatch({ type: END_LOADING });
  }
};

export const deleteClient = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    await api.deleteClient(id);
    dispatch({ type: DELETE_CLIENT, payload: id });
    dispatch({ type: END_LOADING });
    toast.success("Customer deleted successfully");
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
    dispatch({ type: END_LOADING });
  }
};
