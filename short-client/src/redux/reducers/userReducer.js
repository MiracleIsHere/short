import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  MARK_NOTIFICATIONS_UI_READ,
  DELETE_NOTIFICATION,
  ADD_SHORT,
  DELETE_SUB,
  ADD_SUB,
  CHANGE_SHORT_STATUS,
  ADD_LINK_SUBS,
  SET_LINK_SUBS,
  DELETE_LINK_SUB,
  UPDATE_LINK_SUB
} from '../types';

const initialState = {
  authenticated: false,
  loading: false,
  credentials: {},
  links: [],
  subs: [],
  notifications: [],
  linkSubs: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    case SET_UNAUTHENTICATED:
      return initialState;
    case SET_USER:
      return {
        ...state,
        authenticated: true,
        loading: false,
        ...action.payload
      };
    case LOADING_USER:
      return {
        ...state,
        loading: true
      };
    case ADD_SHORT:
      return {
        ...state,
        links: [
          action.payload, ...state.links
        ]
      };
    case DELETE_SUB:
      return {
        ...state,
        subs: state.subs.filter(
          (subs) => subs.subId !== action.payload
        )
      };
    case ADD_SUB:
      return {
        ...state,
        subs: [
          action.payload, ...state.subs.filter(
            (subs) => subs.subId !== action.payload.subId
          )
        ]
      };
    case CHANGE_SHORT_STATUS:
      state.links.forEach(
        (link) => {
          if (link.linkCode === action.payload.linkCode) link.private = action.payload.newStatus
        }
      )
      return {
        ...state,
      };
    case SET_LINK_SUBS:
      state.linkSubs[action.payload.linkCode] = action.payload.data
      return {
        ...state,
      };
    case ADD_LINK_SUBS:
      state.linkSubs[action.payload.linkCode] = [action.payload.data, ...((state.linkSubs[action.payload.linkCode] || []).filter(
        (linkSubs) => linkSubs.subHandle !== action.payload.data.subHandle
      ))]
      return {
        ...state,
      };
    case DELETE_LINK_SUB:
      state.linkSubs[action.payload.linkId] = [...((state.linkSubs[action.payload.linkId] || []).filter(
        (linkSubs) => linkSubs.subId !== action.payload.subId
      ))]
      return {
        ...state,
      };
    case UPDATE_LINK_SUB:
      state.linkSubs[action.payload.data.linkId] = [action.payload.data, ...((state.linkSubs[action.payload.data.linkId] || []).filter(
        (linkSubs) => linkSubs.subId !== action.payload.data.subId
      ))]
      return {
        ...state,
      };
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach((not) => (not.read = !not.read ? 'just read' : true));
      return {
        ...state
      };
    case MARK_NOTIFICATIONS_UI_READ:
      state.notifications.forEach((not) => not.read = true);
      return {
        ...state
      };
    case DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (not) => not.subId !== action.payload
        )
      };
    default:
      return state;
  }
}
