import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  CLEAR_ERRORS_SUB,
  SET_ERRORS_SUB,
  LOADING_UI_SUB,
  STOP_LOADING_UI_SUB,
  SET_ERRORS_LINK,
  CLEAR_ERRORS_LINK,
  LOADING_UI_LINK,
  STOP_LOADING_UI_LINK,
  CLEAR_ERRORS_SHORT,
  SET_ERRORS_SHORT,
  LOADING_UI_SHORT,
  CLEAR_ERRORS_ADD_SUB,
  SET_ERRORS_ADD_SUB,
  LOADING_UI_ADD_SUB,
  CLEAR_ERRORS_LINK_SUB_LIST,
  SET_ERRORS_LINK_SUB_LIST,
  LOADING_UI_LINK_SUB_LIST,
  CLEAR_ERRORS_LINK_SUB,
  SET_ERRORS_LINK_SUB,
  LOADING_UI_LINK_SUB,
} from '../types';

const initialState = {
  loading: false,
  errors: null,
  loadingLink: false,
  errorsLink: {},
  loadingSubs: {},
  errorsSubs: {},
  loadingShorts: {},
  errorsShorts: {},
  loadingAddSub: {},
  errorsAddSub: {},
  loadingLinkSubList: {},
  errorsLinkSubList: {},
  loadingLinkSub: {},
  errorsLinkSub: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    //UI-data(home page)
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null
      };
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false
      };
    //UI-data(link page)
    case SET_ERRORS_LINK:
      return {
        ...state,
        loadingLink: false,
        errorsLink: action.payload
      };
    case CLEAR_ERRORS_LINK:
      return {
        ...state,
        loadingLink: false,
        errorsLink: {}
      };
    case LOADING_UI_LINK:
      return {
        ...state,
        loadingLink: true
      };
    case STOP_LOADING_UI_LINK:
      return {
        ...state,
        loadingLink: false
      };
    //UI-user(sub page)
    case SET_ERRORS_SUB:
      delete state.loadingSubs[action.payload.subId]
      state.errorsSubs[action.payload.subId] = action.payload.errors
      return {
        ...state,
        loadingSubs: { ...state.loadingSubs },
        errorsSubs: { ...state.errorsSubs }
      };
    case CLEAR_ERRORS_SUB:
      delete state.loadingSubs[action.payload]
      delete state.errorsSubs[action.payload]
      return {
        ...state,
        loadingSubs: { ...state.loadingSubs },
        errorsSubs: { ...state.errorsSubs }
      };
    case LOADING_UI_SUB:
      state.loadingSubs[action.payload] = true
      return {
        ...state,
        loadingSubs: { ...state.loadingSubs }
      };
    case STOP_LOADING_UI_SUB:
      delete state.loadingSubs[action.payload]
      return {
        ...state,
        loadingSubs: { ...state.loadingSubs }
      };
    //UI(short page)
    case SET_ERRORS_SHORT:
      let errorsDictSet = state.errorsShorts[action.payload.linkCode] || {}
      errorsDictSet[action.payload.field] = { ...action.payload.errors }
      state.errorsShorts[action.payload.linkCode] = errorsDictSet
      let loadingDictSet = state.loadingShorts[action.payload.linkCode] || {}
      delete loadingDictSet[action.payload.field]
      return {
        ...state,
        loadingShorts: { ...state.loadingShorts },
        errorsShorts: { ...state.errorsShorts }
      };
    case CLEAR_ERRORS_SHORT:
      let errorsDictClear = state.errorsShorts[action.payload.linkCode] || {}
      delete errorsDictClear[action.payload.field]
      let loadingDictClear = state.loadingShorts[action.payload.linkCode] || {}
      delete loadingDictClear[action.payload.field]
      return {
        ...state,
        loadingShorts: { ...state.loadingShorts },
        errorsShorts: { ...state.errorsShorts }
      };
    case LOADING_UI_SHORT:
      let loadingDict = state.loadingShorts[action.payload.linkCode] || {}
      loadingDict[action.payload.field] = true
      state.loadingShorts[action.payload.linkCode] = loadingDict
      return {
        ...state,
        loadingShorts: { ...state.loadingShorts }
      };
    //UI-user(add link sub)
    case SET_ERRORS_ADD_SUB:
      state.errorsAddSub[action.payload.linkCode] = action.payload.errors
      delete state.loadingAddSub[action.payload.linkCode]
      return {
        ...state,
        loadingAddSub: { ...state.loadingAddSub },
        errorsAddSub: { ...state.errorsAddSub }
      };
    case CLEAR_ERRORS_ADD_SUB:
      delete state.errorsAddSub[action.payload.linkCode]
      delete state.loadingAddSub[action.payload.linkCode]
      return {
        ...state,
        loadingAddSub: { ...state.loadingAddSub },
        errorsAddSub: { ...state.errorsAddSub }
      };
    case LOADING_UI_ADD_SUB:
      state.loadingAddSub[action.payload.linkCode] = { load: true, back: action.payload.back }
      return {
        ...state,
        loadingAddSub: { ...state.loadingAddSub }
      };
    //UI-user(loading link subs)
    case SET_ERRORS_LINK_SUB_LIST:
      state.errorsLinkSubList[action.payload.linkCode] = action.payload.errors
      delete state.loadingLinkSubList[action.payload.linkCode]
      return {
        ...state,
        loadingLinkSubList: { ...state.loadingLinkSubList },
        errorsLinkSubList: { ...state.errorsLinkSubList }
      };
    case CLEAR_ERRORS_LINK_SUB_LIST:
      delete state.errorsLinkSubList[action.payload.linkCode]
      delete state.loadingLinkSubList[action.payload.linkCode]
      return {
        ...state,
        loadingLinkSubList: { ...state.loadingLinkSubList },
        errorsLinkSubList: { ...state.errorsLinkSubList }
      };
    case LOADING_UI_LINK_SUB_LIST:
      state.loadingLinkSubList[action.payload.linkCode] = true
      return {
        ...state,
        loadingLinkSubList: { ...state.loadingLinkSubList }
      };
    //UI-user(managing link subs)
    case SET_ERRORS_LINK_SUB:
      state.errorsLinkSub[action.payload.subId] = action.payload.errors
      delete state.loadingLinkSub[action.payload.subId]
      return {
        ...state,
        loadingLinkSub: { ...state.loadingLinkSub },
        errorsLinkSub: { ...state.errorsLinkSub }
      };
    case CLEAR_ERRORS_LINK_SUB:
      delete state.errorsLinkSub[action.payload.subId]
      delete state.loadingLinkSub[action.payload.subId]
      return {
        ...state,
        loadingLinkSub: { ...state.loadingLinkSub },
        errorsLinkSub: { ...state.errorsLinkSub }
      };
    case LOADING_UI_LINK_SUB:
      state.loadingLinkSub[action.payload.subId] = true
      return {
        ...state,
        loadingLinkSub: { ...state.loadingLinkSub }
      };
    default:
      return state;
  }
}
