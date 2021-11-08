import { takeEvery, fork, put, all, call, takeLatest } from "redux-saga/effects"

// Login Redux States
import {
  FORGET_PASSWORD,
  RESET_PASSWORD,
  REGISTER_USER,
  VERIFY_EMAIL,
  LOGIN_USER,
  LOGOUT_USER,
  SOCIAL_LOGIN,
} from "./actionTypes"
import {
  userForgetPasswordError,
  loginSuccess,
} from "./actions"
import { del, get, post } from "../../helpers/api_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: { user, history } }) {
  try {
    const response = yield post("forgot-password", user)
    if (response.success) {
      history.push("/confirm-mail")
    }
  } catch (error) {
    yield put(userForgetPasswordError(error))
  }
}
//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* resetPassword({ payload: { user, history } }) {
  try {
    const response = yield post("reset-password", user)
    console.log(response)
    if (response.success) {
      toastr.success("Your password is successfully reset!")
      history.push("/login")
    } else {
      for (const group in response.errors) {
        response.errors[group].map(msg => toastr.warning(msg))
      }
    }
  } catch (error) {
    yield put(userForgetPasswordError(error))
  }
}

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield post("login", user)
    if (response.success) {
      yield put(loginSuccess(response.data))
      history.push("/dashboard")
    } else {
      for (const group in response.errors) {
        response.errors[group].map(msg => toastr.warning(msg))
      }
      if (response.type == "unverified-email") {
        history.push("/two-step-verification/" + response.data.email)
      }
    }
  } catch (error) {
    yield put(apiError(error))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser")

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout)
      yield put(logoutUserSuccess(response))
    }
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend()
      const response = yield call(fireBaseBackend.socialLoginUser, data, type)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else {
      const response = yield call(postSocialLogin, data)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history.push("/dashboard")
  } catch (error) {
    yield put(apiError(error))
  }
}
// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user, history } }) {
  try {
    const response = yield post("register", user)
    if (response.success) {
      history.push("/two-step-verification/" + user.email)
    } else {
      for (const group in response.errors) {
        response.errors[group].map(msg => toastr.warning(msg))
      }
    }
  } catch (error) {
    console.log(error)
    toastr.warning("Duplicate Username or Email")
  }
}
function* verifyEmail({ payload: { user, history } }) {
  try {
    const response = yield post("verify-email", user)
    if (response.success) {
      yield put(loginSuccess(response.data))
      history.push("/dashboard")
    } else {
      for (const group in response.errors) {
        response.errors[group].map(msg => toastr.warning(msg))
      }
    }
  } catch (error) {}
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
}
export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser)
  yield takeEvery(RESET_PASSWORD, resetPassword)
}

function* authSaga() {
  yield takeEvery(VERIFY_EMAIL, verifyEmail)
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeLatest(SOCIAL_LOGIN, socialLogin)
  yield takeEvery(LOGOUT_USER, logoutUser)
  yield all([fork(watchUserPasswordForget)])
  yield all([fork(watchUserRegister)])
}

export default authSaga
