import React, { useState } from "react"
import ReactSelect from "react-select"
import { get } from "../../helpers/api_helper"

const Select = props => {
  let timer = false
  const [loading, setloading] = useState(false)

  return (
    <ReactSelect
      isLoading={loading}
      theme={theme => ({
        ...theme,
        borderRadius: 0,
        colors:
          localStorage.getItem("APP_THEME") == "dark"
            ? {
                ...theme.colors,
                text: "orangered",
                neutral0: "#32394e",
                neutral20: "#32394e",
                neutral30: "var(--input-color)",
                neutral80: "var(--input-color)",
              }
            : { ...theme.colors },
      })}
      options={props.options}
      filterOption={() => true}
      onInputChange={e => {
        if (e == "") return
        setloading(true)
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          get(props.searchUrl + e).then(({ data }) => {
            setloading(false)
            props.afterSearch(data)
          })
          timer = false
        }, 2000)
      }}
      onChange={props.onChange}
    />
  )
}

export default Select
