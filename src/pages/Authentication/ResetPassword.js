import React from "react"
import MetaTags from "react-meta-tags"
import PropTypes from "prop-types"
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Col, Container, Form, Row, Input } from "reactstrap"

import { AvForm, AvField } from "availity-reactstrap-validation"

// import images
import logodark from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"

const ResetPassword = props => {
  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>Reset Password | WyCoin</title>
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
                        <h5 className="text-primary">
                          {props.t("Reset Password")}
                        </h5>
                        <p className="text-muted">
                          {props.t("Add a new password")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <AvForm className="form-horizontal">
                          <div className="mb-3">
                            <AvField
                              name="password"
                              label={props.t("New password")}
                              className="form-control"
                              placeholder={props.t("Password")}
                              type="password"
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <AvField
                              name="repassword"
                              label={props.t("Repeat password")}
                              className="form-control"
                              placeholder={props.t("Password")}
                              type="password"
                              required
                            />
                          </div>

                          <div className="mt-3 d-grid">
                            <button
                              className="btn btn-primary btn-block "
                              type="submit"
                            >
                              {props.t("Save")}
                            </button>
                          </div>
                        </AvForm>
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

export default withTranslation()(ResetPassword)

ResetPassword.propTypes = {
  t: PropTypes.any,
}
