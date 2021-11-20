import MetaTags from "react-meta-tags"
import React, { useEffect, useState } from "react"
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Collapse,
  Container,
  Nav,
  NavItem,
  NavLink,
  Modal,
  Progress,
  Row,
  TabContent,
  TabPane,
} from "reactstrap"
import { AvForm, AvField } from "availity-reactstrap-validation"
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

const Portfolio = props => {
  const [selectedExchangeId, setselectedExchangeId] = useState("1")
  const [modal_add_portfolio, setmodal_add_portfolio] = useState(false)
  const [modal_select_exchange, setmodal_select_exchange] = useState(false)
  const [modal_connect_exchange, setmodal_connect_exchange] = useState(false)
  const [exactAddingMethod, setexactAddingMethod] = useState("binance")
  const [addingExchange, setaddingExchange] = useState({
    img: "",
    label: "",
    id: "",
  })
  const [formCountMetamaskManual, setFormCountMetamaskManual] = useState(1)
  useEffect(() => {
    if (props.exchangesLoaded === false) {
      get("get-user-exchanges").then(({ data }) => {
        props.loadUserExchanges(data)
      })
    }
  }, [])

  const toggleExchange = tab => {
    if (selectedExchangeId !== tab) {
      setselectedExchangeId(tab)
      get("https://api.coin-stats.com/v6/transactions?portfolioId=UzvJJrHzQ0VtU4eZ&limit=100").then((respoinse) => {
        console.log(response);
      // props.loadExchangeTransactions(data)
      })
    }
  }

  const handleAddExchange = (event, values) => {
    const title = values.title
    delete values.title

    post("add-user-exchange", {
      exchange: addingExchange.id,
      title,
      metadata: values,
    }).then(({ data, success, errors }) => {
      if (success) {
        props.addUserExchange(data)
        setmodal_connect_exchange(false)
        toggleExchange(data.id)
      } else {
        for (const group in errors) {
          errors[group].map(msg => toastr.warning(msg))
        }
      }
    })
  }

  const defaultAddForm = (
    <AvForm
      className="form-horizontal mt-5"
      onValidSubmit={(e, v) => {
        handleAddExchange(e, v)
      }}
      model={{ title: addingExchange.label }}
    >
      <div className="mb-3">
        <AvField
          name="title"
          label={props.t("Name")}
          className="form-control"
          placeholder={props.t("Name")}
          type="text"
          required
        />
      </div>
      <div className="mb-3">
        <AvField
          name="api_key"
          label={props.t("API Key")}
          className="form-control"
          placeholder={props.t("API Key")}
          type="text"
          required
        />
      </div>
      <div className="mb-3">
        <AvField
          name="api_secret"
          label={props.t("API Secret")}
          className="form-control"
          placeholder={props.t("API Secret")}
          type="text"
          required
        />
      </div>
      <div className="mt-4 d-grid">
        <button className="btn btn-primary btn-block " type="submit">
          {props.t("Save")}
        </button>
      </div>
    </AvForm>
  )
  const apiAddForms = {
    binance: defaultAddForm,
    gate_io: defaultAddForm,
    ftx: defaultAddForm,
    kraken: defaultAddForm,
    coinbase: (
      <AvForm
        className="form-horizontal mt-5"
        onValidSubmit={(e, v) => {
          handleAddExchange(e, v)
        }}
        model={{ title: addingExchange.label, mode: "api_sync" }}
      >
        <div className="mb-3">
          <AvField
            name="title"
            label={props.t("Name")}
            className="form-control"
            placeholder={props.t("Name")}
            type="text"
            required
          />
        </div>
        <AvField name="mode" type="hidden" required />
        <Nav pills className="navtab-bg nav-justified">
          <NavItem>
            <NavLink style={{ cursor: "pointer" }} className="active">
              {props.t("API Sync")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              onClick={() => {
                setexactAddingMethod("coinbase_auto")
              }}
            >
              {props.t("Auto")}
            </NavLink>
          </NavItem>
        </Nav>
        <div className="mb-3">
          <AvField
            name="api_key"
            label={props.t("API Key")}
            className="form-control"
            placeholder={props.t("API Key")}
            type="text"
            required
          />
        </div>
        <div className="mb-3">
          <AvField
            name="api_secret"
            label={props.t("API Secret")}
            className="form-control"
            placeholder={props.t("API Secret")}
            type="text"
            required
          />
        </div>
        <div className="mt-4 d-grid">
          <button className="btn btn-primary btn-block " type="submit">
            {props.t("Save")}
          </button>
        </div>
      </AvForm>
    ),
    coinbase_auto: (
      <AvForm
        className="form-horizontal mt-5"
        onValidSubmit={(e, v) => {
          handleAddExchange(e, v)
        }}
        model={{ title: addingExchange.label, mode: "auto" }}
      >
        <AvField name="mode" type="hidden" required />
        <div className="mb-3">
          <AvField
            name="title"
            label={props.t("Name")}
            className="form-control"
            placeholder={props.t("Name")}
            type="text"
            required
          />
        </div>
        <Nav pills className="navtab-bg nav-justified">
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              onClick={() => {
                setexactAddingMethod("coinbase")
              }}
            >
              {props.t("API Sync")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{ cursor: "pointer" }} className="active">
              {props.t("Auto")}
            </NavLink>
          </NavItem>
        </Nav>
        <div className="mt-4 d-grid">
          <button className="btn btn-primary btn-block " type="submit">
            {props.t("Continue with Coinbase")}
          </button>
        </div>
      </AvForm>
    ),
    metamask: (
      <AvForm
        className="form-horizontal mt-5"
        onValidSubmit={(e, v) => {
          handleAddExchange(e, v)
        }}
        model={{ title: addingExchange.label, mode: "auto" }}
      >
        <AvField name="mode" type="hidden" required />
        <div>
          <AvField
            name="title"
            label={props.t("Name")}
            className="form-control"
            placeholder={props.t("Name")}
            type="text"
            required
          />
        </div>
        <Nav pills className="navtab-bg nav-justified mt-3">
          <NavItem>
            <NavLink style={{ cursor: "pointer" }} className="active">
              {props.t("Auto")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              onClick={() => {
                setexactAddingMethod("metamask_manual")
              }}
            >
              {props.t("Manual")}
            </NavLink>
          </NavItem>
        </Nav>
        <Progress
          value={70}
          color="warning"
          className="progress-xl mt-5"
        ></Progress>
        <div className="d-flex justify-content-between mt-1">
          <span>{props.t("Connecting to Metamask")}</span>
          <span>70%</span>
        </div>

        <div className="mt-4 d-grid">
          <button className="btn btn-primary btn-block " type="submit">
            {props.t("Connect Wallet")}
          </button>
        </div>
      </AvForm>
    ),
    metamask_manual: (
      <AvForm
        className="form-horizontal mt-5"
        onValidSubmit={(e, v) => {
          handleAddExchange(e, v)
        }}
        model={{ title: addingExchange.label, mode: "manual" }}
      >
        <AvField name="mode" type="hidden" required />
        <div>
          <AvField
            name="title"
            label={props.t("Name")}
            className="form-control"
            placeholder={props.t("Name")}
            type="text"
            required
          />
        </div>
        <Nav pills className="navtab-bg nav-justified mt-3">
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              onClick={() => {
                setexactAddingMethod("metamask")
              }}
            >
              {props.t("Auto")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{ cursor: "pointer" }} className="active">
              {props.t("Manual")}
            </NavLink>
          </NavItem>
        </Nav>
        {[...Array(formCountMetamaskManual)].map((_, i) => (
          <div className="mt-5" key={i}>
            {i > 0 && (
              <button
                className="btn btn-icon float-end"
                onClick={() => {
                  setFormCountMetamaskManual(formCountMetamaskManual - 1)
                }}
              >
                <i className="bx bx-x h2 text-warning"></i>
              </button>
            )}
            <div>
              <AvField
                name="cryptocurrency[]"
                type="select"
                label={props.t("Cryptocurrency")}
              >
                <option>
                  <img src="" /> Ethereum
                </option>
                <option>
                  <img src="" /> Binance
                </option>
              </AvField>
            </div>

            <div className="mt-3">
              <label>{props.t("Wallet address")}</label>
              <AvField
                name="wallet_address[]"
                className="form-control"
                placeholder={props.t("Wallet address")}
                type="text"
                validate={{
                  required: { value: true },
                }}
              />
            </div>
          </div>
        ))}
        <div className="mt-4 d-grid">
          <button
            className="btn btn-link btn-block text-warning"
            onClick={e => {
              e.preventDefault()
              setFormCountMetamaskManual(formCountMetamaskManual + 1)
            }}
          >
            {props.t("Add another coin")}
          </button>
          <button className="btn btn-primary btn-block " type="submit">
            {props.t("Save")}
          </button>
        </div>
      </AvForm>
    ),
  }
  const columns = [
    {
      dataField: "coins",
      text: props.t("Coins"),
      sort: true,
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
    },
    {
      dataField: "quantity",
      text: props.t("Quantity"),
      sort: true,
    },
    {
      dataField: "amount",
      text: props.t("Amount paid"),
      sort: true,
    },
    {
      dataField: "purchase_at",
      text: props.t("Purchase at"),
      sort: true,
    },
    {
      dataField: "fees",
      text: props.t("Fees"),
      sort: true,
    },
    {
      dataField: "profit_loss",
      text: props.t("Profit/Loss"),
      sort: true,
    },
    {
      dataField: "total",
      text: props.t("Total"),
      sort: true,
    },
    {
      dataField: "action",
      text: props.t("Action"),
      sort: true,
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
                      setmodal_add_portfolio(true)
                    }}
                  >
                    <i className="mdi mdi-wallet-plus-outline"> </i>{" "}
                    {props.t("Add a portfolio")}
                  </Button>
                  <Modal
                    isOpen={modal_add_portfolio}
                    centered={true}
                    size="sm"
                    toggle={() => {
                      setmodal_add_portfolio(false)
                    }}
                  >
                    <div className="modal-header">
                      <h5 className="modal-title mx-auto">
                        {props.t("Add a portfolio")}
                      </h5>
                    </div>
                    <div className="modal-body">
                      <button
                        type="button"
                        className="btn btn-light w-100 btn-sm btn-rounded btn-label text-start"
                        style={{ overflow: "hidden" }}
                        onClick={() => {
                          setmodal_add_portfolio(false)
                          setmodal_select_exchange(true)
                        }}
                      >
                        <i className="bx bx-plus label-icon text-primary"> </i>{" "}
                        {props.t("Synchronise an Exchange/Wallet")}
                        <i className="bx bx-chevron-right text-primary float-end"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-light w-100 btn-sm btn-rounded btn-label mt-2 text-start"
                        style={{ overflow: "hidden" }}
                      >
                        <i className="bx bx-plus label-icon text-warning"> </i>{" "}
                        {props.t("Add manually")}
                        <i className="bx bx-chevron-right text-warning float-end"></i>
                      </button>
                    </div>
                  </Modal>
                  <Modal
                    isOpen={modal_select_exchange}
                    centered={true}
                    toggle={() => {
                      setmodal_select_exchange(false)
                    }}
                  >
                    <div className="modal-header">
                      <button
                        className="btn btn-link"
                        onClick={() => {
                          setmodal_select_exchange(false)
                          setmodal_add_portfolio(true)
                        }}
                      >
                        <i className="bx bx-left-arrow-alt float-start text-primary h4 m-0"></i>
                      </button>
                      <h5 className="modal-title mx-auto">
                        {props.t("Which Exchange/Wallet?")}
                      </h5>
                    </div>
                    <div className="modal-body row">
                      {exchangeData.map((ex, i) => (
                        <div className="col-6" key={ex.id}>
                          <button
                            type="button"
                            className="btn btn-light btn-rounded btn-label text-start m-2 w-100"
                            style={{ overflow: "hidden" }}
                            onClick={() => {
                              setmodal_select_exchange(false)
                              setmodal_connect_exchange(true)
                              setaddingExchange(exchangeData[i])
                              setexactAddingMethod(exchangeData[i].id)
                              if (exchangeData[i].id == "metamask") {
                                setFormCountMetamaskManual(1)
                              }
                            }}
                          >
                            <div className="label-icon">
                              <img src={ex.img} width="20" />
                            </div>
                            {ex.label}
                            <span className="float-end">
                              <i className="bx bx-chevron-right text-primary"></i>
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </Modal>
                  <Modal
                    isOpen={modal_connect_exchange}
                    centered={true}
                    size="lg"
                    toggle={() => {
                      setmodal_connect_exchange(false)
                    }}
                  >
                    <div className="row">
                      {addingExchange && (
                        <div className="col-6">
                          <div className="p-3">
                            <button
                              className="btn btn-link position-absolute p-0"
                              onClick={() => {
                                setmodal_connect_exchange(false)
                                setmodal_select_exchange(true)
                              }}
                            >
                              <i className="bx bx-left-arrow-alt text-primary h2"></i>
                            </button>
                            <h4 className="modal-title text-center">
                              {props.t("Connect API")}
                            </h4>
                            <p className="text-center mt-3">
                              <img src={addingExchange.img} width="20" />{" "}
                              {addingExchange.label}
                            </p>
                            {apiAddForms[exactAddingMethod]}
                          </div>
                        </div>
                      )}
                      {howToAddData[exactAddingMethod] && (
                        <div className="col-6 bg-light">
                          <div className="modal-header border-0 mt-2">
                            <h5>{howToAddData[exactAddingMethod].heading}</h5>
                          </div>
                          <div className="modal-body">
                            {howToAddData[exactAddingMethod].steps.map(
                              (step, i) => (
                                <p key={i}>
                                  <span className="text-danger">{i + 1}.</span>{" "}
                                  {props.t(step)}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Modal>
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
                        <NavItem>
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
                              className="bx bxs-briefcase h5 me-1"
                              style={{ color: "#f1734f" }}
                            ></i>{" "}
                            {ex.title}
                          </NavLink>
                        </NavItem>
                      )
                    } else {
                      let exchangeInfo = exchangeData.find(
                        exData => exData.id == ex.exchange
                      )
                      return (
                        <NavItem>
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
                    keyField="id"
                    columns={columns}
                    data={props.transactions}
                  >
                    {({ paginationProps, paginationTableProps }) => (
                      <ToolkitProvider
                        keyField="coins"
                        columns={columns}
                        data={props.transactions}
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
                                    keyField={"id"}
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
