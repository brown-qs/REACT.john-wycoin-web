import { ADD_USER_EXCHANGE, LOAD_USER_EXCHANGE, LOAD_EXCHANGE_TRANSACTIONS } from "./actionTypes"

export const addUserExchange = newExchange => {
  return {
    type: ADD_USER_EXCHANGE,
    payload: newExchange,
  }
}

export const loadUserExchanges = exchanges => {
  return {
    type: LOAD_USER_EXCHANGE,
    payload: exchanges,
  }
}

export const loadExchangeTransactions = trans => {
  return {
    type: LOAD_EXCHANGE_TRANSACTIONS,
    payload: trans,
  }
}
