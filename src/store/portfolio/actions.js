import {
  ADD_USER_EXCHANGE,
  LOAD_USER_EXCHANGE,
  LOAD_EXCHANGE_TRANSACTIONS,
  ADD_CUSTOM_TRANSACTION,
} from "./actionTypes"

export const addUserExchange = newExchange => {
  return {
    type: ADD_USER_EXCHANGE,
    payload: newExchange,
  }
}
export const addCustomTransaction = (portfolioId, transaction) => {
  return {
    type: ADD_CUSTOM_TRANSACTION,
    payload: { id: portfolioId, data: transaction },
  }
}

export const loadUserExchanges = exchanges => {
  return {
    type: LOAD_USER_EXCHANGE,
    payload: exchanges,
  }
}

export const loadExchangeTransactions = data => {
  return {
    type: LOAD_EXCHANGE_TRANSACTIONS,
    payload: data,
  }
}
