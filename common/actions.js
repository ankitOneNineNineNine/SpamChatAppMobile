import { POST } from "../adapters/http.adapter";
import { setToken } from "./getSetToken";
import { displayError, displaySuccess } from "./toaster";
import {
  SET_USER_PENDING,
  SET_USER_SUCCESS,
  GET_USER,
  SEARCH_PENDING,
  SEARCH_SUCCESS,
  CURRENT_MSGING,
  USER_LOGOUT,
} from "./types";

export const setUser = (credentials) => {
  if (credentials === "logout") {
    return (dispatch) => {
      dispatch({ type: USER_LOGOUT });
    };
  }
  return async (dispatch) => {
    dispatch({ type: SET_USER_PENDING });
    try {
      const { user, token } = await POST("/auth/login", credentials);
      const hash = await setToken(token);
      dispatch({ type: SET_USER_SUCCESS, payload: user });
    } catch (error) {
      displayError(`${error.response.data.message}`);
    }
  };
};

export const searchPeople = (text) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_PENDING });
    try {
      const people = await POST("/user/search", { srcText: text }, true);
      dispatch({ type: SEARCH_SUCCESS, payload: people });
    } catch (error) {
      displayError(`${error.response.data.message}`);
    }
  };
};

export const setCurrentMessaging = (info) => {
  return {
    type: CURRENT_MSGING,
    payload: info,
  };
};
