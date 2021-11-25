import React, { useEffect } from "react"
import { Redirect } from "react-router-dom"

// Profile
import UserProfile from "../pages/Authentication/user-profile"

// Authentication related pages
import Login2 from "../pages/Authentication/Login2"
import Logout from "../pages/Authentication/Logout"
import Register2 from "../pages/Authentication/Register2"
import TwostepVerification2 from "../pages/Authentication/auth-two-step-verification-2"
import ForgetPassword2 from "../pages/Authentication/ForgetPassword2"
import ConfirmMail2 from "../pages/Authentication/page-confirm-mail-2"
import ResetPassword from "../pages/Authentication/ResetPassword"

// Pages
import Dashboard from "../pages/Dashboard/index"
import Portfolio from "../pages/Portfolio"

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/portfolio", component: Portfolio },

  // //profile
  { path: "/profile", component: UserProfile },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
]

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/register", component: Register2 },
  { path: "/two-step-verification/:email", component: TwostepVerification2 },
  { path: "/login", component: Login2 },
  { path: "/forgot-password", component: ForgetPassword2 },
  { path: "/confirm-mail", component: ConfirmMail2 },
  { path: "/reset-password/:email/:token", component: ResetPassword },

  {
    path: "/coinbase-oauth-redirect",
    component: () => {
      useEffect(() => {
        const params = window.location.search
        if (window.opener) {
          // send them to the opening window
          var queryDict = {}
          location.search
            .substr(1)
            .split("&")
            .forEach(function (item) {
              queryDict[item.split("=")[0]] = item.split("=")[1]
            })
          window.opener.postMessage({
            source: "coinbase-oauth-redirect",
            code: queryDict.code,
          })
          // close the popup
          window.close()
        }
      })
      return (
        <div id="preloader">
          <div id="status">
            <div className="spinner-chase">
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
              <div className="chase-dot" />
            </div>
          </div>
        </div>
      )
    },
  },
]

export { publicRoutes, authProtectedRoutes }
