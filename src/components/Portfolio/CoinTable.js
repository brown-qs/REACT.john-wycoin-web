import React, { useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"
// datatable related plugins
import { connect } from "react-redux"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator"
import ToolkitProvider, {
  Search,
  ColumnToggle,
} from "react-bootstrap-table2-toolkit"
import { withTranslation } from "react-i18next"

const CoinTable = props => {
  const { ToggleList } = ColumnToggle

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
          <img src={row.coin_img} width="30" /> <span>{row.coin_label}</span>{" "}
          <span className="text-secondary">{row.coin}</span>
        </div>
      ),
      filterValue: (cell, row) => row.coin_label + row.coin,
    },
    {
      dataField: "quantity",
      text: props.t("Quantity"),
      sort: true,
      formatter: numberFormatter,
    },
    {
      dataField: "price",
      text: props.t("Price"),
      sort: true,
      formatter: moneyFormatter,
    },
    {
      dataField: "profit_lose_amount",
      text: props.t("Profit/Loss"),
      sort: true,
      formatter: cell => (
        <span className={`text-${cell >= 0 ? "success" : "danger"}`}>
          {moneyFormatter(cell)}
        </span>
      ),
      filterValue: (cell, row) => moneyFormatter(cell),
    },
    {
      dataField: "total",
      text: props.t("Total"),
      formatter: moneyFormatter,
    },
    {
      dataField: "action",
      text: props.t("Action"),
      isDummyField: true,
      formatter: (cell, row) => (
        <UncontrolledDropdown>
          <DropdownToggle caret tag="button" className="btn">
            <i className="mdi mdi-dots-horizontal" />
          </DropdownToggle>
          <DropdownMenu className={"dropdown-menu-end"}>
            <DropdownItem
              onClick={() => {
                props.onViewTransactions(row.coin)
              }}
            >
              {props.t("View Transactions")}
            </DropdownItem>
            {props.isCustom && (
              <React.Fragment>
                <DropdownItem>Modify</DropdownItem>
                <DropdownItem>Delete</DropdownItem>
              </React.Fragment>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ]

  const CustomToggleList = ({ columns, onColumnToggle, toggles }) => (
    <React.Fragment>
      <div className="btn-group ms-2">
        <UncontrolledDropdown>
          <DropdownToggle caret tag="button" className="btn btn-outline-light">
            <i className="mdi mdi-eye-off-outline"></i>
          </DropdownToggle>
          <DropdownMenu>
            {columns
              .map(column => ({
                ...column,
                toggle: toggles[column.dataField],
              }))
              .map(column => (
                <DropdownItem
                  key={column.dataField}
                  onClick={() => onColumnToggle(column.dataField)}
                >
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={column.toggle}
                    readOnly
                  />{" "}
                  {column.text}
                </DropdownItem>
              ))}
          </DropdownMenu>
        </UncontrolledDropdown>
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={() => {
            columns.map(column => {
              toggles[column.dataField] || onColumnToggle(column.dataField)
            })
          }}
        >
          <i className="mdi mdi-eye-outline"></i>
        </button>
      </div>
    </React.Fragment>
  )
  const defaultSorted = [
    {
      dataField: "coins",
      order: "asc",
    },
  ]
  const pageOptions = {
    sizePerPage: 10,
    totalSize: props.coins.length, // replace later with size(customers),
    custom: true,
  }
  const { SearchBar } = Search
  console.log(columns)

  return (
    <Card>
      <CardBody>
        <PaginationProvider
          pagination={paginationFactory(pageOptions)}
          keyField="coin"
          columns={columns}
          data={props.coins ?? []}
        >
          {({ paginationProps, paginationTableProps }) => (
            <ToolkitProvider
              keyField="coin"
              columns={columns}
              data={props.coins ?? []}
              search
              columnToggle
            >
              {toolkitProps => (
                <React.Fragment>
                  <div className="d-flex justify-content-between">
                    <div className="d-inline">
                      <SizePerPageDropdownStandalone {...paginationProps} />
                      <CustomToggleList {...toolkitProps.columnToggleProps} />
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
                      <div
                        className="table-responsive"
                        style={{ overflow: "unset" }}
                      >
                        <BootstrapTable
                          keyField={"coin"}
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
                        <PaginationListStandalone {...paginationProps} />
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
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    coins:
      (state.Portfolio.portfolioInfos[ownProps.selectedExchangeId] || {})
        .coins || [],
  }
}
export default connect(mapStateToProps)(withTranslation()(CoinTable))
