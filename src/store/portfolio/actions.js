import {
  ADD_USER_EXCHANGE,
  LOAD_USER_EXCHANGE,
  LOAD_EXCHANGE_TRANSACTIONS,
  ADD_CUSTOM_TRANSACTION,
  LOAD_PORTFOLIO_COINS,
  REMOVE_PORTFOLIO,
  UPDATE_PORTFOLIO,
  REMOVE_TRANSACTIONS,
  UPDATE_CUSTOM_TRANSACTION,
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

export const updateCustomTransaction = (portfolioId, transaction) => {
  return {
    type: UPDATE_CUSTOM_TRANSACTION,
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

export const loadPortfolio = data => {
  return {
    type: LOAD_PORTFOLIO_COINS,
    payload: data,
  }
}

export const removePortfolio = data => {
  return {
    type: REMOVE_PORTFOLIO,
    payload: data,
  }
}

export const updatePortfolio = data => {
  return {
    type: UPDATE_PORTFOLIO,
    payload: data,
  }
}

export const removeTransactions = data => {
  return {
    type: REMOVE_TRANSACTIONS,
    payload: data,
  }
}
