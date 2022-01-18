import {
  ADD_USER_EXCHANGE,
  LOAD_USER_EXCHANGE,
  LOAD_EXCHANGE_TRANSACTIONS,
  ADD_CUSTOM_TRANSACTION,
  LOAD_PORTFOLIO_COINS,
  REMOVE_PORTFOLIO,
  UPDATE_PORTFOLIO,
} from "./actionTypes"

import toastr from "toastr"
import "toastr/build/toastr.min.css"

const initialState = {
  userExchanges: [],
  userExchangesLoaded: false,
  exchangeTransactions: {},
  portfolioInfos: {},
}

const portfolio = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case ADD_USER_EXCHANGE:
      state = {
        ...state,
        userExchanges: [...state.userExchanges, action.payload],
      }
      break
    case ADD_CUSTOM_TRANSACTION:
      newState = { ...state.exchangeTransactions }
      newState[action.payload.id] = [
        ...newState[action.payload.id],
        action.payload.data,
      ]
      state = {
        ...state,
        exchangeTransactions: newState,
      }
      break
    case LOAD_USER_EXCHANGE:
      state = {
        ...state,
        userExchanges: [...action.payload],
        userExchangesLoaded: true,
      }
      break
    case LOAD_PORTFOLIO_COINS:
      newState = { ...state.portfolioInfos }
      newState[action.payload.id] = action.payload.data
      state = {
        ...state,
        portfolioInfos: newState,
      }
      break
    case LOAD_EXCHANGE_TRANSACTIONS:
      newState = { ...state.exchangeTransactions }
      newState[action.payload.id] = action.payload.transactions
      state = {
        ...state,
        exchangeTransactions: newState,
      }
      break
    case REMOVE_PORTFOLIO: {
      let index = state.userExchanges.findIndex(ex => ex.id == action.payload)
      newState = [...state.userExchanges]
      newState.splice(index, 1)
      state = {
        ...state,
        userExchanges: newState,
      }
      break
    }
    case UPDATE_PORTFOLIO: {
      let index = state.userExchanges.findIndex(
        ex => ex.id == action.payload.id
      )
      newState = [...state.userExchanges]
      newState[index] = action.payload.data
      state = {
        ...state,
        userExchanges: newState,
      }
      break
    }
    default:
      state = { ...state }
      break
  }
  return state
}

export default portfolio
