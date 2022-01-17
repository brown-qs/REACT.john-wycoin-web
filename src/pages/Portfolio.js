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
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Nav,
  Row,
} from "reactstrap"
import { connect } from "react-redux"
import { withTranslation } from "react-i18next"

import { exchangeData, howToAddData } from "../common/data/exchanges"
// Web3
//Import Breadcrumb
import { del, get, post } from "../helpers/api_helper"
import {
  loadUserExchanges,
  loadExchangeTransactions,
  loadPortfolio,
} from "../store/actions"
import CrudPortfolio from "../components/Portfolio/CrudPortfolio"
import CrudManualTransaction from "../components/Portfolio/CrudManualTransaction"
import PortfolioNavItem from "../components/Portfolio/PortfolioNavItem"
import TransactionTable from "../components/Portfolio/TransactionTable"
import CoinTable from "../components/Portfolio/CoinTable"

const Portfolio = props => {
  useEffect(() => {
    if (props.exchangesLoaded === false) {
      get("get-portfolios").then(({ data }) => {
        props.loadUserExchanges(data)
      })
    }
  }, [])

  const [selectedExchangeId, setselectedExchangeId] = useState("1")
  const [selectedCoin, setselectedCoin] = useState("1")
  const [transactionAddingPortfolio, settransactionAddingPortfolio] =
    useState(0)

  const [isPortfolioFilterOpen, setisPortfolioFilterOpen] = useState(false)
  const [selectedPortfolioFilter, setselectedPortfolioFilter] = useState("all")
  const [tableView, settableView] = useState("coin")

  const toggleExchange = tab => {
    if (selectedExchangeId !== tab) {
      setselectedExchangeId(tab)
      settableView("coin")
      if (!props.portfolioInfos[tab]) {
        get("load-portfolio-coins/" + tab).then(({ data }) => {
          props.loadPortfolio({ id: tab, data })
        })
      }
      if (!props.transactions[tab]) {
        get("load-portfolio-transactions/" + tab).then(({ data }) => {
          props.loadExchangeTransactions({ id: tab, transactions: data })
        })
      }
    }
  }
  const crudPortfolio = useRef()
  const crudManualTransaction = useRef()

  const moneyFormatter = cell => {
    if (localStorage.getItem("app_currency") == "eur")
      cell =
        parseFloat(cell / localStorage.getItem("eur_rate")).toFixed(2) + " €"
    else cell = parseFloat(cell).toFixed(2) + " $"
    return cell
  }

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
                      {moneyFormatter(
                        (props.portfolioInfos[selectedExchangeId] || {})
                          .total || "0"
                      )}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>{props.t("Profit/Loss")}: </span>
                    <span
                      className={`text-${
                        ((props.portfolioInfos[selectedExchangeId] || {})
                          .profit || "0") >= 0
                          ? "success"
                          : "danger"
                      } float-end`}
                    >
                      {moneyFormatter(
                        (props.portfolioInfos[selectedExchangeId] || {})
                          .profit || "0"
                      )}
                    </span>{" "}
                  </div>
                </CardHeader>
                <CardBody>
                  <CardTitle className="h4">
                    <Dropdown
                      className="w-100"
                      isOpen={isPortfolioFilterOpen}
                      toggle={() => {
                        setisPortfolioFilterOpen(!isPortfolioFilterOpen)
                      }}
                    >
                      <DropdownToggle
                        className="btn w-100 text-start"
                        caret
                        tag="button"
                      >
                        {selectedPortfolioFilter == "all" && (
                          <React.Fragment>
                            <i className="bx bxs-bar-chart-alt-2 h2 text-primary me-2"></i>{" "}
                            {props.t("All exchanges")}
                          </React.Fragment>
                        )}
                        {selectedPortfolioFilter == "custom" && (
                          <React.Fragment>
                            <i className="mdi mdi-briefcase-variant-outline h2 text-primary me-2"></i>{" "}
                            {props.t("Custom")}
                          </React.Fragment>
                        )}
                        {selectedPortfolioFilter != "all" &&
                          selectedPortfolioFilter != "custom" && (
                            <React.Fragment>
                              <img
                                className="me-2"
                                src={
                                  exchangeData.find(
                                    exData =>
                                      exData.id == selectedPortfolioFilter
                                  ).img
                                }
                                width={30}
                                height={30}
                              />
                              {props.t(
                                exchangeData.find(
                                  exData => exData.id == selectedPortfolioFilter
                                ).label
                              )}
                            </React.Fragment>
                          )}
                        <i className="mdi mdi-chevron-down float-end" />
                      </DropdownToggle>
                      <DropdownMenu
                        style={{ minWidth: "auto" }}
                        className="w-100"
                      >
                        <DropdownItem
                          onClick={() => {
                            setselectedPortfolioFilter("all")
                          }}
                          className={`${
                            isPortfolioFilterOpen === "all" ? "active" : "none"
                          }`}
                        >
                          <i className="bx bxs-bar-chart-alt-2 h2 text-primary me-2"></i>{" "}
                          {props.t("All exchanges")}
                        </DropdownItem>
                        {exchangeData.map(
                          ex =>
                            props.exchanges.find(
                              ({ exchange }) => exchange == ex.id
                            ) && (
                              <DropdownItem
                                key={ex.id}
                                onClick={() => {
                                  setselectedPortfolioFilter(ex.id)
                                }}
                                className={`${
                                  isPortfolioFilterOpen === ex.id
                                    ? "active"
                                    : "none"
                                }`}
                              >
                                <img
                                  className="me-2"
                                  src={ex.img}
                                  width={30}
                                  height={30}
                                />
                                {props.t(ex.label)}
                              </DropdownItem>
                            )
                        )}
                        <DropdownItem
                          onClick={() => {
                            setselectedPortfolioFilter("custom")
                          }}
                          className={`${
                            isPortfolioFilterOpen === "custom"
                              ? "active"
                              : "none"
                          }`}
                        >
                          <i className="mdi mdi-briefcase-variant-outline h2 text-primary me-2"></i>{" "}
                          {props.t("Custom")}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </CardTitle>
                </CardBody>
                <Nav tabs className="flex-column nav-tabs-custom mb-3">
                  {props.exchanges.map(
                    ex =>
                      (selectedPortfolioFilter == "all" ||
                        selectedPortfolioFilter == ex.exchange) && (
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
                      )
                  )}
                </Nav>
              </Card>
            </Col>
            <Col md={9}>
              {tableView == "transaction" && (
                <TransactionTable
                  selectedExchangeId={selectedExchangeId}
                  selectedCoin={selectedCoin}
                />
              )}
              {tableView == "coin" && (
                <CoinTable
                  selectedExchangeId={selectedExchangeId}
                  onViewTransactions={coin => {
                    settableView("transaction")
                    setselectedCoin(coin)
                  }}
                  isCustom={
                    (
                      (props.exchanges || []).find(
                        ({ id }) => id == selectedExchangeId
                      ) || {}
                    ).exchange == "custom"
                  }
                />
              )}
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
    portfolioInfos: state.Portfolio.portfolioInfos,
  }
}

export default connect(mapStateToProps, {
  loadUserExchanges,
  loadExchangeTransactions,
  loadPortfolio,
})(withTranslation()(Portfolio))
