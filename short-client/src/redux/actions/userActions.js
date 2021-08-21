import axios from 'axios';
import {
  checkTokenExpr
} from '../../util/routes';
import { isHandleable } from '../../util/func';
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  MARK_NOTIFICATIONS_UI_READ,
  DELETE_NOTIFICATION,
  DELETE_SUB,
  SET_ERRORS_SUB,
  CLEAR_ERRORS_SUB,
  LOADING_UI_SUB,
  LOADING_UI_SHORT,
  CHANGE_SHORT_STATUS,
  CLEAR_ERRORS_SHORT,
  SET_ERRORS_SHORT,
  CLEAR_ERRORS_ADD_SUB,
  SET_ERRORS_ADD_SUB,
  LOADING_UI_ADD_SUB,
  CLEAR_ERRORS_LINK_SUB_LIST,
  SET_ERRORS_LINK_SUB_LIST,
  LOADING_UI_LINK_SUB_LIST,
  ADD_LINK_SUBS,
  SET_LINK_SUBS,
  CLEAR_ERRORS_LINK_SUB,
  SET_ERRORS_LINK_SUB,
  LOADING_UI_LINK_SUB,
  DELETE_LINK_SUB,
  UPDATE_LINK_SUB
} from '../types';

export const loginUser = (userData, history, redirect) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/login', userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push(redirect);
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: isHandleable(err) ? err.response.data : { general: "Please try again" }
      });
    });
};
export const signupUser = (newUserData, history, redirect) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/signup', newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push(redirect);
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: isHandleable(err) ? err.response.data : { general: "Please try again" }
      });
    });
};
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
};
export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get('/user')
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch((err) => {
      checkTokenExpr(err)
      console.log(err)
    });
};
export const markNotificationsRead = (notificationIds) => (dispatch) => {
  if (notificationIds.length) {
    axios
      .post('/notifications', notificationIds)
      .then((res) => {
        dispatch({
          type: MARK_NOTIFICATIONS_READ
        });
      })
      .catch((err) => console.log(err));
  }
};
export const markNotificationsUIRead = () => (dispatch) => {
  dispatch({
    type: MARK_NOTIFICATIONS_UI_READ
  });
};
const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
};
export const cancelAccess = (subId) => (dispatch) => {
  dispatch({
    type: LOADING_UI_SUB,
    payload: subId
  });
  axios
    .post(`/subs/${subId}/cancel`)
    .then((res) => {
      dispatch({
        type: DELETE_SUB,
        payload: subId
      });
      dispatch({
        type: CLEAR_ERRORS_SUB,
        payload: subId
      });
    })
    .catch((err) => {
      checkTokenExpr(err)
      dispatch({
        type: SET_ERRORS_SUB,
        payload: isHandleable(err) ? { errors: err.response.data, subId: subId } : { errors: { error: 'Ooops!' }, subId: subId }
      });
    });
};
export const changeShortStatus = (linkCode, newStatus) => (dispatch) => {
  dispatch({
    type: LOADING_UI_SHORT,
    payload: { linkCode, field: 'status' }
  });
  axios
    .post(`/link/${linkCode}/private`)
    .then((res) => {
      dispatch({
        type: CHANGE_SHORT_STATUS,
        payload: { linkCode, newStatus }
      });
      dispatch({
        type: CLEAR_ERRORS_SHORT,
        payload: { linkCode, field: 'status' }
      });
    })
    .catch((err) => {
      checkTokenExpr(err)
      dispatch({
        type: SET_ERRORS_SHORT,
        payload: isHandleable(err) ? { linkCode, field: 'status', errors: { ...err.response.data, setBack: !newStatus } } :
          { linkCode, field: 'status', errors: { ...{ errorOnChangePrivate: 'Ooops' }, setBack: !newStatus } }
      });
    });
};
export const addSub = (linkCode, subHandle) => (dispatch) => {
  dispatch({
    type: LOADING_UI_ADD_SUB,
    payload: { linkCode, back: subHandle }
  });
  axios
    .post(`/link/${linkCode}/grant`, { subHandle })
    .then((res) => {
      dispatch({
        type: ADD_LINK_SUBS,
        payload: { linkCode, data: res.data }
      });
      dispatch({
        type: SET_ERRORS_ADD_SUB,
        payload: { linkCode, errors: { granted: true } }
      });
      dispatch({
        type: DELETE_NOTIFICATION,
        payload: res.data.subId
      });
    })
    .catch((err) => {
      checkTokenExpr(err)
      dispatch({
        type: SET_ERRORS_ADD_SUB,
        payload: isHandleable(err) ? { linkCode, errors: { ...err.response.data, back: subHandle } } :
          { linkCode, errors: { ...{ errorOnGrant: 'Something went wrong' }, back: subHandle } }
      });
    });
};
export const clearAddSub = (linkCode) => (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS_ADD_SUB,
    payload: { linkCode }
  });
};
export const getLinkSubs = (linkCode) => (dispatch) => {
  dispatch({
    type: LOADING_UI_LINK_SUB_LIST,
    payload: { linkCode }
  });
  axios
    .get(`/link/${linkCode}/subs`)
    .then((res) => {
      dispatch({
        type: SET_LINK_SUBS,
        payload: { linkCode, data: res.data }
      });
      dispatch({
        type: CLEAR_ERRORS_LINK_SUB_LIST,
        payload: { linkCode }
      });
    })
    .catch((err) => {
      checkTokenExpr(err)
      dispatch({
        type: SET_ERRORS_LINK_SUB_LIST,
        payload: isHandleable(err) ? { linkCode, errors: err.response.data } : { linkCode, errors: { error: "Oo0ps" } }
      });
    });
};
export const approveAccess = (subId) => (dispatch) => {
  dispatch({
    type: LOADING_UI_LINK_SUB,
    payload: { subId }
  });
  axios
    .post(`/subs/${subId}/approve`)
    .then((res) => {
      dispatch({
        type: UPDATE_LINK_SUB,
        payload: { data: res.data }
      });
      dispatch({
        type: CLEAR_ERRORS_LINK_SUB,
        payload: { subId }
      });
      dispatch({
        type: DELETE_NOTIFICATION,
        payload: subId
      });
    })
    .catch((err) => {
      checkTokenExpr(err)
      dispatch({
        type: SET_ERRORS_LINK_SUB,
        payload: isHandleable(err) ? { subId, errors: err.response.data } : { subId, errors: { error: 'Ooops' } }
      });
    });
};
export const rejectAccess = (subId, linkId) => (dispatch) => {
  checkTokenExpr({})
  dispatch({
    type: LOADING_UI_LINK_SUB,
    payload: { subId }
  });
  axios
    .post(`/subs/${subId}/reject`)
    .then((res) => {
      dispatch({
        type: DELETE_LINK_SUB,
        payload: { subId, linkId }
      });
      dispatch({
        type: CLEAR_ERRORS_LINK_SUB,
        payload: { subId }
      });
      dispatch({
        type: DELETE_NOTIFICATION,
        payload: subId
      });
    })
    .catch((err) => {
      checkTokenExpr(err)
      dispatch({
        type: SET_ERRORS_LINK_SUB,
        payload: isHandleable(err) ? { subId, errors: err.response.data } : { subId, errors: { error: 'Ooops' } }
      });
    });
};