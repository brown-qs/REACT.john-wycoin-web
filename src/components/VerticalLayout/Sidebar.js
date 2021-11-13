import PropTypes from "prop-types"
import React from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//i18n
import { withTranslation } from "react-i18next"
import SidebarContent from "./SidebarContent"

import { Link } from "react-router-dom"

import favicon from "../../assets/images/favicon.svg"
import logoLight from "../../assets/images/logo-light.svg"
import logoDark from "../../assets/images/logo-dark.svg"

const Sidebar = props => {
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={favicon} alt="" width="50" />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" width="125" />
            </span>
          </Link>
          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={favicon} alt="" width="50" />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="" width="125" />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
}

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  }
}
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)))
