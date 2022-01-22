import React, { useState } from "react"
import {
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledDropdown,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Tooltip,
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
import moment from "moment"
import { numberFormatter, moneyFormatter } from "../../helpers/utils"

class TooltipItem extends React.Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      tooltipOpen: false,
    }
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    })
  }

  render() {
    return (
      <span>
        <button
          className="mr-1 btn"
          color="secondary"
          id={"Tooltip-" + this.props.id}
        >
          <i className="bx bx-notepad"></i>
        </button>
        <Tooltip
          placement="bottom"
          isOpen={this.state.tooltipOpen}
          target={"Tooltip-" + this.props.id}
          toggle={this.toggle}
        >
          {this.props.content}
        </Tooltip>
      </span>
    )
  }
}

const TransactionTable = props => {
  const columns = [
    {
      dataField: "coins",
      text: props.t("Coins"),
      sort: true,
      isDummyField: true,
      formatter: (cell, row) => (
        <React.Fragment>
          <img src={row.coin_img} width="30" /> {row.coin_label}{" "}
          <span className="text-secondary">{row.coin}</span>
        </React.Fragment>
      ),
      filterValue: (cell, row) => row.coin_label + row.coin,
      style: (colum, colIndex) => {
        return {
          width: "10%",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }
      },
    },
    {
      dataField: "date",
      text: props.t("Date"),
      sort: true,
      formatter: cell => {
        return moment(cell).format("YYYY/MM/DD - HH:mm")
      },
      filterValue: (cell, row) => moment(cell).format("YYYY/MM/DD - HH:mm"),
    },
    {
      dataField: "pair_coin",
      text: props.t("Pair"),
      sort: true,
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
      formatter: (cell, row) => (
        <span className="text-warning">
          {cell + " " + row.pair_coin.split("-")[1]}
        </span>
      ),
    },
    {
      dataField: "purchase_price",
      text: props.t("Purchase Price"),
      sort: true,
      formatter: (cell, row) => cell + " " + row.pair_coin.split("-")[1],
    },
    {
      dataField: "fees",
      text: props.t("Fees"),
      sort: true,
      formatter: (cell, row) => cell + " " + row.pair_coin.split("-")[1],
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
    },
    {
      dataField: "current_value",
      text: props.t("Current Value"),
      formatter: cell => (
        <span className="text-primary">{moneyFormatter(cell)}</span>
      ),
    },
    {
      dataField: "note",
      text: props.t("Note"),
      hidden: !props.isCustom,
      formatter: (cell, row, rowIndex) => (
        <React.Fragment>
          <TooltipItem content={cell} id={rowIndex}></TooltipItem>
        </React.Fragment>
      ),
    },
    {
      dataField: "action",
      text: props.t("Action"),
      isDummyField: true,
      hidden: !props.isCustom,
      formatter: (cell, row, rowIndex) => {
        return (
          <React.Fragment>
            <UncontrolledDropdown>
              <DropdownToggle caret tag="button" className="btn">
                <i className="mdi mdi-dots-horizontal" />
              </DropdownToggle>
              <DropdownMenu
                className={"dropdown-menu-end"}
                container={
                  "#transaction-table tr:nth-child(" +
                  (rowIndex + 1) +
                  ") td:last-child"
                }
                style={{ position: "absolute" }}
              >
                <DropdownItem
                  onClick={() => {
                    props.onModifyTransacion(row)
                  }}
                >
                  {props.t("Modify")}
                </DropdownItem>
                <React.Fragment>
                  <DropdownItem
                    onClick={() => {
                      props.onDeleteTransaction(row)
                    }}
                  >
                    {props.t("Delete")}
                  </DropdownItem>
                </React.Fragment>
              </DropdownMenu>
            </UncontrolledDropdown>
          </React.Fragment>
        )
      },
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
    totalSize: props.transactions.length, // replace later with size(customers),
    custom: true,
  }
  const { SearchBar } = Search

  return (
    <Card>
      <CardBody>
        <PaginationProvider
          pagination={paginationFactory(pageOptions)}
          keyField="id"
          columns={columns}
          data={props.transactions ?? []}
        >
          {({ paginationProps, paginationTableProps }) => (
            <ToolkitProvider
              keyField="id"
              columns={columns}
              data={props.transactions ?? []}
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
                      <div className="table-responsive" id="transaction-table">
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
    transactions: (
      state.Portfolio.exchangeTransactions[ownProps.selectedExchangeId] || []
    ).filter(el => el.coin == ownProps.selectedCoin),
  }
}
export default connect(mapStateToProps)(withTranslation()(TransactionTable))
