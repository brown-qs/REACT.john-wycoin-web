import React, { useState } from "react"
import ReactSelect from "react-select"
import { get } from "../../helpers/api_helper"

const Select = props => {
  let timer = false
  const [loading, setloading] = useState(false)

  return (
    <ReactSelect
      {...props}
      isLoading={loading}
      classNamePrefix="select2-selection"
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
      onMenuOpen={props.onMenuOpen}
    />
  )
}

export default Select
