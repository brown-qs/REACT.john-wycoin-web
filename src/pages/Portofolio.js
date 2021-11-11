import React, { useEffect, useState } from "react"
import MetaTags from "react-meta-tags"
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
  Row,
  TabContent,
  TabPane,
} from "reactstrap"
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
import { useDispatch } from "react-redux"
import { getChartsData } from "../store/actions"
import classnames from "classnames"

const Portofolio = props => {
  const dispatch = useDispatch()
  const [verticalActiveTabWithIcon, setverticalActiveTabWithIcon] =
    useState("1")
  useEffect(() => {
    dispatch(getChartsData())
  }, [])

  const toggleVertical = tab => {
    if (verticalActiveTabWithIcon !== tab) {
      setverticalActiveTabWithIcon(tab)
    }
  }

  const columns = [
    {
      dataField: "id",
      text: props.t("Coins"),
      sort: true,
    },
    {
      dataField: "name",
      text: props.t("Date"),
      sort: true,
    },
    {
      dataField: "position",
      text: props.t("Pair"),
      sort: true,
    },
    {
      dataField: "office",
      text: props.t("Quantity"),
      sort: true,
    },
    {
      dataField: "age",
      text: props.t("Amount paid"),
      sort: true,
    },
    {
      dataField: "startdate",
      text: props.t("Purchase at"),
      sort: true,
    },
    {
      dataField: "salary",
      text: props.t("Fees"),
      sort: true,
    },
    {
      dataField: "salary",
      text: props.t("Profit/Loss"),
      sort: true,
    },
    {
      dataField: "salary",
      text: props.t("Total"),
      sort: true,
    },
    {
      dataField: "salary",
      text: props.t("Action"),
      sort: true,
    },
  ]

  // Table Data
  const productData = [
    {
      id: 1,
      name: "Airi Satou",
      position: "Accountant",
      office: "Tokyo",
      age: "33",
      startdate: "2008/11/28",
      salary: "$162,700",
    },

    {
      id: 2,
      name: "Angelica Ramos",
      position: "Chief Executive Officer (CEO)",
      office: "London",
      age: "47",
      startdate: "2009/10/09",
      salary: "$1,200,000",
    },

    {
      id: 3,
      name: "Ashton Cox",
      position: "Junior Technical Author",
      office: "San Francisco",
      age: "66",
      startdate: "2009/01/12",
      salary: "$86,000",
    },

    {
      id: 4,
      name: "Bradley Greer",
      position: "Software Engineer",
      office: "London",
      age: "41",
      startdate: "2012/10/13",
      salary: "$132,000",
    },

    {
      id: 5,
      name: "Brenden Wagner",
      position: "Software Engineer",
      office: "San Francisco",
      age: "28",
      startdate: "2011/06/07",
      salary: "$206,850",
    },

    {
      id: 6,
      name: "Brielle Williamson",
      position: "Integration Specialist",
      office: "New York",
      age: "61",
      startdate: "2012/12/02",
      salary: "$372,000",
    },

    {
      id: 7,
      name: "Bruno Nash",
      position: "Software Engineer",
      office: "London",
      age: "38",
      startdate: "2011/05/03",
      salary: "$163,500",
    },

    {
      id: 8,
      name: "Caesar Vance",
      position: "Pre-Sales Support",
      office: "New York",
      age: "21",
      startdate: "2011/12/12",
      salary: "$106,450",
    },

    {
      id: 9,
      name: "Cara Stevens",
      position: "Sales Assistant",
      office: "New York",
      age: "46",
      startdate: "2011/12/06",
      salary: "$145,600",
    },

    {
      id: 10,
      name: "Cedric Kelly",
      position: "Senior Javascript Developer",
      office: "Edinburgh",
      age: "22",
      startdate: "2012/03/29",
      salary: "$433,060",
    },

    {
      id: 11,
      name: "Marshall",
      position: "Regional Director",
      office: "San Francisco",
      age: "36",
      startdate: "2008/10/16",
      salary: "$470,600",
    },

    {
      id: 12,
      name: "Hurst",
      position: "Javascript Developer",
      office: "San Francisco",
      age: "39",
      startdate: "2009/09/15",
      salary: "$205,500",
    },

    {
      id: 13,
      name: "Rios",
      position: "Personnel Lead",
      office: "Edinburgh",
      age: "35",
      startdate: "2012/09/26",
      salary: "$217,500",
    },

    {
      id: 14,
      name: "Snider",
      position: "Customer Support",
      office: "New York",
      age: "27",
      startdate: "2011/01/25",
      salary: "$112,000",
    },

    {
      id: 15,
      name: "Wilder",
      position: "Sales Assistant",
      office: "Sidney",
      age: "23",
      startdate: "2010/09/20",
      salary: "$85,600",
    },

    {
      id: 16,
      name: "Camacho",
      position: "Support Engineer",
      office: "San Francisco",
      age: "47",
      startdate: "2009/07/07",
      salary: "$87,500",
    },

    {
      id: 17,
      name: "Green",
      position: "Chief Operating Officer (COO)",
      office: "San Francisco",
      age: "48",
      startdate: "2010/03/11",
      salary: "$850,000",
    },

    {
      id: 18,
      name: "Winters",
      position: "Accountant",
      office: "Tokyo",
      age: "63",
      startdate: "2011/07/25",
      salary: "$170,750",
    },

    {
      id: 19,
      name: "Cortez",
      position: "Team Leader",
      office: "San Francisco",
      age: "22",
      startdate: "2008/10/26",
      salary: "$235,500",
    },

    {
      id: 20,
      name: "Joyce",
      position: "Developer",
      office: "Edinburgh",
      age: "42",
      startdate: "2010/12/22",
      salary: "$92,575",
    },

    {
      id: 21,
      name: "Gloria Little",
      position: "Systems Administrator",
      office: "New York",
      age: "59",
      startdate: "2009/04/10",
      salary: "$237,500",
    },

    {
      id: 22,
      name: "Haley Kennedy",
      position: "Senior Marketing Desi,ner",
      office: "London",
      age: "43",
      startdate: "2012/12/18",
      salary: "$313,500",
    },

    {
      id: 23,
      name: "Hermione Butler",
      position: "Regional Director",
      office: "London",
      age: "47",
      startdate: "2011/03/21",
      salary: "$356,250",
    },

    {
      id: 24,
      name: "Herrod Chandler",
      position: "Sales Assistant",
      office: "San Francisco",
      age: "59",
      startdate: "2012/08/06",
      salary: "$137,500",
    },

    {
      id: 25,
      name: "Hope Fuentes",
      position: "Secretary",
      office: "San Francisco",
      age: "41",
      startdate: "2010/02/12",
      salary: "$109,850",
    },

    {
      id: 26,
      name: "Howard Hatfield",
      position: "Office Manager",
      office: "San Francisco",
      age: "51",
      startdate: "2008/12/16",
      salary: "$164,500",
    },

    {
      id: 27,
      name: "Jackson Bradshaw",
      position: "Director",
      office: "New York",
      age: "65",
      startdate: "2008/09/26",
      salary: "$645,750",
    },

    {
      id: 28,
      name: "Jena Gaines",
      position: "Office Manager",
      office: "London",
      age: "30",
      startdate: "2008/12/19",
      salary: "$90,560",
    },

    {
      id: 29,
      name: "Jenette Caldwell",
      position: "Development Lead",
      office: "New York",
      age: "30",
      startdate: "2011/09/03",
      salary: "$345,000",
    },

    {
      id: 30,
      name: "Jennifer Acosta",
      position: "Junior Javascript Devel,per",
      office: "Edinburgh",
      age: "43",
      startdate: "2013/02/01",
      salary: "$75,650",
    },
  ]

  const defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ]

  const pageOptions = {
    sizePerPage: 10,
    totalSize: productData.length, // replace later with size(customers),
    custom: true,
  }

  // Custom Pagination Toggle
  const sizePerPageList = [
    { text: "5", value: 5 },
    { text: "10", value: 10 },
    { text: "15", value: 15 },
    { text: "20", value: 20 },
    { text: "25", value: 25 },
    { text: "All", value: productData.length },
  ]

  // Select All Button operation
  const selectRow = {
    mode: "checkbox",
  }

  const { SearchBar } = Search

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>Portofolio | WyCoin</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Portofolio" breadcrumbItem={props.t("Wallet")} />
          <Row>
            <Col md={3}>
              <Card>
                <CardHeader>
                  <Button color="primary" className="w-100" size="sm">
                    {props.t("Add a portfolio")}
                  </Button>
                </CardHeader>
                <CardBody>
                  <CardTitle className="h4">
                    <i className="bx bxs-bar-chart-alt-2 h2 text-primary me-2"></i>{" "}
                    {props.t("All exchanges")}
                  </CardTitle>
                </CardBody>
                <Nav tabs className="flex-column nav-tabs-custom">
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: verticalActiveTabWithIcon === "1",
                      })}
                      onClick={() => {
                        toggleVertical("1")
                      }}
                    >
                      <img src="https://bin.bnbstatic.com/static/images/common/favicon.ico" />
                      Binance
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: verticalActiveTabWithIcon === "2",
                      })}
                      onClick={() => {
                        toggleVertical("2")
                      }}
                    >
                      <img src="https://kraken.com/favicon.ico" />
                      Kraken
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: verticalActiveTabWithIcon === "3",
                      })}
                      onClick={() => {
                        toggleVertical("3")
                      }}
                    >
                      <img src="https://assets.coinbase.com/assets/favicon-32.edb331948b196fde10cb4d6a4e894bb8.png" />
                      Coinbase
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: verticalActiveTabWithIcon === "4",
                      })}
                      onClick={() => {
                        toggleVertical("4")
                      }}
                    >
                      <img src="https://gate.io/favicon.ico" />
                      Gate.io
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: verticalActiveTabWithIcon === "5",
                      })}
                      onClick={() => {
                        toggleVertical("5")
                      }}
                    >
                      <img src="https://ftx.com/favicon.ico" />
                      FTX
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: verticalActiveTabWithIcon === "6",
                      })}
                      onClick={() => {
                        toggleVertical("6")
                      }}
                    >
                      <img src="https://avatars.githubusercontent.com/u/9784193?s=200&v=4" />
                      Ledger
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: verticalActiveTabWithIcon === "7",
                      })}
                      onClick={() => {
                        toggleVertical("7")
                      }}
                    >
                      <img src="https://metamask.io/images/favicon.png" />
                      Metamask
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: verticalActiveTabWithIcon === "8",
                      })}
                      onClick={() => {
                        toggleVertical("8")
                      }}
                    >
                      <i
                        className="bx bxs-briefcase h5 me-1"
                        style={{ color: "#f1734f" }}
                      ></i>{" "}
                      Custom Portfolio
                    </NavLink>
                  </NavItem>
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
                    data={productData}
                  >
                    {({ paginationProps, paginationTableProps }) => (
                      <ToolkitProvider
                        keyField="id"
                        columns={columns}
                        data={productData}
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

export default withTranslation()(Portofolio)
