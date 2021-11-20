import {
  DUMMY_ACTION
} from "./actionTypes"

export const dummyAction = (data, history) => {
  return {
    type: DUMMY_ACTION,
    payload: { data, history },
  }
}
