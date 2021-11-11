import PropTypes from "prop-types"
import React, { useState } from "react"

import { connect } from "react-redux"
import { Row, Col } from "reactstrap"
import ReactDrawer from "react-drawer"
import "react-drawer/lib/react-drawer.css"
import { Link } from "react-router-dom"

// Reactstrap
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown"
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown"
import InboxDropdown from "../CommonForBoth/TopbarDropdown/InboxDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"
import RightSidebar from "../CommonForBoth/RightSidebar"
import megamenuImg from "../../assets/images/megamenu-img.png"

// import images
import github from "../../assets/images/brands/github.png"
import bitbucket from "../../assets/images/brands/bitbucket.png"
import dribbble from "../../assets/images/brands/dribbble.png"
import dropbox from "../../assets/images/brands/dropbox.png"
import mail_chimp from "../../assets/images/brands/mail_chimp.png"
import slack from "../../assets/images/brands/slack.png"

import favicon from "../../assets/images/favicon.svg"

//i18n
import { withTranslation } from "react-i18next"

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
} from "../../store/actions"

const Header = props => {
  const [search, setsearch] = useState(false)
  const [megaMenu, setmegaMenu] = useState(false)
  const [socialDrp, setsocialDrp] = useState(false)
  const [theme, settheme] = useState(0)

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const [position, setPosition] = useState()
  const [open, setOpen] = useState(false)

  const toggleTopDrawer = () => {
    setPosition("right")
    setOpen(!open)
  }

  const onDrawerClose = () => {
    setOpen(false)
  }

  const toggleTheme = () => {
    if (localStorage.getItem("theme") != "dark") {
      localStorage.setItem("theme", "dark")
      location.reload()
    } else {
      localStorage.setItem("theme", "light")
      location.reload()
    }
  }

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        )
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }
  }

  function tToggle() {
    var body = document.body
    if (window.screen.width <= 998) {
      body.classList.toggle("sidebar-enable")
    } else {
      body.classList.toggle("vertical-collpsed")
      body.classList.toggle("sidebar-enable")
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box d-lg-none d-md-block">
              <Link to="/" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={favicon} alt="" width="70" />
                </span>
              </Link>

              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={favicon} alt="" width="70" />
                </span>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => {
                tToggle()
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen()
                }}
                className="btn header-item noti-icon "
                data-toggle="fullscreen"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>{" "}
            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleTheme()
                }}
                className="btn header-item noti-icon "
                data-toggle="fullscreen"
              >
                <i className={localStorage.getItem("theme") == "dark" ? "bx bx-moon" : "bx bxs-sun"} />
              </button>
            </div>{" "}
          </div>
          <Dropdown
            className="d-none d-lg-block ms-2"
            isOpen={megaMenu}
            toggle={() => {
              setmegaMenu(!megaMenu)
            }}
          >
            <DropdownToggle className="btn header-item " caret tag="button">
              {" "}
              {props.t("USD")} <i className="mdi mdi-chevron-down" />
            </DropdownToggle>
            <DropdownMenu style={{minWidth: 'auto'}}>
              <DropdownItem
                onClick={() => settheme(0)}
                className={`${theme === 0 ? "active" : "none"}`}
              >
                {props.t("USD")}
              </DropdownItem>
              <DropdownItem
                onClick={() => settheme(1)}
                className={`${theme === 1 ? "active" : "none"}`}
              >
                {props.t("EUR")}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <div className="d-flex">
            <LanguageDropdown />

            <InboxDropdown />
            <NotificationDropdown />
            <ProfileMenu />
            {/* 
            <div
              onClick={toggleTopDrawer}
              disabled={open}
              className="dropdown d-inline-block"
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle "
              >
                <i className="bx bx-cog bx-spin" />
              </button>
            </div> */}
          </div>
        </div>
      </header>
      <ReactDrawer open={open} position={position} onClose={onDrawerClose}>
        <RightSidebar onClose={onDrawerClose} />
      </ReactDrawer>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
