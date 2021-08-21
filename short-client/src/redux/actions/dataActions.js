import axios from 'axios';
import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  POST_NA_SHORT,
  POST_SHORT,
  ADD_SHORT,
  LOADING_UI_LINK,
  SET_ERRORS_LINK,
  CLEAR_ERRORS_LINK,
  SET_LINK,
  CLEAR_LINK,
  STOP_LOADING_UI_LINK,
  ADD_SUB
} from '../types';
import { checkTokenExpr } from '../../util/routes';
import { isHandleable } from '../../util/func';

export const postNAlink = (newLink) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/NAlink', newLink)
    .then((res) => {
      dispatch({
        type: POST_NA_SHORT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: isHandleable(err) ? err.response.data : { general: 'Something went wrong' }
      });
    });
};
export const postLink = (newLink) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/link', newLink)
    .then((res) => {
      dispatch({
        type: POST_SHORT,
        payload: res.data
      });
      dispatch({
        type: ADD_SHORT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      checkTokenExpr(err)
      dispatch({
        type: SET_ERRORS,
        payload: isHandleable(err) ? err.response.data : { general: 'Something went wrong' }
      });
    });
};
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
export const getLink = (linkCode) => (dispatch) => {
  dispatch({ type: LOADING_UI_LINK });
  axios
    .get(`/link${linkCode}`)
    .then((res) => {
      dispatch({
        type: SET_LINK,
        payload: res.data
      });
      dispatch({ type: CLEAR_ERRORS_LINK });
    })
    .catch((err) => {
      checkTokenExpr(err)
      dispatch({
        type: SET_ERRORS_LINK,
        payload: (err && err.response && err.response.data) || { error: 'Something went wrong' }
      });
    });
};
export const requestAccess = (linkCode) => (dispatch) => {
  dispatch({ type: LOADING_UI_LINK });
  axios
    .post(`/link${linkCode}/request`)
    .then((res) => {
      dispatch({
        type: SET_ERRORS_LINK,
        payload: { data: res.data }
      });
      dispatch({
        type: ADD_SUB,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI_LINK });
    })
    .catch((err) => {
      checkTokenExpr(err)
      dispatch({
        type: SET_ERRORS_LINK,
        payload: isHandleable(err) ? err.response.data : { errorOnRequest: 'Something went wrong' }
      });
    });
};
export const clearLink = () => (dispatch) => {
  dispatch({ type: CLEAR_LINK });
};