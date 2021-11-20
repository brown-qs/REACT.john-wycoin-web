import axios from "axios"
import accessToken from "./jwt-token-access/accessToken"

//pass new generated access token here
const token = accessToken

//apply base url for axios
// const API_URL = 'https://api.wycoin.fr/api';
const API_URL = process.env.REACT_APP_API_URL

const axiosApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 500 // default
  },
})
if (localStorage.getItem('authUser')) {
  axiosApi.defaults.headers.common["Authorization"] = JSON.parse(localStorage.getItem('authUser')).token
}

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export function setAuthorizationToken(token) {
  axiosApi.defaults.headers.common["Authorization"] = "Bearer " + token
}

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => {
    if (response.status === 401) {
      localStorage.removeItem("authUser")
      location.href = "/login"
      throw "Unauthorized"
    }
    if (!response.data.success) {
      for (const group in response.data.errors) {
        response.data.errors[group].map(msg => toastr.warning(msg))
      }
      throw response.data
    }
    return response.data
  })
}

export async function post(url, data, config = {}) {
  return axiosApi.post(url, { ...data }, { ...config }).then(response => {
    if (response.status === 401) {
      localStorage.removeItem("authUser")
      location.href = "/login"
      throw "Unauthorized"
    }
    if (!response.data.success) {
      for (const group in response.data.errors) {
        response.data.errors[group].map(msg => toastr.warning(msg))
      }
      throw response.data
    }
    return response.data
  })
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}
