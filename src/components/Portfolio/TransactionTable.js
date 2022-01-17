import React from "react"
import { Card, CardBody, Col, Row } from "reactstrap"
// datatable related plugins
import { connect } from "react-redux"
import BootstrapTable from "react-bootstrap-table-next"
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator"
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit"
import { withTranslation } from "react-i18next"

const TransactionTable = props => {
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
    totalSize: props.transactions[props.selectedExchangeId], // replace later with size(customers),
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
          data={props.transactions[props.selectedExchangeId] ?? []}
        >
          {({ paginationProps, paginationTableProps }) => (
            <ToolkitProvider
              keyField="id"
              columns={columns}
              data={props.transactions[props.selectedExchangeId] ?? []}
              search
            >
              {toolkitProps => (
                <React.Fragment>
                  <div className="d-flex justify-content-between">
                    <div className="d-inline">
                      <SizePerPageDropdownStandalone {...paginationProps} />
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

const mapStateToProps = state => {
  return {
    transactions: state.Portfolio.exchangeTransactions,
  }
}
export default connect(mapStateToProps)(withTranslation()(TransactionTable))
