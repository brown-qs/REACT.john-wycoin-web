export const numberFormatter = cell => {
  cell = parseFloat(cell).toFixed(6)
  if (localStorage.getItem("I18N_LANGUAGE") == "fr")
    cell = cell.toString().replace(".", ",")
  return cell
}
export const moneyFormatter = cell => {
  if (localStorage.getItem("app_currency") == "eur")
    cell = parseFloat(cell / localStorage.getItem("eur_rate")).toFixed(2)
  else cell = parseFloat(cell).toFixed(2)

  if (localStorage.getItem("I18N_LANGUAGE") == "fr") {
    cell = cell.toString().replace(".", ",")
    if (localStorage.getItem("app_currency") == "eur") cell = cell + "€"
    else cell = cell + "$"
  } else {
    if (localStorage.getItem("app_currency") == "eur")
      cell = (cell < 0 ? "-" : "") + "€" + Math.abs(cell)
    else cell = (cell < 0 ? "-" : "") + "$" + Math.abs(cell)
  }
  return cell
}
