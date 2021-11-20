import {
  DUMMY_ACTION,
} from "./actionTypes"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

const initialState = {
  dummy: null,
}

const dummy = (state = initialState, action) => {
  switch (action.type) {
    case DUMMY_ACTION:
      state = {
        ...state,
        dummy: action.payload
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default dummy
