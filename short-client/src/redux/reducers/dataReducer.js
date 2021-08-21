import {
  LOADING_DATA,
  POST_NA_SHORT,
  POST_SHORT,
  SET_LINK,
  CLEAR_LINK
} from '../types';

const initialState = {
  short: '',
  loading: false,
  redirect: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case POST_NA_SHORT:
      return {
        ...state,
        short: action.payload.shortLink
      };
    case POST_SHORT:
      return {
        ...state,
        short: action.payload.shortLink
      };
    case SET_LINK:
      return {
        ...state,
        redirect: action.payload
      };
    case CLEAR_LINK:
      return {
        ...state,
        redirect: ''
      };
    default:
      return state;
  }
}