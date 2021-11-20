import { takeEvery, fork, put, all, call, takeLatest } from "redux-saga/effects"

import { ADD_USER_EXCHANGE } from "./actionTypes"
import {  } from "./actions"
import { del, get, post } from "../../helpers/api_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

//If user is send successfully send mail link then dispatch redux action's are directly from here.

// function* addUserExchangeSaga({ payload: { exchange, data, history } }) {
//   try {
//     const response = yield post("add-user-exchange", { exchange, metadata: JSON.stringify(data)})
//     if (response.success) {
//       yield put(dummyAction(response.data))
//       history.push("/dashboard")
//     } else {
//       for (const group in response.errors) {
//         response.errors[group].map(msg => toastr.warning(msg))
//       }
//     }
//   } catch (error) {}
// }

function* portfolioSaga() {
  // yield takeEvery(ADD_USER_EXCHANGE, addUserExchangeSaga)
}

export default portfolioSaga
