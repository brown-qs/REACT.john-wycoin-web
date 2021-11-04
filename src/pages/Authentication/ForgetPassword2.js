import React from "react"
import MetaTags from "react-meta-tags"
import PropTypes from "prop-types"
import { withTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Col, Container, Row, Button } from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"

// import images
import logodark from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"

//redux
import { useSelector, useDispatch } from "react-redux"
import { userForgetPassword } from "../../store/actions"

const ForgetPassword2 = props => {

  const dispatch = useDispatch()
  
  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    dispatch(userForgetPassword(values, props.history))
  }
  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>Forget Password | WyCoin</title>
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
                      <div>
                        <h5 className="text-primary">
                          {props.t("Reset Password")}
                        </h5>
                        <p className="text-muted">
                          {props.t("Forgot your password ?")}
                        </p>
                      </div>

                      <div className="mt-4">
                        <div
                          className="alert alert-success text-center mb-4"
                          role="alert"
                        >
                          {props.t("Instructions will be sent to you by email")}
                        </div>

                        <AvForm
                          className="form-horizontal"
                          onValidSubmit={(e, v) => {
                            handleValidSubmit(e, v)
                          }}
                        >
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
                          <div className="mt-3 text-end">
                            <Button
                              className="w-100"
                              color="primary"
                              type="submit"
                            >
                              {props.t("Reset")}
                            </Button>
                          </div>
                        </AvForm>
                        <div className="mt-5 text-center">
                          <p>
                            {props.t("Remember it ?")}{" "}
                            <Link
                              to="pages-login-2"
                              className="fw-medium text-primary"
                            >
                              {" "}
                              {props.t("Login")}{" "}
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
export default withTranslation()(ForgetPassword2)

ForgetPassword2.propTypes = {
  t: PropTypes.any,
}
