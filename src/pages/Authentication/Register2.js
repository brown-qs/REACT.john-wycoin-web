import React from "react"
import MetaTags from "react-meta-tags"
import PropTypes from "prop-types"
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Col, Container, Form, Row } from "reactstrap"

import {
  AvForm,
  AvField,
  AvRadioGroup,
  AvRadio,
} from "availity-reactstrap-validation"

// import images
import logodark from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"

import { useSelector, useDispatch } from "react-redux"
import { registerUser } from "../../store/actions"
const Register2 = props => {
  const dispatch = useDispatch()

  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    console.log(values)
    dispatch(registerUser(values, props.history))
  }
  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>{props.t("Register")} | WyCoin</title>
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
                    <div className="my-auto">
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
                      <div>
                        <h5 className="text-primary">{props.t("Welcome!")}</h5>
                        <p className="text-muted">
                          {props.t("Get your free account now.")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <AvForm
                          className="form-horizontal"
                          onValidSubmit={(e, v) => {
                            handleValidSubmit(e, v)
                          }}
                        >
                          <Row className="mb-3">
                            <Col xl={6}>
                              <AvField
                                name="last_name"
                                label={props.t("Last name")}
                                className="form-control"
                                placeholder={props.t("Last name")}
                                type="text"
                                required
                              />
                            </Col>
                            <Col xl={6}>
                              <AvField
                                name="first_name"
                                label={props.t("First name")}
                                className="form-control"
                                placeholder={props.t("First name")}
                                type="text"
                                required
                              />
                            </Col>
                          </Row>
                          <Row className="mb-3">
                            <Col xl={12}>
                              <label>Gender</label> <br />
                              <AvRadioGroup inline name="gender" required>
                                <AvRadio label="Male" value="0" />
                                <AvRadio label="Female" value="1" />
                              </AvRadioGroup>
                            </Col>
                          </Row>
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
                            <AvField
                              name="email"
                              label={props.t("Email")}
                              className="form-control"
                              placeholder={props.t("Email")}
                              type="email"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <AvField
                              name="password"
                              label={props.t("Password")}
                              className="form-control"
                              placeholder={props.t("Password")}
                              type="password"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <AvField
                              name="confirm_password"
                              label={props.t("Repeat password")}
                              className="form-control"
                              placeholder={props.t("Password")}
                              type="password"
                              required
                            />
                          </div>

                          <div>
                            <p className="mb-0">
                              {props.t(
                                "By registering, you agree to terms of use"
                              )}
                            </p>
                          </div>

                          <div className="mt-4">
                            <button
                              className="btn btn-primary w-100"
                              type="submit"
                            >
                              {props.t("Register")}
                            </button>
                          </div>
                        </AvForm>

                        <div className="mt-5 text-center">
                          <p>
                            {props.t("Already have an account?")}
                            <Link
                              to="/login"
                              className="font-weight-medium text-primary"
                            >
                              {" "}
                              {props.t("Login")}
                            </Link>{" "}
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

export default withTranslation()(Register2)

Register2.propTypes = {
  t: PropTypes.any,
}
