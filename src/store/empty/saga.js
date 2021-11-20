import { takeEvery, fork, put, all, call, takeLatest } from "redux-saga/effects"

import { DUMMY_ACTION } from "./actionTypes"
import { dummyAction } from "./actions"
import { del, get, post } from "../../helpers/api_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

//If user is send successfully send mail link then dispatch redux action's are directly from here.

function* dummySagaAction({ payload: { data, history } }) {
  try {
    const response = yield post("dummy-endpoint", data)
    if (response.success) {
      yield put(dummyAction(response.data))
      history.push("/dashboard")
    } else {
      for (const group in response.errors) {
        response.errors[group].map(msg => toastr.warning(msg))
      }
    }
  } catch (error) {}
}

function* dummySaga() {
  yield takeEvery(DUMMY_ACTION, dummySagaAction)
}

export default dummySaga
