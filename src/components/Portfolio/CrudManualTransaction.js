import React, { useState, useImperativeHandle } from "react"
import {
  InputGroup,
  InputGroupText,
  Nav,
  NavItem,
  NavLink,
  Modal,
} from "reactstrap"
import Select from "../Common/Select"
import Switch from "react-switch"
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import { connect } from "react-redux"
import ReactSelect from "react-select"
import { withTranslation } from "react-i18next"
import { del, get, post } from "../../helpers/api_helper"
import {
  loadPortfolio,
  addCustomTransaction,
  updateCustomTransaction,
} from "../../store/actions"

//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css"
import Flatpickr from "react-flatpickr"

const CrudManualTransaction = props => {
  useImperativeHandle(props.refTo, () => {
    return { newTransaction, editTransaction }
  })

  const newTransaction = () => {
    seteditingTransaction(null)
    setDefaultValues({})
    setcoin(null)
    setcoin_img(null)
    setcoin_label(null)
    setpair_coin("")
    setcoins_list1([])
    setcoins_list2([])
    settransactionDate("")

    setmodal_manual_add_transaction(true)
  }

  const editTransaction = tran => {
    seteditingTransaction(tran.id)
    setDefaultValues(tran)
    setcoin(tran.coin)
    setcoin_img(tran.coin_img)
    setcoin_label(tran.coin_label)
    setpair_coin(tran.pair_coin)
    setcoins_list1([
      {
        value: tran.coin,
        label: (
          <div>
            <img src={tran.coin_img} height="30px" width="30px" />{" "}
            {tran.coin_label}{" "}
          </div>
        ),
      },
    ])
    get("search/pairs?coin=" + tran.coin).then(({ data }) => {
      setpairLoading(false)
      setcoins_list2(data.map(dat => ({ value: dat, label: dat })))
    })

    settransactionDate(tran.date)
    setmodal_manual_add_transaction(true)
  }
  const [editingTransaction, seteditingTransaction] = useState(null)
  const [defaultValues, setDefaultValues] = useState({})

  const [modal_manual_add_transaction, setmodal_manual_add_transaction] =
    useState(false)
  const [manual_add_transaction_mode, setmanual_add_transaction_mode] =
    useState(0)

  const [switch_save_ico, setswitch_save_ico] = useState(false)
  const [coins_list1, setcoins_list1] = useState([])
  const [coins_list2, setcoins_list2] = useState([])

  const [coin, setcoin] = useState("")
  const [pair_coin, setpair_coin] = useState("")
  const [coin_label, setcoin_label] = useState("")
  const [coin_img, setcoin_img] = useState("")
  const [transactionDate, settransactionDate] = useState("")
  const [pairLoading, setpairLoading] = useState(false)

  let addMore = false
  return (
    <React.Fragment>
      <Modal
        isOpen={modal_manual_add_transaction}
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
                <span className="d-none d-sm-block">
                  <i className="fas fa-home"></i> {props.t("Buy")}
                </span>
                <span className="d-block d-sm-none">
                  <i className="fas fa-home"></i>
                </span>
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
                <span className="d-none d-sm-block">
                  <i className="fas fa-home"></i> {props.t("ICO")}
                </span>
                <span className="d-block d-sm-none">
                  <i className="fas fa-home"></i>
                </span>
              </NavLink>
            </NavItem>
          </Nav>
          <AvForm
            className="form-horizontal"
            onValidSubmit={(e, v) => {
              setmodal_manual_add_transaction(false)
              if (editingTransaction == null) {
                post("create-custom-transaction", {
                  ...v,
                  portfolio_id: props.portfolioId,
                }).then(({ data }) => {
                  props.addCustomTransaction(props.portfolioId, data)
                  get("load-portfolio-coins/" + props.portfolioId).then(
                    ({ data }) => {
                      props.loadPortfolio({ id: props.portfolioId, data })
                    }
                  )
                  if (addMore) {
                    newTransaction()
                  }
                })
              } else {
                post("update-custom-transaction", {
                  id: editingTransaction,
                  ...v,
                }).then(({ data }) => {
                  props.updateCustomTransaction(props.portfolioId, data)
                  if (addMore) {
                    newTransaction()
                  }
                })
              }
            }}
            model={defaultValues}
          >
            <AvInput
              type="hidden"
              name="type"
              value={manual_add_transaction_mode == 0 ? "buy" : "ico"}
            />
            <div className="row">
              {manual_add_transaction_mode == 0 && (
                <React.Fragment>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("What do you buy?")}</label>
                    <Select
                      value={
                        coin
                          ? {
                              value: coin,
                              label: (
                                <div>
                                  <img
                                    src={coin_img}
                                    height="30px"
                                    width="30px"
                                  />{" "}
                                  {coin_label}{" "}
                                </div>
                              ),
                            }
                          : coin
                      }
                      options={coins_list1}
                      searchUrl="/search/coins?search="
                      afterSearch={data => {
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
                                  {dat.n}
                                </div>
                              ),
                            }
                          })
                        )
                      }}
                      onChange={({ value }) => {
                        setcoin(value.i)
                        setcoin_label(value.n)
                        setcoin_img(value.ic)
                        setpairLoading(true)
                        setpair_coin("Select")
                        setcoins_list2([])
                        get("search/pairs?coin=" + value.i).then(({ data }) => {
                          setpairLoading(false)
                          setcoins_list2(
                            data.map(dat => ({ value: dat, label: dat }))
                          )
                        })
                      }}
                      onMenuOpen={() => {
                        setcoins_list1([])
                        setcoin(null)
                        setcoin_label(null)
                        setcoin_img(null)
                        setpair_coin("")
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
                    <ReactSelect
                      classNamePrefix="select2-selection"
                      options={coins_list2}
                      isLoading={pairLoading}
                      menuIsOpen={pair_coin == "Select"}
                      onMenuOpen={() => {
                        setpair_coin("Select")
                      }}
                      defaultValue={{ value: pair_coin, label: pair_coin }}
                      // searchUrl="/search/coins?search="
                      // afterSearch={data => {
                      //   setcoins_list2(
                      //     data.map(dat => {
                      //       return {
                      //         value: dat,
                      //         label: (
                      //           <div>
                      //             <img
                      //               src={dat.ic}
                      //               height="30px"
                      //               width="30px"
                      //             />{" "}
                      //             {dat.n}{" "}
                      //             <span className="text-muted">{dat.s}</span>
                      //           </div>
                      //         ),
                      //       }
                      //     })
                      //   )
                      // }}
                      onChange={({ value }) => {
                        setpair_coin(value)
                      }}
                    />
                    <AvField
                      type="hidden"
                      name="pair_coin"
                      value={pair_coin}
                      required
                    />
                  </div>
                </React.Fragment>
              )}

              {manual_add_transaction_mode == 1 && (
                <React.Fragment>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("What currency?")}</label>
                    <InputGroup>
                      <input
                        type="text"
                        defaultValue={"Ex: Bitcoin"}
                        name="ico_coin_label"
                        className="form-control"
                        style={{ width: "70%" }}
                      />
                      <input
                        type="text"
                        defaultValue={"Ex: BTC"}
                        name="ico_coin"
                        className="form-control"
                        style={{ width: "30%" }}
                      />
                    </InputGroup>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <AvField
                      type="file"
                      name="ico_logo"
                      label={props.t("Logo")}
                      className="form-control"
                    />
                  </div>
                </React.Fragment>
              )}
              <div className="col-sm-6 mt-3">
                <label>{props.t("On which market?")}</label>
                <AvField type="text" name="exchange_platform" required />
                {/* <AvField type="select" name="exchange_platform" required>
                  <option value="binance">Binance</option>
                  <option value="coinbase">Coinbase</option>
                  <option value="gate_io">Gate.io</option>
                  <option value="ftx">FTX</option>
                  <option value="kraken">Kraken</option>
                </AvField> */}
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
                  <InputGroupText>
                    {pair_coin.split("-")[1] || "USD"}
                  </InputGroupText>
                </InputGroup>
              </div>
              <div className="col-sm-6 mt-3">
                <label>{props.t("Amount invested?")}</label>
                <InputGroup>
                  <AvInput name="amount" required />
                  <InputGroupText>
                    {pair_coin.split("-")[1] || "USD"}
                  </InputGroupText>
                </InputGroup>
              </div>
              <div className="col-sm-6 mt-3">
                <label>{props.t("On what date?")}</label>
                <InputGroup>
                  <Flatpickr
                    className="form-control d-block"
                    placeholder="dd M,yyyy"
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                    defaultValue={transactionDate}
                    onChange={date => settransactionDate(date[0])}
                  />
                  {/* <DatePicker
                    selected={transactionDate}
                    onChange={date => settransactionDate(date)}
                  /> */}
                </InputGroup>

                <AvField
                  name="date"
                  value={transactionDate}
                  type="hidden"
                  required
                />
              </div>
              <div className="col-sm-6 mt-3">
                <label>{props.t("Any fees ?")}</label>
                <InputGroup>
                  <AvInput name="fees" type="text" required />
                  <InputGroupText>
                    {pair_coin.split("-")[1] || "USD"}
                  </InputGroupText>
                </InputGroup>
              </div>
              {manual_add_transaction_mode == 1 && (
                <React.Fragment>
                  <div className="col-sm-6 mt-3">
                    <label
                      className="form-check-label"
                      htmlFor="customSwitchsizemd"
                    >
                      {props.t("Save to my ICO")}
                    </label>
                  </div>
                  <div className="col-sm-6 mt-3">
                    <AvInput
                      name="ico_save"
                      type="hidden"
                      value={switch_save_ico}
                    />
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
                </React.Fragment>
              )}
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
  loadPortfolio,
  addCustomTransaction,
  updateCustomTransaction,
})(withTranslation()(CrudManualTransaction))
