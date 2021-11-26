import React, { useState, useImperativeHandle } from "react"
import {
  CardText,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  InputGroup,
  InputGroupAddon,
  Nav,
  NavItem,
  NavLink,
  Modal,
  Row,
  TabContent,
  TabPane,
} from "reactstrap"
import Select from "react-select"
import Switch from "react-switch"
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import { connect } from "react-redux"
import { withTranslation } from "react-i18next"
import { del, get, post } from "../../helpers/api_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import {
  addUserExchange,
  loadUserExchanges,
  loadExchangeTransactions,
} from "../../store/actions"

const CrudManualTransaction = props => {
  useImperativeHandle(props.refTo, () => {
    return { setmodal_manual_add_transaction }
  })

  const [modal_manual_add_transaction, setmodal_manual_add_transaction] =
    useState(false)
  const [manual_add_transaction_mode, setmanual_add_transaction_mode] =
    useState(0)

  const [dropdown_open1, setdropdown_open1] = useState(false)
  const [dropdown_open2, setdropdown_open2] = useState(false)
  const [dropdown_open3, setdropdown_open3] = useState(false)
  const [switch_save_ico, setswitch_save_ico] = useState(false)
  const [coins_list1, setcoins_list1] = useState([])
  const [coins_list2, setcoins_list2] = useState([])

  const [coin_loading1, setcoin_loading1] = useState(false)
  const [coin_loading2, setcoin_loading2] = useState(false)

  const [coin, setcoin] = useState("")
  const [pair_coin, setpair_coin] = useState("")
  const [coin_label, setcoin_label] = useState("")
  const [coin_img, setcoin_img] = useState("")

  let coinSearchTimer1 = false
  let coinSearchTimer2 = false
  let addMore = false
  return (
    <React.Fragment>
      <Modal
        isOpen={modal_manual_add_transaction}
        centered={true}
        size="lg"
        toggle={() => {
          setmodal_manual_add_transaction(false)
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mx-auto">
            {props.t("Add a transaction")}
          </h5>
        </div>
        <div className="modal-body">
          <Nav pills className="navtab-bg nav-justified">
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={manual_add_transaction_mode == 0 ? "active" : ""}
                onClick={() => {
                  setmanual_add_transaction_mode(0)
                }}
              >
                {props.t("Buy")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={manual_add_transaction_mode == 1 ? "active" : ""}
                onClick={() => {
                  setmanual_add_transaction_mode(1)
                }}
              >
                {props.t("ICO")}
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent
            activeTab={manual_add_transaction_mode}
            className="p-3 text-muted"
          >
            <TabPane tabId={0}>
              <AvForm
                className="form-horizontal"
                onValidSubmit={(e, v) => {
                  setmodal_manual_add_transaction(false)
                  post("create-custom-transaction", {
                    ...v,
                    portfolio_id: props.portfolioId,
                  }).then(({ data }) => {
                    console.log(data)
                    if (addMore) {
                      setmodal_manual_add_transaction(true)
                    }
                  })
                }}
              >
                <AvInput type="hidden" name="type" value="buy" />
                <div className="row">
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("What do you buy?")}</label>
                    <Select
                      isLoading={coin_loading1}
                      theme={theme => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          text: "orangered",
                          neutral0: "#32394e",
                          neutral20: "#32394e",
                          neutral30: "var(--input-color)",
                          neutral80: "var(--input-color)",
                        },
                      })}
                      filterOption={() => true}
                      options={coins_list1}
                      onInputChange={e => {
                        if (e == "") return
                        setcoin_loading1(true)
                        if (coinSearchTimer1) clearTimeout(coinSearchTimer1)
                        coinSearchTimer1 = setTimeout(() => {
                          get("/search/coins?search=" + e).then(({ data }) => {
                            setcoin_loading1(false)
                            setcoins_list1(
                              data.map(dat => {
                                return {
                                  value: dat,
                                  label: (
                                    <div>
                                      <img
                                        src={dat.ic}
                                        height="30px"
                                        width="30px"
                                      />{" "}
                                      {dat.n}{" "}
                                      <span className="text-muted">
                                        {dat.s}
                                      </span>
                                    </div>
                                  ),
                                }
                              })
                            )
                          })
                          coinSearchTimer1 = false
                        }, 1000)
                      }}
                      onChange={({ value }) => {
                        setcoin(value.s)
                        setcoin_label(value.n)
                        setcoin_img(value.ic)
                      }}
                    />
                    <AvField type="hidden" name="coin" value={coin} required />
                    <AvInput
                      type="hidden"
                      name="coin_label"
                      value={coin_label}
                    />
                    <AvInput
                      type="hidden"
                      name="coin_img"
                      value={coin_img}
                      required
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("With what (pair)?")}</label>
                    <Select
                      isLoading={coin_loading2}
                      theme={theme => ({
                        ...theme,
                        borderRadius: 0,
                        colors: {
                          ...theme.colors,
                          text: "orangered",
                          neutral0: "#32394e",
                          neutral20: "#32394e",
                          neutral30: "var(--input-color)",
                          neutral80: "var(--input-color)",
                        },
                      })}
                      filterOption={() => true}
                      options={coins_list2}
                      onInputChange={e => {
                        if (e == "") return
                        setcoin_loading2(true)
                        if (coinSearchTimer2) clearTimeout(coinSearchTimer2)
                        coinSearchTimer2 = setTimeout(() => {
                          get("/search/coins?search=" + e).then(({ data }) => {
                            setcoin_loading1(false)
                            setcoins_list2(
                              data.map(dat => {
                                return {
                                  value: dat,
                                  label: (
                                    <div>
                                      <img
                                        src={dat.ic}
                                        height="30px"
                                        width="30px"
                                      />{" "}
                                      {dat.n}{" "}
                                      <span className="text-muted">
                                        {dat.s}
                                      </span>
                                    </div>
                                  ),
                                }
                              })
                            )
                          })
                          coinSearchTimer2 = false
                        }, 1000)
                      }}
                      onChange={({ value }) => {
                        setpair_coin(value.s)
                        console.log(value)
                      }}
                    />
                    <AvField
                      type="hidden"
                      name="pair_coin"
                      value={pair_coin}
                      required
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("On which market?")}</label>
                    <AvField type="select" name="exchange_platform" required>
                      <option value="bitcoin">Binance</option>
                      <option value="coinbase">Coinbase</option>
                      <option value="Coinbase">Binance</option>
                      <option value="gate_io">Gate.io</option>
                      <option value="ftx">FTX</option>
                      <option value="kraken">Kraken</option>
                    </AvField>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <AvField
                      type="text"
                      label={props.t("Amount ?")}
                      name="quantity"
                      required
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("At what cost?")}</label>
                    <InputGroup>
                      <AvInput name="purchase_price" required />
                      <InputGroupAddon addonType="append">USD</InputGroupAddon>
                    </InputGroup>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("Amount invested?")}</label>
                    <InputGroup>
                      <AvInput name="amount" required />
                      <InputGroupAddon addonType="append">USD</InputGroupAddon>
                    </InputGroup>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <AvField
                      name="date"
                      className="form-control"
                      type="date"
                      label={props.t("On what date?")}
                      required
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("Any fees ?")}</label>
                    <InputGroup>
                      <AvInput name="fees" type="text" required />
                      <InputGroupAddon addonType="append">USD</InputGroupAddon>
                    </InputGroup>
                  </div>
                  <div className="col-sm-12 mt-3">
                    <AvField
                      rows={5}
                      type="textarea"
                      name="note"
                      label={props.t("A note?")}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 mt-3">
                    <button
                      className="btn btn-success w-100"
                      onClick={() => {
                        addMore = false
                      }}
                    >
                      {props.t("Save")}
                    </button>
                  </div>{" "}
                  <div className="col-sm-6 mt-3">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => {
                        addMore = true
                      }}
                    >
                      {props.t("Save")} +
                    </button>
                  </div>
                </div>
              </AvForm>
            </TabPane>
            <TabPane tabId={1}>
              <AvForm className="form-horizontal" onValidSubmit={(e, v) => {}}>
                <div className="row">
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("What currency?")}</label>
                    <InputGroup>
                      <input
                        type="text"
                        value="asdfsdf"
                        name="sdfd"
                        className="form-control"
                        style={{ width: "70%" }}
                      />
                      <input
                        type="text"
                        value="asdfsdf"
                        name="sdfd"
                        className="form-control"
                        style={{ width: "30%" }}
                      />
                    </InputGroup>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <AvField
                      type="file"
                      name="logo"
                      label="Logo"
                      className="form-control"
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <AvField
                      type="select"
                      name="market"
                      label={props.t("On which market?")}
                      className="form-control"
                    >
                      <option>Bitcoin</option>
                    </AvField>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <AvField type="number" label="Quantity" name="sdf" />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("What do you buy?")}</label>
                    <InputGroup>
                      <AvInput name="sdf" />
                      <button
                        className="input-group-text"
                        onClick={() => {
                          setdropdown_open1(!dropdown_open1)
                        }}
                      >
                        USDT <i className="bx bx-chevron-down"></i>
                      </button>
                      <Dropdown
                        isOpen={dropdown_open1}
                        toggle={() => {
                          setdropdown_open1(!dropdown_open1)
                        }}
                      >
                        <DropdownToggle className="d-none" />
                        <DropdownMenu end>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>{" "}
                      </Dropdown>
                    </InputGroup>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("What do you buy?")}</label>
                    <InputGroup>
                      <AvInput name="sdf" />
                      <button
                        className="input-group-text"
                        onClick={() => {
                          setdropdown_open1(!dropdown_open1)
                        }}
                      >
                        USDT <i className="bx bx-chevron-down"></i>
                      </button>
                      <Dropdown
                        isOpen={dropdown_open1}
                        toggle={() => {
                          setdropdown_open1(!dropdown_open1)
                        }}
                      >
                        <DropdownToggle className="d-none" />
                        <DropdownMenu end>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>{" "}
                      </Dropdown>
                    </InputGroup>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <AvField
                      name="date"
                      className="form-control"
                      type="date"
                      label="Date"
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("What do you buy?")}</label>
                    <InputGroup>
                      <AvInput name="sdf" />
                      <button
                        className="input-group-text"
                        onClick={() => {
                          setdropdown_open1(!dropdown_open1)
                        }}
                      >
                        USDT <i className="bx bx-chevron-down"></i>
                      </button>
                      <Dropdown
                        isOpen={dropdown_open1}
                        toggle={() => {
                          setdropdown_open1(!dropdown_open1)
                        }}
                      >
                        <DropdownToggle className="d-none" />
                        <DropdownMenu end>
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem disabled>Action</DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                          <DropdownItem divider />
                          <DropdownItem>Another Action</DropdownItem>
                        </DropdownMenu>{" "}
                      </Dropdown>
                    </InputGroup>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label
                      className="form-check-label"
                      htmlFor="customSwitchsizemd"
                    >
                      {props.t("Save to my ICOs")}
                    </label>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <Switch
                      className="me-1 mb-sm-8 mb-2"
                      onColor="#2ca67a"
                      onChange={() => {
                        setswitch_save_ico(!switch_save_ico)
                      }}
                      checked={switch_save_ico}
                      width={40}
                      height={20}
                    />
                  </div>
                  <div className="col-sm-12">
                    <AvField type="textarea" name="text" label="Une note?" />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 mt-3">
                    <button className="btn btn-success w-100">Save</button>
                  </div>{" "}
                  <div className="col-sm-6 mt-3">
                    <button className="btn btn-primary w-100">Save +</button>
                  </div>
                </div>
              </AvForm>
            </TabPane>
          </TabContent>
        </div>
      </Modal>
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
})(withTranslation()(CrudManualTransaction))
