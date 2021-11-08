import React from "react"
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
import ResetPassword from '../pages/Authentication/ResetPassword'

// Dashboard
import Dashboard from "../pages/Dashboard/index"

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },

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
]

export { publicRoutes, authProtectedRoutes }
