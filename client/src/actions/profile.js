import {
  FETCH_PROFILES,
  FETCH_PROFILES_BY_USER,
  CREATE_PROFILE,
  UPDATE_PROFILE,
  DELETE_PROFILE,
  FETCH_PROFILE_BY_USER,
  START_LOADING,
  END_LOADING,
  FETCH_PROFILE,
} from "./constants";
import * as api from "../api/index";
import { toast } from "react-toastify";

export const getProfile = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchProfile(id);

    dispatch({ type: FETCH_PROFILE, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.response);
    dispatch({ type: END_LOADING });
  }
};

export const getProfiles = () => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.fetchProfiles();
    dispatch({ type: FETCH_PROFILES, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
    dispatch({ type: END_LOADING });
  }
};

export const getProfilesByUser = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchProfilesByUser(searchQuery);
    dispatch({ type: FETCH_PROFILE_BY_USER, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error.response);
    dispatch({ type: END_LOADING });
  }
};

export const getProfilesBySearch = (searchQuery) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const {
      data: { data },
    } = await api.fetchProfilesBySearch(searchQuery);
    dispatch({ type: FETCH_PROFILES_BY_USER, payload: { data } });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
    dispatch({ type: END_LOADING });
  }
};

export const createProfile = (profile) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.createProfile(profile);
    dispatch({ type: CREATE_PROFILE, payload: data });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
    dispatch({ type: END_LOADING });
  }
};

export const updateProfile = (id, form) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    const { data } = await api.updateProfile(id, form);
    dispatch({ type: UPDATE_PROFILE, payload: data });
    toast.success("Profile updated successfully");
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
    dispatch({ type: END_LOADING });
  }
};

export const deleteProfile = (id) => async (dispatch) => {
  try {
    dispatch({ type: START_LOADING });
    await api.deleteProfile(id);
    dispatch({ type: DELETE_PROFILE, payload: id });
    dispatch({ type: END_LOADING });
  } catch (error) {
    console.log(error);
    dispatch({ type: END_LOADING });
  }
};
