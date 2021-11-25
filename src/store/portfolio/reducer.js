import {
  ADD_USER_EXCHANGE,
  LOAD_USER_EXCHANGE,
  LOAD_EXCHANGE_TRANSACTIONS,
} from "./actionTypes"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

const initialState = {
  userExchanges: [],
  userExchangesLoaded: false,
  exchangeTransactions: {},
}

const portfolio = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER_EXCHANGE:
      state = {
        ...state,
        userExchanges: [...state.userExchanges, action.payload],
      }
      break
    case LOAD_USER_EXCHANGE:
      state = {
        ...state,
        userExchanges: [...action.payload],
        userExchangesLoaded: true,
      }
    case LOAD_EXCHANGE_TRANSACTIONS:
      let newState = { ...state.exchangeTransactions }
      newState[action.payload.id] = action.payload.transactions
      state = {
        ...state,
        exchangeTransactions: newState,
      }
    default:
      state = { ...state }
      break
  }
  return state
}

export default portfolio
