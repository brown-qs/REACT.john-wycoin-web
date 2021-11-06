import React from "react"
import MetaTags from "react-meta-tags"
import PropTypes from "prop-types"
import { withTranslation } from "react-i18next"

// import images
import logodark from "../../assets/images/logo-dark.png"
import logolight from "../../assets/images/logo-light.png"
import { Col, Container, Row } from "reactstrap"
import { Link } from "react-router-dom"
import Lottie from "react-lottie-player"
import lottieJson from "../../assets/images/lottie-email-sent.json"

const ConfirmMail2 = props => {
  return (
    <React.Fragment>
      <div>
        <MetaTags>
          <title>Confirm Mail | WyCoin</title>
        </MetaTags>
        <Container fluid className="p-0">
          <Row className="row g-0">
            <Col xl={9} className="auth-full-bg">
              <div className="bg-overlay"></div>
            </Col>

            <Col xl={3}>
              <div className="auth-full-page-content p-md-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5">
                      <a href="/" className="d-block auth-logo">
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
                      </a>
                    </div>
                    <div className="my-auto">
                      <div className="text-center">
                        <Lottie
                          loop={false}
                          className="mx-auto"
                          animationData={lottieJson}
                          play
                          style={{ width: 150, height: 150 }}
                        />
                        <div className="p-2 mt-4">
                          <h4>{props.t("Verify your email")}</h4>
                          <p className="text-muted">
                            {props.t(
                              "Click on the link you just received by email to reset your password."
                            )}
                          </p>
                          <div className="mt-5 text-center">
                            <p>
                              {props.t("Remember it ?")}{" "}
                              <Link
                                to="login"
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withTranslation()(ConfirmMail2)

ConfirmMail2.propTypes = {
  t: PropTypes.any,
}
