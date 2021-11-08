import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
} from "./actionTypes"

import { setAuthorizationToken } from "../../helpers/api_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

const initialState = {
  forgetSuccessMsg: null,
  forgetError: null,
  registrationError: null,
  message: null,
  loading: false,
  user: null,
  success: null,
  error: null,
}

const auth = (state = initialState, action) => {
  switch (action.type) {
    case FORGET_PASSWORD:
      state = {
        ...state,
        forgetSuccessMsg: null,
        forgetError: null,
      }
      break
    case FORGET_PASSWORD_SUCCESS:
      state = {
        ...state,
        forgetSuccessMsg: action.payload,
      }
      break
    case FORGET_PASSWORD_ERROR:
      state = { ...state, forgetError: action.payload }
      break
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case LOGIN_SUCCESS:
      toastr.success("Successfully Logged In!")
      localStorage.setItem("authUser", JSON.stringify(action.payload))
      setAuthorizationToken(action.payload.token)
      state = {
        ...state,
        Profile: action.payload,
        loading: false,
      }
      break
    case LOGOUT_USER:
      state = { ...state }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state }
      break
    case API_ERROR:
      state = { ...state, error: action.payload, loading: false }
      break
    case REGISTER_USER:
      state = {
        ...state,
        loading: true,
        registrationError: null,
      }
      break
    case REGISTER_USER_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        user: action.payload,
        registrationError: null,
      }
      break
    case REGISTER_USER_FAILED:
      state = {
        ...state,
        user: null,
        loading: false,
        registrationError: action.payload,
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default auth
