import React from "react"
import MetaTags from "react-meta-tags"
import PropTypes from "prop-types"
import { withTranslation } from "react-i18next"

//Verification code package
import AuthCode from "react-auth-code-input"

// import images
import logodark from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"
import { Col, Form, FormGroup, Label, Row } from "reactstrap"
import { Link } from "react-router-dom"

const TwostepVerification2 = props => {
  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>
            Two Step Verification 2 | Skote - React Admin & Dashboard Template
          </title>
        </MetaTags>
        <div className="container-fluid p-0">
          <div className="row g-0">
            <Col xl={9} className="auth-full-bg">
              <div className="bg-overlay"></div>
            </Col>
            <Col xl={3}>
              <div className="auth-full-page-content p-md-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5">
                      <Link to="dashboard" className="d-block auth-logo">
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
                      <div className="text-center">
                        <div className="avatar-md mx-auto">
                          <div className="avatar-title rounded-circle bg-light">
                            <i className="bx bxs-envelope h1 mb-0 text-primary"></i>
                          </div>
                        </div>
                        <div className="p-2 mt-4">
                          <h4>{props.t("Verify your email")}</h4>
                          <p>
                            {props.t(
                              "And enter the 4 digit code you received on"
                            )}{" "}
                            :{" "}
                            <span className="font-weight-semibold">
                              example@abc.com
                            </span>
                          </p>

                          <Form>
                            <Row>
                              <Col xs={12}>
                                <FormGroup className="verification-2 mb-3">
                                  <Label
                                    htmlFor="digit1-input"
                                    className="visually-hidden"
                                  >
                                    Dight 1
                                  </Label>
                                  <AuthCode
                                    characters={4}
                                    className="form-control form-control-lg text-center"
                                    inputStyle={{
                                      width: "50px",
                                      height: "calc(1.5em + 1rem + 2px)",
                                      padding: ".5rem 1rem",
                                      borderRadius: "8px",
                                      fontSize: "1.01562rem",
                                      textAlign: "center",
                                      marginRight: "15px",
                                      border: "1px solid #ced4da",
                                      textTransform: "uppercase",
                                      borderRadius: ".4rem",
                                    }}
                                    onChange={() => null}
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </Form>

                          <div className="mt-4">
                            <Link
                              to="dashboard"
                              className="btn btn-primary w-100"
                            >
                              {props.t("Confirm")}
                            </Link>
                          </div>
                          <div className="mt-5 text-center">
                            <p>
                              {props.t("Already have an account?")}
                              <Link
                                to="login"
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
              </div>
            </Col>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
export default withTranslation()(TwostepVerification2)

TwostepVerification2.propTypes = {
  t: PropTypes.any,
}
