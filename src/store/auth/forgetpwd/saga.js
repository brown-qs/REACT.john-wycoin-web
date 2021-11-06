import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { FORGET_PASSWORD, RESET_PASSWORD } from "./actionTypes"
import { userForgetPasswordSuccess, userForgetPasswordError } from "./actions"
import { del, get, post } from "../../../helpers/api_helper"
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

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser)
  yield takeEvery(RESET_PASSWORD, resetPassword)
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)])
}

export default forgetPasswordSaga
