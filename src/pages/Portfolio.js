import MetaTags from "react-meta-tags"
import React, { useEffect, useState, useRef } from "react"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Nav,
  Row,
} from "reactstrap"
import { connect } from "react-redux"
// datatable related plugins
import { withTranslation } from "react-i18next"
// Web3
//Import Breadcrumb
import { del, get, post } from "../helpers/api_helper"
import { loadUserExchanges, loadExchangeTransactions } from "../store/actions"
import CrudPortfolio from "../components/Portfolio/CrudPortfolio"
import CrudManualTransaction from "../components/Portfolio/CrudManualTransaction"
import PortfolioNavItem from "../components/Portfolio/PortfolioNavItem"
import TransactionTable from "../components/Portfolio/TransactionTable"

const Portfolio = props => {
  useEffect(() => {
    if (props.exchangesLoaded === false) {
      get("get-portfolios").then(({ data }) => {
        props.loadUserExchanges(data)
      })
    }
  }, [])

  const [selectedExchangeId, setselectedExchangeId] = useState("1")
  const [transactionAddingPortfolio, settransactionAddingPortfolio] =
    useState(0)

  const toggleExchange = tab => {
    console.log(selectedExchangeId)
    console.log(tab)
    if (selectedExchangeId !== tab) {
      setselectedExchangeId(tab)
      if (props.transactions[tab]) return
      get("load-portfolio-transactions/" + tab).then(({ data }) => {
        props.loadExchangeTransactions({ id: tab, transactions: data })
      })
    }
  }
  const crudPortfolio = useRef()
  const crudManualTransaction = useRef()
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Portfolio | WyCoin</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Row>
            <Col xs="12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-0 font-size-18">{props.t("Wallet")}</h4>
                <Button
                  color="primary"
                  className="float-end"
                  onClick={() => {
                    crudPortfolio.current.setmodal_add_portfolio(true)
                  }}
                >
                  <i className="mdi mdi-wallet-plus-outline"> </i>{" "}
                  {props.t("Add a portfolio")}
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Card>
                <CardHeader>
                  {/*Adding Manual Transaction*/}
                  <div className="d-flex justify-content-between">
                    <span>{props.t("Total")}: </span>
                    <span className="text-primary h2 float-end">
                      12 658,58$
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>{props.t("Profit/Loss")}: </span>
                    <span className="text-success float-end">
                      + 2548,25$
                    </span>{" "}
                  </div>
                </CardHeader>
                <CardBody>
                  <CardTitle className="h4">
                    <i className="bx bxs-bar-chart-alt-2 h2 text-primary me-2"></i>{" "}
                    {props.t("All exchanges")}
                  </CardTitle>
                </CardBody>
                <Nav tabs className="flex-column nav-tabs-custom mb-3">
                  {props.exchanges.map(ex => (
                    <PortfolioNavItem
                      isActive={selectedExchangeId === ex.id}
                      key={ex.id}
                      onToggleExchange={() => {
                        toggleExchange(ex.id)
                      }}
                      onSettransactionAddingPortfolio={() => {
                        settransactionAddingPortfolio(ex.id)
                        crudManualTransaction.current.setmodal_manual_add_transaction(
                          true
                        )
                      }}
                      portfolio={ex}
                    />
                  ))}
                </Nav>
              </Card>
            </Col>
            <Col md={9}>
              <TransactionTable selectedExchangeId={selectedExchangeId} />
            </Col>
          </Row>
        </Container>
        <CrudPortfolio
          refTo={crudPortfolio}
          onManualPortfolioCreated={portfolioId => {
            settransactionAddingPortfolio(portfolioId)
            toggleExchange(portfolioId)
            crudManualTransaction.current.setmodal_manual_add_transaction(true)
          }}
        />
        <CrudManualTransaction
          refTo={crudManualTransaction}
          portfolioId={transactionAddingPortfolio}
        />
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    exchanges: state.Portfolio.userExchanges,
    exchangesLoaded: state.Portfolio.userExchangesLoaded,
    transactions: state.Portfolio.exchangeTransactions,
  }
}

export default connect(mapStateToProps, {
  loadUserExchanges,
  loadExchangeTransactions,
})(withTranslation()(Portfolio))
