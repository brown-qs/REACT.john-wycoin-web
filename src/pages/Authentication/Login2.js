import React from "react"
import MetaTags from "react-meta-tags"
import PropTypes from "prop-types"
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Col, Container, Form, Row, Input, Alert } from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

// import images
import logodark from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"

//redux
import { useSelector, useDispatch } from "react-redux"

import { loginUser, apiError } from "../../store/actions"

const Login2 = props => {
  const dispatch = useDispatch()
  const { error } = useSelector(state => ({
    error: state.Login.error,
  }))

  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    dispatch(loginUser(values, props.history))
  }
  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>Login | WyCoin</title>
        </MetaTags>
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col xl={9} className="auth-full-bg">
              <div className="bg-overlay"></div>
            </Col>

            <Col xl={3}>
              <div className="auth-full-page-content p-md-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img
                          src={logodark}
                          alt=""
                          className="auth-logo-dark img-fluid"
                        />
                        <img
                          src={logolight}
                          alt=""
                          className="auth-logo-light img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="my-auto">
                      <div>
                        <h5 className="text-primary">{props.t("Welcome!")}</h5>
                        <p className="text-muted">
                          {props.t("Sign in to continue")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <AvForm
                          className="form-horizontal"
                          onValidSubmit={(e, v) => {
                            handleValidSubmit(e, v)
                          }}
                        >
                          {error ? <Alert color="danger">{JSON.stringify(error)}</Alert> : null}
                          <div className="mb-3">
                            <AvField
                              name="username"
                              label={props.t("Username")}
                              className="form-control"
                              placeholder={props.t("Username")}
                              type="text"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <div className="float-end">
                              <Link to="forgot-password" className="text-muted">
                                {props.t("Forgot password ?")}
                              </Link>
                            </div>
                            <AvField
                              name="password"
                              label={props.t("Password")}
                              className="form-control"
                              placeholder={props.t("Password")}
                              type="password"
                              required
                            />
                          </div>

                          <div className="form-check">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="auth-remember-check"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="auth-remember-check"
                            >
                              {props.t("Remember me")}
                            </label>
                          </div>

                          <div className="mt-3 d-grid">
                            <button
                              className="btn btn-primary btn-block "
                              type="submit"
                            >
                              {props.t("Log In")}
                            </button>
                          </div>
                        </AvForm>

                        <div className="mt-5 text-center">
                          <p>
                            {props.t("Don't have an account ?")}
                            <Link
                              to="register"
                              className="fw-medium text-primary"
                            >
                              {" "}
                              {props.t("Signup now")}
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withTranslation()(Login2)

Login2.propTypes = {
  t: PropTypes.any,
  history: PropTypes.any,
}
