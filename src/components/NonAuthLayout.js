import React, { Suspense, lazy } from "react"
import PropTypes from "prop-types"
import { withRouter } from "react-router-dom"

const NonAuthLayout = props => {
  const Theme = lazy(() =>
    import(
      `./Theme/${
        localStorage.getItem("APP_THEME") == "dark" ? "Dark" : "Light"
      }Theme`
    )
  )
  return (
    <React.Fragment>
      <Suspense
        fallback={
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
        }
      >
        <Theme />
        {props.children}
      </Suspense>
    </React.Fragment>
  )
}

NonAuthLayout.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object,
}

export default withRouter(NonAuthLayout)
