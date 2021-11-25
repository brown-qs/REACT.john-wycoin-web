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
  NavItem,
  NavLink,
  Row,
} from "reactstrap"
import { connect } from "react-redux"
// datatable related plugins
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator"
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"
import { withTranslation } from "react-i18next"
// Web3
//Import Breadcrumb
import Breadcrumbs from "../components/Common/Breadcrumb"
import classnames from "classnames"
import { exchangeData, howToAddData } from "../common/data/exchanges"
import { del, get, post } from "../helpers/api_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import {
  addUserExchange,
  loadUserExchanges,
  loadExchangeTransactions,
} from "../store/actions"
import CrudPortfolio from "../components/Portfolio/CrudPortfolio"
import CrudManualTransaction from "../components/Portfolio/CrudManualTransaction"

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
    if (selectedExchangeId !== tab) {
      setselectedExchangeId(tab)
      if (props.transactions[tab]) return
      get("load-portfolio-transactions/" + tab).then(({ data }) => {
        props.loadExchangeTransactions({ id: tab, transactions: data })
      })
    }
  }
  const numberFormatter = cell => parseFloat(cell).toFixed(2)
  const moneyFormatter = cell => {
    if (localStorage.getItem("app_currency") == "eur")
      cell =
        parseFloat(cell / localStorage.getItem("eur_rate")).toFixed(2) + " €"
    else cell = parseFloat(cell).toFixed(2) + " $"
    return cell
  }
  const columns = [
    {
      dataField: "coins",
      text: props.t("Coins"),
      sort: true,
      isDummyField: true,
      formatter: (cell, row) => (
        <div>
          <img src={row.coin_img} width="30" />
          <span>{row.coin_label}</span>{" "}
          <span className="text-secondary">{row.coin}</span>
        </div>
      ),
    },
    {
      dataField: "date",
      text: props.t("Date"),
      sort: true,
    },
    {
      dataField: "pair",
      text: props.t("Pair"),
      sort: true,
      isDummyField: true,
      formatter: (cell, row) => row.coin + "/" + row.pair_coin,
    },
    {
      dataField: "quantity",
      text: props.t("Quantity"),
      sort: true,
      formatter: numberFormatter,
    },
    {
      dataField: "amount",
      text: props.t("Amount paid"),
      sort: true,
      formatter: moneyFormatter,
    },
    {
      dataField: "purchase_price",
      text: props.t("Purchase Price"),
      sort: true,
      formatter: moneyFormatter,
    },
    {
      dataField: "fees",
      text: props.t("Fees"),
      sort: true,
    },
    {
      dataField: "profit_lose_amount",
      text: props.t("Profit/Loss"),
      sort: true,
      formatter: moneyFormatter,
    },
    {
      dataField: "current_value",
      text: props.t("Current Value"),
      formatter: moneyFormatter,
    },
  ]
  const defaultSorted = [
    {
      dataField: "coins",
      order: "asc",
    },
  ]
  const pageOptions = {
    sizePerPage: 10,
    totalSize: props.transactions.length, // replace later with size(customers),
    custom: true,
  }
  const { SearchBar } = Search

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
          <Breadcrumbs title="Portfolio" breadcrumbItem={props.t("Wallet")} />
          <Row>
            <Col md={3}>
              <Card>
                <CardHeader>
                  <Button
                    color="primary"
                    className="w-100"
                    size="sm"
                    onClick={() => {
                      crudPortfolio.current.setmodal_add_portfolio(true)
                    }}
                  >
                    <i className="mdi mdi-wallet-plus-outline"> </i>{" "}
                    {props.t("Add a portfolio")}
                  </Button>
                  {/*Adding Manual Transaction*/}
                </CardHeader>
                <CardBody>
                  <CardTitle className="h4">
                    <i className="bx bxs-bar-chart-alt-2 h2 text-primary me-2"></i>{" "}
                    {props.t("All exchanges")}
                  </CardTitle>
                </CardBody>
                <Nav tabs className="flex-column nav-tabs-custom mb-3">
                  {props.exchanges.map(ex => {
                    if (ex.exchange === "custom") {
                      return (
                        <NavItem key={ex.id}>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: selectedExchangeId === ex.id,
                            })}
                            onClick={() => {
                              toggleExchange(ex.id)
                            }}
                          >
                            <i
                              className={
                                "h5 me-1 mdi mdi-" +
                                (ex.metadata.icon ??
                                  "briefcase-variant-outline")
                              }
                              style={{ color: ex.metadata.color }}
                            ></i>{" "}
                            <button
                              onClick={e => {
                                settransactionAddingPortfolio(ex.id)
                                crudManualTransaction.current.setmodal_manual_add_transaction(
                                  true
                                )
                              }}
                              className="btn float-end btn-primary px-1 py-0"
                              style={{ borderRadius: "50%" }}
                            >
                              <i className="mdi mdi-plus" />
                            </button>
                            {ex.title}
                          </NavLink>
                        </NavItem>
                      )
                    } else {
                      let exchangeInfo = exchangeData.find(
                        exData => exData.id == ex.exchange
                      )
                      return (
                        <NavItem key={ex.id}>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: selectedExchangeId === ex.id,
                            })}
                            onClick={() => {
                              toggleExchange(ex.id)
                            }}
                          >
                            <img src={exchangeInfo.img} />
                            {ex.title}
                          </NavLink>
                        </NavItem>
                      )
                    }
                  })}
                </Nav>
              </Card>
            </Col>
            <Col md={9}>
              <Card>
                <CardBody>
                  <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                    keyField="index"
                    columns={columns}
                    data={props.transactions[selectedExchangeId] ?? []}
                  >
                    {({ paginationProps, paginationTableProps }) => (
                      <ToolkitProvider
                        keyField="index"
                        columns={columns}
                        data={props.transactions[selectedExchangeId] ?? []}
                        search
                      >
                        {toolkitProps => (
                          <React.Fragment>
                            <div className="d-flex justify-content-between">
                              <div className="d-inline">
                                <SizePerPageDropdownStandalone
                                  {...paginationProps}
                                />
                              </div>
                              <div className="search-box me-2 mb-2 d-inline-block">
                                <div className="position-relative">
                                  <SearchBar {...toolkitProps.searchProps} />
                                  <i className="bx bx-search-alt search-icon" />
                                </div>
                              </div>
                            </div>

                            <Row>
                              <Col xl="12">
                                <div className="table-responsive">
                                  <BootstrapTable
                                    keyField={"index"}
                                    responsive
                                    bordered={false}
                                    striped={false}
                                    defaultSorted={defaultSorted}
                                    classes={"table align-middle table-nowrap"}
                                    headerWrapperClasses={"thead-light"}
                                    {...toolkitProps.baseProps}
                                    {...paginationTableProps}
                                  />
                                </div>
                              </Col>
                            </Row>

                            <Row className="align-items-md-center mt-30">
                              <Col className="inner-custom-pagination d-flex">
                                <div className="text-md-right ms-auto">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </React.Fragment>
                        )}
                      </ToolkitProvider>
                    )}
                  </PaginationProvider>
                </CardBody>
              </Card>
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
  addUserExchange,
  loadUserExchanges,
  loadExchangeTransactions,
})(withTranslation()(Portfolio))
