import React from "react"
import { NavItem, NavLink } from "reactstrap"
import { withTranslation } from "react-i18next"
import classnames from "classnames"
import { exchangeData } from "../../common/data/exchanges"

const PortfolioNavItem = props => {
  return (
    <NavItem>
      <NavLink
        style={{ cursor: "pointer" }}
        className={classnames({
          active: props.isActive,
        })}
        onClick={() => {
          props.onToggleExchange()
        }}
      >
        {props.portfolio.exchange === "custom" && (
          <i
            className={
              "h5 me-1 mdi mdi-" +
              (props.portfolio.metadata.icon ?? "briefcase-variant-outline")
            }
            style={{ color: props.portfolio.metadata.color }}
          ></i>
        )}
        {props.portfolio.exchange != "custom" && (
          <img
            src={
              exchangeData.find(exData => exData.id == props.portfolio.exchange)
                .img
            }
          />
        )}
        {props.portfolio.title}
        <div className="float-end">
          {props.portfolio.exchange === "custom" && (
            <button
              onClick={e => {
                props.onSettransactionAddingPortfolio(props.portfolio.id)
              }}
              className="btn btn-primary px-1 py-0 mx-1"
              style={{ borderRadius: "50%" }}
            >
              <i className="mdi mdi-plus" />
            </button>
          )}
          <button
            onClick={e => {}}
            className="btn btn-success px-1 py-0 mx-1"
            style={{ borderRadius: "50%" }}
          >
            <i className="mdi mdi-pencil" />
          </button>
          <button
            onClick={e => {}}
            className="btn btn-danger px-1 py-0 mx-1"
            style={{ borderRadius: "50%" }}
          >
            <i className="mdi mdi-minus" />
          </button>
        </div>
      </NavLink>
    </NavItem>
  )
}

export default withTranslation()(PortfolioNavItem)
