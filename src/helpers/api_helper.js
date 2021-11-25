import axios from "axios"
import toastr from "toastr"
import "toastr/build/toastr.min.css"

//pass new generated access token here

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
axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

axiosApi
  .get(
    "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/usd.json",
    {
      withCredentials: false,
    }
  )
  .then(({ data }) => {
    localStorage.setItem("eur_rate", data.usd)
  })

if (localStorage.getItem("authUser")) {
  setAuthorizationToken(JSON.parse(localStorage.getItem("authUser")).token)
}

export { axiosApi }

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
