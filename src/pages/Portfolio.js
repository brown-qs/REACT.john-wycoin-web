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
  Modal,
} from "reactstrap"
import { connect } from "react-redux"
import { withTranslation } from "react-i18next"
import BlockUi from "react-block-ui"
import SweetAlert from "react-bootstrap-sweetalert"
import "react-block-ui/style.css"

import { exchangeData, howToAddData } from "../common/data/exchanges"
// Web3
//Import Breadcrumb
import { del, get, post } from "../helpers/api_helper"
import {
  loadUserExchanges,
  loadExchangeTransactions,
  loadPortfolio,
  removePortfolio,
  removeTransactions,
} from "../store/actions"
import CrudPortfolio from "../components/Portfolio/CrudPortfolio"
import CrudManualTransaction from "../components/Portfolio/CrudManualTransaction"
import PortfolioNavItem from "../components/Portfolio/PortfolioNavItem"
import TransactionTable from "../components/Portfolio/TransactionTable"
import CoinTable from "../components/Portfolio/CoinTable"

const Portfolio = props => {
  useEffect(() => {
    if (props.exchangesLoaded === false) {
      setisPortfolioListLoading(true)
      get("get-portfolios").then(({ data }) => {
        props.loadUserExchanges(data)
        setisPortfolioListLoading(false)
      })
    }
    setInterval(loadPortfolio, 1000 * 60)
  }, [])

  const [selectedExchangeId, setselectedExchangeId] = useState(null)
  const [selectedCoin, setselectedCoin] = useState("1")
  const [transactionAddingPortfolio, settransactionAddingPortfolio] =
    useState(0)
  const [isPortfolioListLoading, setisPortfolioListLoading] = useState(false)
  const [isPortfolioFilterOpen, setisPortfolioFilterOpen] = useState(false)
  const [selectedPortfolioFilter, setselectedPortfolioFilter] = useState("all")
  const [deletingPortfolio, setdeletingPortfolio] = useState(null)
  const [deletingCoin, setdeletingCoin] = useState(null)
  const [deletingTransaction, setdeletingTransaction] = useState(null)
  const [tableView, settableView] = useState("coin")

  const loadPortfolio = tab => {
    if (tab == undefined) tab = selectedExchangeId
    if (tab == null) return
    get("load-portfolio-coins/" + tab).then(({ data }) => {
      props.loadPortfolio({ id: tab, data })
    })
    get("load-portfolio-transactions/" + tab).then(({ data }) => {
      props.loadExchangeTransactions({
        id: tab,
        transactions: data,
      })
    })
  }

  const toggleExchange = (tab, force = false) => {
    if (selectedExchangeId !== tab || force) {
      setselectedExchangeId(tab)
      loadPortfolio(tab)
    }
    settableView("coin")
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
              <BlockUi tag="div" blocking={isPortfolioListLoading}>
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
                              {props.t("All Portfolios")}
                            </React.Fragment>
                          )}
                          {selectedPortfolioFilter == "custom" && (
                            <React.Fragment>
                              <i className="fas fa-briefcase font-size-24 text-primary me-2"></i>{" "}
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
                                  width={25}
                                  height={25}
                                />
                                {props.t(
                                  exchangeData.find(
                                    exData =>
                                      exData.id == selectedPortfolioFilter
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
                              isPortfolioFilterOpen === "all"
                                ? "active"
                                : "none"
                            }`}
                          >
                            <i className="bx bxs-bar-chart-alt-2 h2 text-primary me-2"></i>{" "}
                            {props.t("All Portfolios")}
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
                                    width={25}
                                    height={25}
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
                            <i className="fas fa-briefcase font-size-24 text-primary me-2"></i>{" "}
                            {props.t("Custom")}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </CardTitle>
                  </CardBody>
                  {deletingPortfolio != null ? (
                    <SweetAlert
                      title="Are you sure?"
                      warning
                      showCancel
                      confirmButtonText="Yes, delete it!"
                      confirmBtnBsStyle="success"
                      cancelBtnBsStyle="danger"
                      onConfirm={() => {
                        props.removePortfolio(deletingPortfolio)
                        post("delete-portfolio", {
                          id: deletingPortfolio,
                        })
                        setdeletingPortfolio(null)
                        if (selectedExchangeId == deletingPortfolio)
                          setselectedExchangeId(null)
                      }}
                      onCancel={() => setdeletingPortfolio(null)}
                    >
                      You won&apos;t be able to revert this!
                    </SweetAlert>
                  ) : null}
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
                              crudManualTransaction.current.newTransaction(true)
                            }}
                            onEdit={() => {
                              crudPortfolio.current.edit_portfolio(ex)
                            }}
                            onDelete={() => {
                              setdeletingPortfolio(ex.id)
                            }}
                            portfolio={ex}
                          />
                        )
                    )}
                  </Nav>
                </Card>
              </BlockUi>
            </Col>
            <Col md={9}>
              <BlockUi
                tag="div"
                blocking={
                  selectedExchangeId != null &&
                  (props.transactions[selectedExchangeId] == undefined ||
                    props.portfolioInfos[selectedExchangeId] == undefined)
                }
              >
                {deletingTransaction != null ? (
                  <SweetAlert
                    title="Are you sure?"
                    warning
                    showCancel
                    confirmButtonText="Yes, delete it!"
                    confirmBtnBsStyle="success"
                    cancelBtnBsStyle="danger"
                    onConfirm={() => {
                      let removingTransactions = [deletingTransaction]
                      props.removeTransactions({
                        portfolio: selectedExchangeId,
                        transactions: removingTransactions,
                      })
                      post("/transaction/delete", {
                        transactions: [deletingTransaction.id],
                      })
                      setdeletingTransaction(null)
                    }}
                    onCancel={() => setdeletingTransaction(null)}
                  >
                    You won&apos;t be able to revert this!
                  </SweetAlert>
                ) : null}
                {tableView == "transaction" && (
                  <TransactionTable
                    selectedExchangeId={selectedExchangeId}
                    selectedCoin={selectedCoin}
                    isCustom={
                      (
                        (props.exchanges || []).find(
                          ({ id }) => id == selectedExchangeId
                        ) || {}
                      ).exchange == "custom"
                    }
                    onDeleteTransaction={transaction => {
                      setdeletingTransaction(transaction)
                    }}
                    onModifyTransacion={transaction => {
                      crudManualTransaction.current.editTransaction(transaction)
                      settransactionAddingPortfolio(transaction.portfolio_id)
                    }}
                  />
                )}
                {deletingCoin != null ? (
                  <SweetAlert
                    title="Are you sure?"
                    warning
                    showCancel
                    confirmButtonText="Yes, delete it!"
                    confirmBtnBsStyle="success"
                    cancelBtnBsStyle="danger"
                    onConfirm={() => {
                      let removingTransactions = (
                        props.transactions[selectedExchangeId] || []
                      ).filter(el => el.coin == deletingCoin)
                      props.removeTransactions({
                        portfolio: selectedExchangeId,
                        transactions: removingTransactions,
                      })
                      post("/transaction/delete", {
                        transactions: removingTransactions.map(tr => tr.id),
                      })
                      setdeletingCoin(null)
                    }}
                    onCancel={() => setdeletingCoin(null)}
                  >
                    You won&apos;t be able to revert this!
                  </SweetAlert>
                ) : null}
                {tableView == "coin" && (
                  <CoinTable
                    selectedExchangeId={selectedExchangeId}
                    onViewTransactions={coin => {
                      settableView("transaction")
                      setselectedCoin(coin)
                    }}
                    onDeleteCoin={coin => {
                      setdeletingCoin(coin)
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
              </BlockUi>
            </Col>
          </Row>
        </Container>
        <CrudPortfolio
          refTo={crudPortfolio}
          onManualPortfolioCreated={portfolioId => {
            settransactionAddingPortfolio(portfolioId)
            crudManualTransaction.current.newTransaction(true)
          }}
          onAddPortfolio={portfolioId => {
            toggleExchange(portfolioId)
          }}
          onUpdatePortfolio={portfolioId => {
            toggleExchange(portfolioId, true)
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
  removePortfolio,
  removeTransactions,
})(withTranslation()(Portfolio))
