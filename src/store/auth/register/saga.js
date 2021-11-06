import { takeEvery, fork, put, all, call } from "redux-saga/effects"

//Account Redux states
import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"
import { del, get, post } from "../../../helpers/api_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user, history } }) {
  try {
    const response = yield post("register", user)
    if (response.success) {
      history.push("/two-step-verification")
    } else {
      for (const group in response.errors) {
        response.errors[group].map(msg => toastr.warning(msg))
      }
    }
  } catch (error) {
    console.log(error)
    toastr.warning("Duplicate Username or Email");
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
  yield all([fork(watchUserRegister)])
}

export default accountSaga
