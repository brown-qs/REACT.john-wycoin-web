import React, { useEffect, useState, useImperativeHandle } from "react"
import { Nav, NavItem, NavLink, Modal, Progress } from "reactstrap"
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation"
import { connect } from "react-redux"

import { AutoSizer, List } from "react-virtualized"
import Select from "react-select"
// datatable related plugins
import { useTranslation } from "react-i18next"
// Web3
import { InjectedConnector } from "@web3-react/injected-connector"
//Import Breadcrumb
import { exchangeData, howToAddData } from "../../common/data/exchanges"
import icons from "../../common/data/materialdesign-icons"
import { del, get, post, axiosApi } from "../../helpers/api_helper"
import toastr from "toastr"
import "toastr/build/toastr.min.css"
import {
  addUserExchange,
  loadUserExchanges,
  loadExchangeTransactions,
} from "../../store/actions"

const CrudPortfolio = props => {
  useImperativeHandle(props.refTo, () => {
    return { setmodal_add_portfolio }
  })

  const { t } = useTranslation()

  const [modal_add_portfolio, setmodal_add_portfolio] = useState(false)
  const [modal_select_exchange, setmodal_select_exchange] = useState(false)
  const [modal_connect_exchange, setmodal_connect_exchange] = useState(false)
  const [exactAddingMethod, setexactAddingMethod] = useState("binance")
  const [
    selected_metamask_wallet_address,
    setselected_metamask_wallet_address,
  ] = useState("")
  const [selected_metamask_chainId, setselected_metamask_chainId] = useState(1)
  const [addingExchange, setaddingExchange] = useState({
    img: "",
    label: "",
    id: "",
  })
  const [coinbaseAutoTitle, setcoinbaseAutoTitle] = useState("Coinbase")
  const [formCountMetamaskManual, setFormCountMetamaskManual] = useState(1)
  // Manual Portfolio
  const [modal_manual_portfolio, setmodal_manual_portfolio] = useState(false)
  const [modal_icon_menu, setmodal_icon_menu] = useState(false)
  const [manual_portfolio_icon, setmanual_portfolio_icon] = useState(
    "briefcase-variant-outline"
  )
  const [metamask_mode, setmetamask_mode] = useState(0)
  const [coins_list, setcoins_list] = useState([])
  const [walletConnected, setwalletConnected] = useState(false)
  const [colorRgb, setcolorRgb] = useState("")
  const metamaskConnector = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 56],
  })
  const [icon_list_component, seticon_list_component] = useState(
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          rowCount={Math.ceil(icons.length / 10)}
          rowHeight={100}
          rowRenderer={rowRenderer}
          width={width}
        />
      )}
    </AutoSizer>
  )
  metamaskConnector.handleChainChanged = res => {
    setselected_metamask_chainId(res)
  }
  metamaskConnector.handleAccountChanged = res => {
    setselected_metamask_wallet_address(res)
  }

  const handleAddExchange = (event, values) => {
    const title = values.title
    delete values.title

    post("add-portfolio", {
      exchange: addingExchange.id,
      title,
      metadata: values,
    }).then(({ data, success, errors }) => {
      if (success) {
        props.addUserExchange(data)
        if (addingExchange.id === "custom") {
          setmodal_manual_portfolio(false)
          props.onManualPortfolioCreated(data.id)
        } else {
          setmodal_connect_exchange(false)
        }
      } else {
        for (const group in errors) {
          errors[group].map(msg => toastr.warning(msg))
        }
      }
    })
  }

  let windowObjectReference = null
  let previousUrl = null
  const client_id =
    "cbe15651c9f49ef21ad8d08d8343764a7b772e3859cf309a015e8c4bd428e770"
  const redirect_uri = location.origin + "/coinbase-oauth-redirect"

  const receiveMessage = event => {
    console.log(event)
    if (event.origin !== location.origin) {
      return
    }
    const { data } = event
    // if we trust the sender and the source is our popup
    if (data.source === "coinbase-oauth-redirect") {
      // get the URL params and redirect to our server to use Passport to auth/login
      const { code } = data
      post(`coinbase-auth-token`, { code }).then(({ data }) => {
        if (coinbaseAutoTitle.length) console.log(data)
        handleAddExchange(null, { ...data, title: coinbaseAutoTitle })
      })
    }
  }

  const openSignInWindow = (url, name) => {
    // remove any existing event listeners
    window.removeEventListener("message", receiveMessage)

    // window features
    const strWindowFeatures =
      "toolbar=no, menubar=no, width=600, height=700, top=100, left=100"

    if (windowObjectReference === null || windowObjectReference.closed) {
      /* if the pointer to the window object in memory does not exist
      or if such pointer exists but the window was closed */
      windowObjectReference = window.open(url, name, strWindowFeatures)
    } else if (previousUrl !== url) {
      /* if the resource to load is different,
      then we load it in the already opened secondary window and then
      we bring such window back on top/in front of its parent window. */
      windowObjectReference = window.open(url, name, strWindowFeatures)
      windowObjectReference.focus()
    } else {
      /* else the window reference must exist and the window
      is not closed; therefore, we can bring it back on top of any other
      window with the focus() method. There would be no need to re-create
      the window or to reload the referenced resource. */
      windowObjectReference.focus()
    }

    // add the listener for receiving a message from the popup
    window.addEventListener("message", event => receiveMessage(event), false)
    // assign the previous URL
    previousUrl = url
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
          label={t("Name")}
          className="form-control"
          placeholder={t("Name")}
          type="text"
          required
        />
      </div>
      <div className="mb-3">
        <AvField
          name="apiKey"
          label={t("API Key")}
          className="form-control"
          placeholder={t("API Key")}
          type="text"
          required
        />
      </div>
      <div className="mb-3">
        <AvField
          name="apiSecret"
          label={t("API Secret")}
          className="form-control"
          placeholder={t("API Secret")}
          type="text"
          required
        />
      </div>
      <div className="mt-4 d-grid">
        <button className="btn btn-primary btn-block " type="submit">
          {t("Save")}
        </button>
      </div>
    </AvForm>
  )

  let metamask_crypto_input = ""

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
            label={t("Name")}
            className="form-control"
            placeholder={t("Name")}
            type="text"
            required
          />
        </div>
        <AvField name="mode" type="hidden" required />
        <Nav pills className="navtab-bg nav-justified">
          <NavItem>
            <NavLink style={{ cursor: "pointer" }} className="active">
              {t("API Sync")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              onClick={() => {
                setexactAddingMethod("coinbase_auto")
              }}
            >
              {t("Auto")}
            </NavLink>
          </NavItem>
        </Nav>
        <div className="mb-3">
          <AvField
            name="apiKey"
            label={t("API Key")}
            className="form-control"
            placeholder={t("API Key")}
            type="text"
            required
          />
        </div>
        <div className="mb-3">
          <AvField
            name="apiSecret"
            label={t("API Secret")}
            className="form-control"
            placeholder={t("API Secret")}
            type="text"
            required
          />
        </div>
        <div className="mt-4 d-grid">
          <button className="btn btn-primary btn-block " type="submit">
            {t("Save")}
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
      >
        <div className="mb-3">
          <AvField
            name="title"
            label={t("Name")}
            className="form-control"
            placeholder={t("Name")}
            type="text"
            value={coinbaseAutoTitle}
            onChange={e => {
              setcoinbaseAutoTitle(e.target.value)
            }}
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
              {t("API Sync")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{ cursor: "pointer" }} className="active">
              {t("Auto")}
            </NavLink>
          </NavItem>
        </Nav>
        <div className="mt-4 d-grid">
          <button
            className="btn btn-primary btn-block "
            onClick={e => {
              e.preventDefault()
              openSignInWindow(
                `https://www.coinbase.com/oauth/authorize?account=all&client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=wallet%3Aaccounts%3Aread%2Cwallet%3Atransactions%3Aread%2Cwallet%3Adeposits%3Aread%2Cwallet%3Awithdrawals%3Aread%2Cwallet%3Aaddresses%3Aread%2Cwallet%3Aaddresses%3Acreate%2Cwallet%3Auser%3Aread%2Cwallet%3Auser%3Aemail`,
                "Wycoin - Coinbase"
              )
            }}
          >
            {t("Continue with Coinbase")}
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
        model={{ title: addingExchange.label }}
      >
        <Nav pills className="navtab-bg nav-justified mb-5">
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={metamask_mode === 0 ? "active" : ""}
              onClick={() => {
                setmetamask_mode(0)
              }}
            >
              {t("Auto")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={metamask_mode === 1 ? "active" : ""}
              onClick={() => {
                setmetamask_mode(1)
                metamaskConnector.deactivate()
                setwalletConnected(false)
              }}
            >
              {t("Manual")}
            </NavLink>
          </NavItem>
        </Nav>
        <div>
          <AvField
            name="title"
            label={t("Name")}
            className="form-control"
            placeholder={t("Name")}
            type="text"
            required
          />
        </div>
        <div
          className="mt-3"
          style={{ display: ["none", "block"][metamask_mode] }}
        >
          <label>{t("Cryptocurrency")}</label>
          <Select
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
            options={coins_list}
            filterOption={() => true}
            onInputChange={e => {
              if (e == "") return
              if (metamask_crypto_input) clearTimeout(metamask_crypto_input)
              metamask_crypto_input = setTimeout(() => {
                get("/search/networks?search=" + e).then(({ data }) => {
                  setcoins_list(
                    data.map(dat => {
                      return {
                        value: dat.connectionId,
                        label: (
                          <div>
                            <img
                              src={
                                "data:image/png;base64, " + dat.blockchain.icon
                              }
                              height="30px"
                              width="30px"
                            />{" "}
                            {dat.blockchain.name}
                          </div>
                        ),
                      }
                    })
                  )
                })
                metamask_crypto_input = false
              }, 1000)
            }}
            onChange={({ value }) => {
              setselected_metamask_chainId(value)
            }}
          />
          <AvField
            name="chain_id"
            type="hidden"
            value={selected_metamask_chainId}
            required
          ></AvField>
        </div>
        <div
          className="mt-3"
          style={{ display: ["none", "block"][metamask_mode] }}
        >
          <AvField
            name="wallet_address"
            className="form-control"
            label={t("Wallet address")}
            placeholder={t("Wallet address")}
            type="text"
            required
            value={selected_metamask_wallet_address}
            onChange={e => {
              setselected_metamask_wallet_address(e.target.value)
            }}
          />
        </div>
        {metamask_mode === 0 && !walletConnected && (
          <div className="mt-4 d-grid">
            <button
              className="btn btn-primary btn-block"
              onClick={e => {
                e.preventDefault()
                metamaskConnector
                  .activate()
                  .then(({ account }) => {
                    setselected_metamask_wallet_address(account)
                    setwalletConnected(true)
                    metamaskConnector.getChainId().then(res => {
                      let walletChainIds = {
                        1: "rxxoewu0X8",
                        56: "binacesmartchain",
                      }
                      setselected_metamask_chainId(walletChainIds[res]) // res is 0x1
                    })
                  })
                  .catch(error => {
                    console.error("shin", error)
                  })
              }}
            >
              {t("Connect Wallet")}
            </button>
          </div>
        )}
        {(walletConnected || metamask_mode === 1) && (
          <div className="mt-4 d-grid">
            <button className="btn btn-primary btn-block" type="submit">
              {t("Save")}
            </button>
          </div>
        )}
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
            label={t("Name")}
            className="form-control"
            placeholder={t("Name")}
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
              {t("Auto")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink style={{ cursor: "pointer" }} className="active">
              {t("Manual")}
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
              <label>{t("Cryptocurrency")}</label>
              <Select
                options={[
                  {
                    value: "1",
                    label: (
                      <div>
                        <img
                          src="https://static.coinstats.app/coins/EthereumOCjgD.png"
                          height="30px"
                          width="30px"
                        />
                        Ethereum
                      </div>
                    ),
                  },
                  {
                    value: "56",
                    label: (
                      <div>
                        <img
                          src="https://static.coinstats.app/coins/binancecoinOxw.png"
                          width="30"
                        />{" "}
                        Binance
                      </div>
                    ),
                  },
                ]}
                onChange={({ value }) => {
                  setselected_metamask_chainId(value)
                }}
              />
              <AvField
                name="chain_id"
                type="hidden"
                value={selected_metamask_chainId}
              ></AvField>
            </div>

            <div className="mt-3">
              <label>{t("Wallet address")}</label>
              <AvField
                name="wallet_address"
                className="form-control"
                placeholder={t("Wallet address")}
                type="text"
                validate={{
                  required: { value: true },
                }}
              />
            </div>
          </div>
        ))}
        <div className="mt-4 d-grid">
          {/* <button
            className="btn btn-link btn-block text-warning"
            onClick={e => {
              e.preventDefault()
              setFormCountMetamaskManual(formCountMetamaskManual + 1)
            }}
          >
            {t("Add another coin")}
          </button> */}
          <button className="btn btn-primary btn-block " type="submit">
            {t("Save")}
          </button>
        </div>
      </AvForm>
    ),
  }
  function rowRenderer({ key, index, style }) {
    return (
      <div key={key} style={style}>
        {icons.slice(10 * index, 10 + 10 * index).map((icon, i) => (
          <button
            key={i}
            style={{ width: "10%" }}
            className="btn text-center"
            onClick={() => {
              setmanual_portfolio_icon(icon)
              setmodal_icon_menu(false)
            }}
          >
            <i className={"h1 mdi mdi-" + icon}></i>
          </button>
        ))}
      </div>
    )
  }
  return (
    <React.Fragment>
      <Modal
        isOpen={modal_add_portfolio}
        centered={true}
        size="sm"
        toggle={() => {
          setmodal_add_portfolio(false)
        }}
      >
        <div className="modal-header">
          <h5 className="modal-title mx-auto">{t("Add a portfolio")}</h5>
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
            {t("Synchronise an Exchange/Wallet")}
            <i className="bx bx-chevron-right text-primary float-end"></i>
          </button>
          <button
            type="button"
            className="btn btn-light w-100 btn-sm btn-rounded btn-label mt-2 text-start"
            style={{ overflow: "hidden" }}
            onClick={() => {
              setmodal_add_portfolio(false)
              setaddingExchange({ id: "custom" })
              setmodal_manual_portfolio(true)
            }}
          >
            <i className="bx bx-plus label-icon text-warning"> </i>{" "}
            {t("Add manually")}
            <i className="bx bx-chevron-right text-warning float-end"></i>
          </button>
        </div>
      </Modal>
      {/*Select Exchange*/}
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
          <h5 className="modal-title mx-auto">{t("Which Exchange/Wallet?")}</h5>
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
      {/*Manual start*/}
      <Modal
        isOpen={modal_manual_portfolio}
        centered={true}
        toggle={() => {
          setmodal_manual_portfolio(false)
        }}
      >
        <div className="modal-header">
          <button
            className="btn btn-link"
            onClick={() => {
              setmodal_manual_portfolio(false)
              setmodal_add_portfolio(true)
            }}
          >
            <i className="bx bx-left-arrow-alt float-start text-primary h4 m-0"></i>
          </button>
          <h5 className="modal-title mx-auto">{t("Add a manual portfolio")}</h5>
        </div>
        <div className="modal-body">
          <AvForm
            className="form-horizontal row"
            onValidSubmit={(e, v) => {
              handleAddExchange(e, v)
            }}
            model={{ title: t("Custom portfolio"), color: "#556ee6" }}
          >
            <div className="col-6">
              <AvField
                name="title"
                label={t("Portfolio name")}
                className="form-control"
                placeholder={t("Portfolio name")}
                type="text"
                required
              />
            </div>
            <div className="col-2">
              <label>{t("Icon")}</label>
              <AvField
                name="icon"
                type="hidden"
                value={manual_portfolio_icon}
                readOnly
                required
              />
              <button
                className="btn btn-link"
                onClick={e => {
                  e.preventDefault()
                  setmodal_icon_menu(true)
                }}
              >
                <i className={"h4 mdi mdi-" + manual_portfolio_icon}></i>
              </button>
            </div>
            <Modal
              isOpen={modal_icon_menu}
              centered={true}
              size="xl"
              toggle={() => {
                setmodal_icon_menu(false)
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title mt-0">All Icons</h5>
              </div>
              <div className="modal-body">
                <div className="search-box m-5">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("Search") + "..."}
                      onChange={e => {
                        let filteredIcons = icons.filter(icon =>
                          icon.includes(e.target.value)
                        )
                        seticon_list_component(
                          <AutoSizer>
                            {({ height, width }) => (
                              <List
                                height={height}
                                rowCount={Math.ceil(filteredIcons.length / 10)}
                                rowHeight={100}
                                rowRenderer={({ key, index, style }) => (
                                  <div key={key} style={style}>
                                    {filteredIcons
                                      .slice(10 * index, 10 + 10 * index)
                                      .map((icon, i) => (
                                        <button
                                          key={i}
                                          style={{ width: "10%" }}
                                          className="btn text-center"
                                          onClick={() => {
                                            setmanual_portfolio_icon(icon)
                                            setmodal_icon_menu(false)
                                          }}
                                        >
                                          <i
                                            className={"h1 mdi mdi-" + icon}
                                          ></i>
                                        </button>
                                      ))}
                                  </div>
                                )}
                                width={width}
                              />
                            )}
                          </AutoSizer>
                        )
                      }}
                    />
                    <i className="bx bx-search-alt search-icon" />
                  </div>
                </div>
                <div style={{ height: "60vh" }}>{icon_list_component}</div>
              </div>
            </Modal>
            <div className="col-4">
              <label>{t("Color")}</label>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <input
                    className="p-0 h-100"
                    type="color"
                    defaultValue="#556ee6"
                    onChange={e => {
                      setcolorRgb(e.target.value)
                    }}
                  />
                </div>
                <AvInput
                  readOnly
                  name="color"
                  type="text"
                  className="form-control"
                  value={colorRgb}
                />
              </div>
            </div>
            <div className="mt-4 d-grid">
              <button className="btn btn-primary btn-block " type="submit">
                {t("Next")}
              </button>
            </div>
          </AvForm>
        </div>
      </Modal>
      {/*Connect Exchange*/}
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
                <h4 className="modal-title text-center">{t("Connect API")}</h4>
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
                {howToAddData[exactAddingMethod].steps.map((step, i) => (
                  <p key={i}>
                    <span className="text-danger">{i + 1}.</span> {t(step)}
                  </p>
                ))}
              </div>
            </div>
          )}
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
// export default CrudPortfolio
export default connect(mapStateToProps, {
  addUserExchange,
  loadUserExchanges,
  loadExchangeTransactions,
})(CrudPortfolio)
