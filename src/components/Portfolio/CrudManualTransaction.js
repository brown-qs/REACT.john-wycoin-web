import React, { useState, useImperativeHandle } from "react"
import {
  CardText,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  InputGroup,
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
  const [switch_save_ico, setswitch_save_ico] = useState(false)

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
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={manual_add_transaction_mode == 2 ? "active" : ""}
                onClick={() => {
                  setmanual_add_transaction_mode(2)
                }}
              >
                {props.t("Swap")}
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent
            activeTab={manual_add_transaction_mode}
            className="p-3 text-muted"
          >
            <TabPane tabId={0}>
              <AvForm className="form-horizontal" onValidSubmit={(e, v) => {}}>
                <div className="row">
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("What do you buy?")}</label>
                    <Select
                      name="coin"
                      options={[
                        {
                          value: "bitcoin",
                          label: (
                            <div>
                              <img
                                src="https://static.coinstats.app/coins/Bitcoin6l39t.png"
                                height="30px"
                                width="30px"
                              />
                              Bitcoin <span className="text-muted">BTC</span>
                            </div>
                          ),
                        },
                        {
                          value: "tether",
                          label: (
                            <div>
                              <img
                                src="https://static.coinstats.app/coins/TetherfopnG.png"
                                width="30"
                              />{" "}
                              Tether
                            </div>
                          ),
                        },
                      ]}
                      onChange={({ value }) => {}}
                    />
                    <AvField type="hidden" name="coin" />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("With what (pair)?")}</label>
                    <Select
                      name="coin"
                      value="bitcoin"
                      options={[
                        {
                          value: "bitcoin",
                          label: (
                            <div>
                              <img
                                src="https://static.coinstats.app/coins/Bitcoin6l39t.png"
                                height="30px"
                                width="30px"
                              />
                              Bitcoin <span className="text-muted">BTC</span>
                            </div>
                          ),
                        },
                        {
                          value: "strawberry",
                          label: (
                            <div>
                              <img
                                src="https://static.coinstats.app/coins/TetherfopnG.png"
                                width="30"
                              />{" "}
                              Tether
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("On which market?")}</label>
                    <Select
                      name="coin"
                      value="bitcoin"
                      options={[
                        {
                          value: "bitcoin",
                          label: "Binance",
                        },
                      ]}
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <AvField
                      type="number"
                      label={props.t("Amount ?")}
                      name="sdf"
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("At what cost?")}</label>
                    <InputGroup>
                      <AvInput name="sdf" />
                      <Dropdown
                        isOpen={dropdown_open1}
                        toggle={() => {
                          setdropdown_open1(!dropdown_open1)
                        }}
                      >
                        <DropdownToggle
                          className="input-group-text"
                          tag="button"
                        >
                          USDT <i className="bx bx-chevron-down"></i>{" "}
                        </DropdownToggle>
                        <DropdownMenu right>
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
                    <label>{props.t("Amount invested?")}</label>
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
                      label={props.t("On what date?")}
                    />
                  </div>
                  <div className="col-sm-6 mt-3">
                    <label>{props.t("Any fees ?")}</label>
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
                  <div className="col-sm-12 mt-3">
                    <AvField
                      rows={5}
                      type="textarea"
                      name="text"
                      label={props.t("A note?")}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-sm-6 mt-3">
                    <button className="btn btn-success w-100">
                      {props.t("Save")}
                    </button>
                  </div>{" "}
                  <div className="col-sm-6 mt-3">
                    <button className="btn btn-primary w-100">
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
            <TabPane tabId={2}>
              <Row>
                <Col sm="12">
                  <CardText className="mb-0">
                    Etsy mixtape wayfarers, ethical wes anderson tofu before
                    they sold out mcsweeney&apos;s organic lomo retro fanny pack
                    lo-fi farm-to-table readymade. Messenger bag gentrify
                    pitchfork tattooed craft beer, iphone skateboard locavore
                    carles etsy salvia banksy hoodie helvetica. DIY synth PBR
                    banksy irony. Leggings gentrify squid 8-bit cred pitchfork.
                    Williamsburg banh mi whatever gluten-free, carles pitchfork
                    biodiesel fixie etsy retro mlkshk vice blog. Scenester cred
                    you probably haven&apos;t heard of them, vinyl craft beer
                    blog stumptown. Pitchfork sustainable tofu synth chambray
                    yr.
                  </CardText>
                </Col>
              </Row>
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
